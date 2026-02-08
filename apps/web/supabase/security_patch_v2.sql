-- SECURITY PATCH V2.1: RLS ONLY
-- Author: RAWR Security Team
-- Date: 2026-02-06
-- Objective: Secure Profiles via RLS (Bypassed by Service Role/Definer Functions)

BEGIN;

-- Helper: Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 

--------------------------------------------------------------------------------
-- 1. SECURE PRODUCTS (Admins Only Write, Everyone Read)
--------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Read
DROP POLICY IF EXISTS "Public read access" ON public.products;
CREATE POLICY "Public read access" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;

-- Write (Insert, Update, Delete)
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

--------------------------------------------------------------------------------
-- 2. SECURE DROPS (Admins Only)
--------------------------------------------------------------------------------
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read drops" ON public.drops;
CREATE POLICY "Public read drops" ON public.drops FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage drops" ON public.drops;
CREATE POLICY "Admins manage drops" ON public.drops
  FOR ALL USING ( public.is_admin() );

--------------------------------------------------------------------------------
-- 3. SECURE PROFILES (The Critical Fix)
--------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3A. READ: Users view own, Admins view all
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users view own, Admins view all" ON public.profiles
  FOR SELECT
  USING ( auth.uid() = id OR public.is_admin() );

-- 3B. UPDATE: 

-- Rule 1: Admins can update anything
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE
  USING ( public.is_admin() );

-- Rule 2: Users can update OWN profile, restricted via WITH CHECK
-- We compare the NEW value (in the row passed to check) with the DB Value.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users update own safe fields" ON public.profiles
  FOR UPDATE
  USING ( auth.uid() = id )
  WITH CHECK (
    auth.uid() = id 
    -- Ensure critical fields match the CURRENT database value (i.e. No Change)
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND clout_score = (SELECT clout_score FROM public.profiles WHERE id = auth.uid())
    AND (admin_notes IS NULL OR admin_notes = (SELECT admin_notes FROM public.profiles WHERE id = auth.uid()))
  );

COMMIT;
