-- Create addresses table
create table public.addresses (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'USA',
  is_default boolean not null default false,
  created_at timestamp with time zone not null default now(),
  constraint addresses_pkey primary key (id)
);

-- Enable RLS
alter table public.addresses enable row level security;

-- Policy: Users can view their own addresses
create policy "Users can view own addresses" on public.addresses
  for select using (auth.uid() = user_id);

-- Policy: Users can insert their own addresses
create policy "Users can insert own addresses" on public.addresses
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own addresses
create policy "Users can update own addresses" on public.addresses
  for update using (auth.uid() = user_id);

-- Policy: Users can delete their own addresses
create policy "Users can delete own addresses" on public.addresses
  for delete using (auth.uid() = user_id);

-- Check for default address constraint (partial index or trigger could be used, but logic in app is easier for now)
-- We will use a function to unset other defaults when setting a new one
create or replace function public.handle_default_address()
returns trigger as $$
begin
  if new.is_default then
    update public.addresses
    set is_default = false
    where user_id = new.user_id
      and id <> new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_address_updated_or_inserted
  before insert or update on public.addresses
  for each row execute procedure public.handle_default_address();
