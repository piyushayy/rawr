-- Add likes count and comments to gallery posts (denormalized for speed)
alter table public.gallery_posts 
add column if not exists likes_count integer default 0;

-- Create likes table
create table public.gallery_likes (
  id uuid not null default gen_random_uuid (),
  user_id uuid references auth.users (id) on delete cascade,
  post_id uuid references public.gallery_posts (id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  constraint gallery_likes_pkey primary key (id),
  unique (user_id, post_id)
);

-- RLS for Likes
alter table public.gallery_likes enable row level security;

create policy "Users can like posts" on public.gallery_likes
  for insert with check (auth.uid() = user_id);

create policy "Users can unlike posts" on public.gallery_likes
  for delete using (auth.uid() = user_id);

create policy "Public can view likes" on public.gallery_likes
  for select using (true);

-- Function to update likes count
create or replace function update_likes_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.gallery_posts
    set likes_count = likes_count + 1
    where id = new.post_id;
  elsif (TG_OP = 'DELETE') then
    update public.gallery_posts
    set likes_count = likes_count - 1
    where id = old.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_like_change
  after insert or delete on public.gallery_likes
  for each row execute procedure update_likes_count();
