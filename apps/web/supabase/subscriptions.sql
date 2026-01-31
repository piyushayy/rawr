create table public.drop_subscriptions (
  id uuid not null default gen_random_uuid (),
  user_id uuid references auth.users (id),
  product_id uuid references public.products (id),
  email text, -- Optional if user not logged in
  phone_number text, -- Optional for SMS
  created_at timestamp with time zone not null default now(),
  constraint drop_subscriptions_pkey primary key (id)
);

-- Enable RLS
alter table public.drop_subscriptions enable row level security;

-- Policy: Authenticated users can create subscriptions
create policy "Users can subscribe" on public.drop_subscriptions
  for insert with check (auth.uid() = user_id or email is not null);

-- Policy: Admin can view all
create policy "Admins can view subscriptions" on public.drop_subscriptions
  for select using (
      exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
