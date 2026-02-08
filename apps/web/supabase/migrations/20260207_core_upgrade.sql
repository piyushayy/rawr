-- Migration: Core E-Commerce & CRM Upgrade (Phase 1)
-- Run this in Supabase SQL Editor

-- 1. Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Product Variants
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    size TEXT NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    price_override NUMERIC, -- If XL costs more
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
    value NUMERIC NOT NULL,
    min_order_value NUMERIC DEFAULT 0,
    usage_limit INTEGER, -- Total times coupon can be used
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe', 'cod')),
    transaction_id TEXT, -- Payment ID from provider
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Update Profiles for CRM
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS ltv NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_purchase_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 7. Update Orders for robust tracking
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS courier_name TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB; -- Snapshot of address at time of order

-- 8. Enable Row Level Security (RLS) on new tables
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 9. Create Policies (Simple MVP Policies)

-- VARIANTS: Public Read, Admin Write
DROP POLICY IF EXISTS "Public read variants" ON public.product_variants;
CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT USING (true);

-- PAYMENTS: Users read own, Admin read all
DROP POLICY IF EXISTS "Users see own payments" ON public.payments;
CREATE POLICY "Users see own payments" ON public.payments FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));

-- COUPONS: Public Read (Active only?), Admin Write
DROP POLICY IF EXISTS "Public read coupons" ON public.coupons;
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true); -- Ideally restrict to active ones or validation logic

-- SUPPORT: Users read own, Admin full access
DROP POLICY IF EXISTS "Users manage own tickets" ON public.support_tickets;
CREATE POLICY "Users manage own tickets" ON public.support_tickets 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

