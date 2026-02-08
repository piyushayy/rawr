-- DATA MIGRATION: Populate product_variants from existing products table
-- Run this AFTER creating the tables in the previous step.

INSERT INTO public.product_variants (product_id, sku, size, stock_quantity)
SELECT 
    id, 
    -- Generate SKU: title-slug-size (e.g. "vintage-tee-m")
    -- Limit SKU length or handle duplicates if needed, but for now assuming unique title/size combo per product
    LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '-', 'g')) || '-' || LOWER(size) || '-' || SUBSTRING(id::text, 1, 4), 
    size,
    stock_quantity
FROM public.products
WHERE id NOT IN (SELECT product_id FROM public.product_variants);

-- Optional: Set stock_quantity on products to 0 or leave as aggregate cache?
-- We will leave it for now as a cache, but source of truth should be variants.
