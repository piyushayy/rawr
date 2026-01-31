-- Add admin_notes column to profiles
alter table public.profiles
add column if not exists admin_notes text null;

-- Only admins can see/edit admin_notes (RLS)
-- We need to update the Profiles policies to allow Admins to view ALL profiles.
-- Current policy: "Users can view own profile"

create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all profiles" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
