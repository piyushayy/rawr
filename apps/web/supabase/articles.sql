-- Create articles table
create table public.articles (
  id uuid not null default gen_random_uuid (),
  title text not null,
  slug text not null unique,
  excerpt text null,
  content text not null, -- Markdown or HTML
  image_url text null,
  author_id uuid references auth.users (id),
  published boolean default false,
  published_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  constraint articles_pkey primary key (id)
);

-- Enable RLS
alter table public.articles enable row level security;

-- Policy: Everyone can read published articles
create policy "Public can read published articles" on public.articles
  for select using (published = true);

-- Policy: Admins can do everything
-- (Assuming we trust service_role or add admin check later, for now we can rely on application-level checks or reuse the pattern if we had an admin flag)
-- But for now, let's allow read for all (even drafts if we want preview? No, strict.)

create policy "Admins can manage articles" on public.articles
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      -- and profiles.role = 'admin' -- We don't have role column properly enforced in policies yet, usually strictly app side check or service role.
      -- For simplify, currently relying on CheckAdmin in server actions. 
      -- But for RLS, let's just allow all authenticated users to *read* all for now (internal team) or restrict.
    )
  );

-- Actually, let's keep it simple:
-- Public: Read Published
-- Auth (Admin): Read All, Insert, Update, Delete. 
-- Since we are manually protecting admin routes, we can just allow specific users or all auth users to manage if we assume only admins login to admin panel.
-- Safest is to just allow service_role to bypass (which server actions use) and public to read published.

-- Re-doing policies for clarity:

drop policy if exists "Public can read published articles" on public.articles;

create policy "Public can read published articles" on public.articles
  for select using (published = true);

create policy "Admins can manage articles" on public.articles
  for all using (
     auth.uid() in (
         select id from public.profiles where email in ('piyushkukreja90@gmail.com') -- Hardcoded admin for safety or just rely on server actions
     )
  );
-- Note: The above policy is brittle. Better to rely on the App's 'checkAdmin' and use Service Role (supabase-js admin) for mutations? 
-- Our 'createClient' uses standard anon/user key.
-- Let's just allow Authenticated users to view all (drafts), and insert/update.
-- If we want to be strict, we need a role column.
