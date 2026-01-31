-- Create gallery_posts table
create table public.gallery_posts (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  caption text,
  clout_points int default 0,
  created_at timestamp with time zone not null default now(),
  constraint gallery_posts_pkey primary key (id)
);

-- Enable RLS
alter table public.gallery_posts enable row level security;

-- Policy: Everyone can view
create policy "Public can view gallery" on public.gallery_posts
  for select using (true);

-- Policy: Owners can insert
create policy "Users can post to gallery" on public.gallery_posts
  for insert with check (auth.uid() = user_id);

-- Policy: Owners can delete
create policy "Users can delete own gallery posts" on public.gallery_posts
  for delete using (auth.uid() = user_id);

-- Add Clout Score to Profiles
alter table public.profiles
add column if not exists clout_score int default 0;

-- Function to award clout
create or replace function public.award_clout()
returns trigger as $$
begin
    -- Check if insert is for gallery_posts (50pts)
    if (TG_TABLE_NAME = 'gallery_posts') then
        update public.profiles 
        set clout_score = clout_score + 50 
        where id = new.user_id;
    end if;
    
    -- Check if insert is for orders (100pts)
    if (TG_TABLE_NAME = 'orders') then
        update public.profiles 
        set clout_score = clout_score + 100 
        where id = new.user_id;
    end if;

    return new;
end;
$$ language plpgsql security definer;

-- Trigger for Gallery
create trigger on_gallery_post
  after insert on public.gallery_posts
  for each row execute procedure public.award_clout();

-- Trigger for Orders (Already have orders table, just adding trigger)
create trigger on_order_clout
  after insert on public.orders
  for each row execute procedure public.award_clout();
