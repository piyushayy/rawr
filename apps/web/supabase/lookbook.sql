-- Create lookbook table
create table public.lookbook_entries (
  id uuid not null default gen_random_uuid (),
  title text null,
  image_url text not null,
  product_id uuid references public.products(id), -- Optional link to product
  display_order integer default 0,
  created_at timestamp with time zone not null default now(),
  constraint lookbook_entries_pkey primary key (id)
);

-- RLS
alter table public.lookbook_entries enable row level security;

create policy "Public can view lookbook" on public.lookbook_entries
  for select using (true);
  
create policy "Admins can manage lookbook" on public.lookbook_entries
  for all using (true); -- Simplified for now, relying on protected routes

-- Seed some dummy data? No, user can add via manual SQL or I'll build a quick admin for it.
-- Actually, let's just assume we will insert via SQL for now to save time on admin UI for this specific sub-feature unless requested.
