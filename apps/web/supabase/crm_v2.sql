-- 1. Add email and admin_notes to profiles
alter table public.profiles
add column if not exists email text,
add column if not exists admin_notes text;

-- 2. Update existing profiles with email (This needs privilege, normally done via server script, but we can try a trigger for new ones)
-- We'll create a trigger to sync email from auth.users on update/insert
create or replace function public.handle_user_email_sync()
returns trigger as $$
begin
  -- For new users
  if (TG_OP = 'INSERT') then
      update public.profiles set email = new.email where id = new.id;
  end if;
  -- For email updates
  if (TG_OP = 'UPDATE') then
      update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users (Careful, triggers on auth.users are powerful)
-- Note: In Supabase, you can set triggers on auth.users.
-- Check if trigger exists first to avoid error? Supabase SQL editor handles replace, but trigger creation might fail if exists.
drop trigger if exists on_auth_user_email_sync on auth.users;
create trigger on_auth_user_email_sync
  after update on auth.users
  for each row execute procedure public.handle_user_email_sync();

-- Also update the handle_new_user function to include email
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone_number, avatar_url, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 3. Create a View for CRM Stats (LTV, Order Count) - High Performance
drop view if exists public.customer_metrics;
create or replace view public.customer_metrics as
select 
  p.id as user_id,
  p.full_name,
  p.email,
  p.created_at as joined_at,
  p.clout_score,
  p.admin_notes,
  count(o.id) as order_count,
  coalesce(sum(o.total) filter (where o.status in ('paid', 'shipped', 'completed')), 0) as total_spend,
  max(o.created_at) as last_order
from public.profiles p
left join public.orders o on p.id = o.user_id
group by p.id;
