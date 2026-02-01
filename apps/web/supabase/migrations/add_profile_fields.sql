
alter table public.profiles
add column if not exists birthday date,
add column if not exists gender text,
add column if not exists marketing_opt_in boolean default false;
