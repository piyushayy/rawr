-- Create reviews table
create table public.reviews (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text null,
  image_url text null,
  is_verified boolean default false, -- true if user actually bought it
  created_at timestamp with time zone not null default now(),
  constraint reviews_pkey primary key (id)
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policy: Anyone can read reviews
create policy "Anyone can read reviews" on public.reviews
  for select using (true);

-- Policy: Users can insert their own reviews
create policy "Users can insert own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own reviews
create policy "Users can update own reviews" on public.reviews
  for update using (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
create policy "Users can delete own reviews" on public.reviews
  for delete using (auth.uid() = user_id);

-- Storage Bucket for Reviews (Executed via API usually, but SQL can define permissions if bucket exists)
-- We'll assume 'reviews' bucket is created manually or via client, but here are policies
-- insert into storage.buckets (id, name, public) values ('reviews', 'reviews', true);

-- Policy: Users can upload review images
-- create policy "Users can upload review images" on storage.objects
--   for insert with check (bucket_id = 'reviews' and auth.uid() = owner);
