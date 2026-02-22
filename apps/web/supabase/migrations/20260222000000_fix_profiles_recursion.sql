-- Fix Infinite Recursion in Profiles Policy
-- This prevents the "Admin full access profiles" policy from recursively calling itself

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

DROP POLICY IF EXISTS "Admin full access profiles" ON public.profiles;

CREATE POLICY "Admin full access profiles" ON public.profiles
    FOR ALL
    USING ( public.get_my_role() = 'admin' )
    WITH CHECK ( public.get_my_role() = 'admin' );
