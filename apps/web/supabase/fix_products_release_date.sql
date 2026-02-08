-- Add release_date to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS release_date timestamp with time zone;
