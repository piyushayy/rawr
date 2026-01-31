-- Create wishlists table
create table public.wishlists (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  constraint wishlists_pkey primary key (id),
  constraint wishlists_user_id_product_id_key unique (user_id, product_id)
);

-- Enable RLS
alter table public.wishlists enable row level security;

-- Policy: Users can view their own wishlist
create policy "Users can view own wishlist" on public.wishlists
  for select using (auth.uid() = user_id);

-- Policy: Users can insert into their own wishlist
create policy "Users can modify own wishlist" on public.wishlists
  for all using (auth.uid() = user_id);
