-- Add video_url to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Update seed/existing data (optional)
UPDATE products 
SET video_url = 'https://videos.pexels.com/video-files/5309381/5309381-uhd_2160_3840_25fps.mp4' 
WHERE id IN (SELECT id FROM products LIMIT 5);
