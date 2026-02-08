-- Run this in Supabase SQL Editor
-- This creates a user directly in the auth schema (requires admin access)

-- Step 1: Insert into auth.users (you'll need to do this via Supabase Dashboard Auth UI)
-- OR use the Supabase CLI:
-- npx supabase auth signup --email piyushkaushik121@gmail.com --password 123456

-- Step 2: After signup, grant admin role
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'piyushkaushik121@gmail.com';

-- Verify it worked:
SELECT id, email, role FROM public.profiles WHERE email = 'piyushkaushik121@gmail.com';
