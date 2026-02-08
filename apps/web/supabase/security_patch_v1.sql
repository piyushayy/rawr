-- SECURITY PATCH V1: LOCKDOWN
-- Author: RAWR Security Team (Agentic AI)
-- Date: 2026-02-06
-- Objective: Prevent Privilege Escalation and Unauthorized Data Tampering

BEGIN;

--------------------------------------------------------------------------------
-- 1. SECURE PROFILES (Prevent 'role' and 'clout_score' tampering)
--------------------------------------------------------------------------------

-- Drop the dangerous "update own profile" policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a restrictive update policy
-- Users can ONLY update safe fields. 
-- Note: Supabase RLS using 'USING' checks row visibility, 'WITH CHECK' checks new data.
-- However, Postgres policies apply to the ROW, not specific columns directly in the CREATE POLICY syntax normally.
-- BUT, we can use a Trigger or specific boolean logic. 
-- EASIEST & SAFEST: Revoke UPDATE permission on the table for 'authenticated' and Grant it only on specific columns.

-- Revoke default broad update (if any)
REVOKE UPDATE ON public.profiles FROM authenticated;
REVOKE UPDATE ON public.profiles FROM anon;

-- Grant column-specific update
GRANT UPDATE (full_name, phone_number, avatar_url, address, email, marketing_opt_in) ON public.profiles TO authenticated;

-- Re-create the row-level policy to allow "access" to the row for updating
-- (This effectively says "If you own the row, you can try to update it, but only the columns above will succeed")
CREATE POLICY "Users can update own safe fields" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


--------------------------------------------------------------------------------
-- 2. SECURE PRODUCTS & SYSTEM TABLES (Double Check)
--------------------------------------------------------------------------------

-- Ensure Anon/Authenticated CANNOT write to products
REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.drops FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.articles FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.measurements FROM anon, authenticated; -- (if exists)

-- READ ONLY for public
CREATE POLICY "Public read access" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products; -- Cleanup old name if needed

--------------------------------------------------------------------------------
-- 3. SECURE ORDERS (Prevent status tampering)
--------------------------------------------------------------------------------

-- Users can insert (create) orders
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can View their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users CANNOT Update orders (Status updates logic is server-side via Service Role)
REVOKE UPDATE ON public.orders FROM authenticated;
REVOKE UPDATE ON public.orders FROM anon;

--------------------------------------------------------------------------------
-- 4. SECURE REVIEWS (Prevent rating inflation)
--------------------------------------------------------------------------------
-- Users can Insert reviews
-- Users can Update their own reviews (Wait, should they? Maybe fix typo?)
-- We'll allow them to update comment/rating but NOT 'is_verified' status if we had one.
-- Currently reviews table is simple. Let's revoke UPDATE on 'is_verified' if it exists.

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'is_verified') THEN
    REVOKE UPDATE ON public.reviews FROM authenticated;
    GRANT UPDATE (rating, comment) ON public.reviews TO authenticated;
  END IF;
END $$;


COMMIT;
