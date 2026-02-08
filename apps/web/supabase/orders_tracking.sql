
-- Add tracking number to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number text;
