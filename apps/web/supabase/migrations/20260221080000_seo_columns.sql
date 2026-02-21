-- Add SEO fields to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;
