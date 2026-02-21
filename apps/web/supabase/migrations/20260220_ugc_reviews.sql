-- Add images column to reviews table for User Gen Content
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS images TEXT[] NULL;

-- Create Storage Bucket for UGC (Product Review Photos)
INSERT INTO storage.buckets (id, name, public) VALUES ('ugc-images', 'ugc-images', true) ON CONFLICT DO NOTHING;

-- Storage Policies for ugc-images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'ugc-images');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ugc-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own uploads" ON storage.objects FOR UPDATE USING (auth.uid() = owner);
CREATE POLICY "Users can delete their own uploads" ON storage.objects FOR DELETE USING (auth.uid() = owner);
