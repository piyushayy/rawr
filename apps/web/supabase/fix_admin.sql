-- STEP 1: Ensure the role column exists (Safeguard)
alter table public.profiles 
add column if not exists role text not null default 'customer';

-- STEP 2: Make the user an admin
-- Replace 'piyushkukreja90@gmail.com' with your actual email if different
update public.profiles
set role = 'admin'
where id in (
  select id from auth.users where email = 'piyushkukreja90@gmail.com'
);

-- STEP 3: Verify it worked
-- Explicitly selecting public.profiles.role to avoid ambiguity
select auth.users.email, public.profiles.role 
from auth.users 
join public.profiles on public.profiles.id = auth.users.id
where public.profiles.role = 'admin';
