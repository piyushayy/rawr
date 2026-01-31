-- Add release_date to products table
alter table public.products
add column if not exists release_date timestamp with time zone;

-- Update products policy to allow public to view future products (so they can see the countdown)
-- Existing policy "Public can view products" exists, ensuring it covers all.
-- Usually select policies use (true) for products, so checking...

-- We might want to ensure 'sold_out' logic doesn't conflict, but release_date is separate.
