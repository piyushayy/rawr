-- Migration: Stock Requests (Back-in-Stock Alerts)
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.stock_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, product_id)
);

-- Enable RLS
ALTER TABLE public.stock_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert their email (even guests)
DROP POLICY IF EXISTS "Anyone can insert stock requests" ON public.stock_requests;
CREATE POLICY "Anyone can insert stock requests" ON public.stock_requests 
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Users can see their own requests
DROP POLICY IF EXISTS "Users can view own stock requests" ON public.stock_requests;
CREATE POLICY "Users can view own stock requests" ON public.stock_requests 
    FOR SELECT 
    USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email = user_email) 
        OR 
        user_email = current_setting('request.jwt.claims', true)::json->>'email'
    );
