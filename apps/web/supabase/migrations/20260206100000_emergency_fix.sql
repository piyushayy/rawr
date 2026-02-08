-- 1. Fix Missing release_date column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS release_date timestamp with time zone;

-- 2. Fix Missing admin_notes and email on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clout_score integer DEFAULT 0;

-- 3. Fix Customer Metrics View (The CRM core)
DROP VIEW IF EXISTS public.customer_metrics;
CREATE OR REPLACE VIEW public.customer_metrics AS
SELECT 
  p.id as user_id,
  p.full_name,
  p.email,
  p.created_at as joined_at,
  p.clout_score,
  p.admin_notes,
  count(o.id) as order_count,
  coalesce(sum(o.total) filter (where o.status in ('paid', 'shipped', 'completed')), 0) as total_spend,
  max(o.created_at) as last_order
FROM public.profiles p
LEFT JOIN public.orders o ON p.id = o.user_id
GROUP BY p.id;

-- 4. Ensure Role exists and is correct
-- Create enum if not exists (postgres workaround for idempotent enum)
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('customer', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'customer';
-- Note: We skip the CHECK constraint for now to avoid migration conflicts if data exists, 
-- but we can add it later. The text type is flexible enough.

-- 5. Force Admin Role for the specific user (Idempotent)
UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'piyushkaushik121@gmail.com'
);

-- 6. Refresh Schema Cache workaround (Not a real command but notifying the system)
NOTIFY pgrst, 'reload config';
