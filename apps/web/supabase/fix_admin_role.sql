-- Ensure role column exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator'));

-- Update the user to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'piyushkaushik121@gmail.com');

-- Verify (Optional, will show in output)
SELECT email, role 
FROM public.profiles 
JOIN auth.users ON profiles.id = auth.users.id
WHERE email = 'piyushkaushik121@gmail.com';
