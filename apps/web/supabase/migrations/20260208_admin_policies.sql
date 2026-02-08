-- Migration: Admin RLS Policies
-- Ensures Admins have full access to CRM, Orders, and Inventory.

-- 1. Helper function (optional)
-- We assume local check or existing role column 'admin'

-- 1b. Add Marketing Columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS recovery_sent BOOLEAN DEFAULT FALSE;

-- 2. PRODUCTS & VARIANTS
DROP POLICY IF EXISTS "Admin full access variants" ON public.product_variants;
CREATE POLICY "Admin full access variants" ON public.product_variants
    FOR ALL
    USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
    WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- 3. ORDERS
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;
CREATE POLICY "Admin full access orders" ON public.orders
    FOR ALL
    USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
    WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- 4. PAYMENTS
DROP POLICY IF EXISTS "Admin full access payments" ON public.payments;
CREATE POLICY "Admin full access payments" ON public.payments
    FOR ALL
    USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
    WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- 5. COUPONS
DROP POLICY IF EXISTS "Admin full access coupons" ON public.coupons;
CREATE POLICY "Admin full access coupons" ON public.coupons
    FOR ALL
    USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
    WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- 6. SUPPORT TICKETS
DROP POLICY IF EXISTS "Admin full access support" ON public.support_tickets;
CREATE POLICY "Admin full access support" ON public.support_tickets
    FOR ALL
    USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
    WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- 7. PROFILES (CRM Access)
DROP POLICY IF EXISTS "Admin full access profiles" ON public.profiles;
CREATE POLICY "Admin full access profiles" ON public.profiles
    FOR ALL
    USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
    WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
