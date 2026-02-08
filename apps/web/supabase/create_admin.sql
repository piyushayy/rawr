-- First, you need to sign up the user via Supabase Auth UI or API
-- Then run this to grant admin role

-- Update the profile to admin role for the specified email
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'piyushkaushik121@gmail.com';

-- If the profile doesn't exist yet, you may need to create it after signup:
-- INSERT INTO public.profiles (id, email, role, full_name)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'piyushkaushik121@gmail.com'),
--   'piyushkaushik121@gmail.com',
--   'admin',
--   'Admin User'
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
