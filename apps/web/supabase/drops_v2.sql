
-- Create drops table for global settings
CREATE TABLE IF NOT EXISTS public.drops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  drop_date timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Drops" ON public.drops FOR SELECT USING (true);

-- Allow admin full access
CREATE POLICY "Admin All Drops" ON public.drops FOR ALL USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Insert initial dummy drop
INSERT INTO public.drops (title, drop_date)
VALUES ('SYSTEM REBOOT', now() + interval '7 days');
