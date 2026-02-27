-- Storage Hardening Migration
-- This script restricts file uploads to prevent malicious executables and over-sized payloads.

CREATE OR REPLACE FUNCTION public.check_storage_mimetype()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.mimetype NOT IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif') THEN
        RAISE EXCEPTION 'Invalid File Type: Only JPEG, PNG, WEBP, and GIF are allowed for Security Reasons.';
    END IF;
    -- File size validation is often better handled in application server pre-signed uploads
    -- or via Supabase Dashboard configuration (Max Upload Size).
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to storage.objects (Requires superuser usually to mess with storage schema directly, but doable via Supabase migrations)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'storage_mimetype_check') THEN
        CREATE TRIGGER storage_mimetype_check
        BEFORE INSERT OR UPDATE ON storage.objects
        FOR EACH ROW
        EXECUTE FUNCTION public.check_storage_mimetype();
    END IF;
END $$;
