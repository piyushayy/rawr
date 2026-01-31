-- Create table for storing global activity stream
create table public.live_events (
  id uuid not null default gen_random_uuid(),
  type text not null check (type in ('purchase', 'review', 'signup', 'drop')),
  meta jsonb not null default '{}'::jsonb, -- Stores product_title, user_first_name, location, etc.
  created_at timestamp with time zone not null default now(),
  constraint live_events_pkey primary key (id)
);

-- Enable RLS
alter table public.live_events enable row level security;

-- Everyone can read events (it's public hype)
create policy "Everyone can view live events" on public.live_events
  for select using (true);

-- Only system/server can insert (via triggers or server actions)
-- We will rely on Service Role key for inserting events in backend, or specific triggers
-- For simplicity in triggers, we allow inserts from authenticated users if we use triggers that run as them.
-- Actually, triggers run with the privileges of the function owner (Definer).

-- Triggers to auto-generate events

-- 1. On New Order
create or replace function public.log_order_event()
returns trigger as $$
begin
  insert into public.live_events (type, meta)
  values (
    'purchase',
    jsonb_build_object(
      'user_id', new.user_id,
      'total', new.total,
      'location', 'Earth' -- We don't have geo-ip yet
    )
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_order_created_log
  after insert on public.orders
  for each row execute procedure public.log_order_event();

-- 2. On New Review
create or replace function public.log_review_event()
returns trigger as $$
begin
  insert into public.live_events (type, meta)
  values (
    'review',
    jsonb_build_object(
      'product_id', new.product_id,
      'rating', new.rating
    )
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_created_log
  after insert on public.reviews
  for each row execute procedure public.log_review_event();
