-- Create inbox table
create table public.inbox (
  id uuid not null default gen_random_uuid(),
  type text not null check (type in ('general', 'support', 'career', 'feedback')),
  name text not null,
  email text not null,
  subject text null,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamp with time zone not null default now(),
  constraint inbox_pkey primary key (id)
);

-- Enable RLS
alter table public.inbox enable row level security;

-- Policy: Admin can do everything
create policy "Admins can manage inbox" on public.inbox
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Public can insert (for contact forms)
create policy "Public can insert inbox" on public.inbox
  for insert with check (true);
