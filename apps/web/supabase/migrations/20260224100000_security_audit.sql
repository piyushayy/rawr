-- Create Security Audit Logs Table
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_type TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id),
    ip_address TEXT,
    details JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Strict Policies: Only Admins can view or insert manually (though service_role can always insert via server)
-- Note: Our server actions will insert using the standard client which runs as the authenticated user.
-- Wait, if unauthorized users try to access, `actor_id` might be null. We should allow inserting if authenticated, 
-- but actually `rbac.ts` will use the regular client. We should just allow INSERT for authenticated users to log their own failures!

CREATE POLICY "Anyone can insert their own audit logs" ON public.security_audit_logs
    FOR INSERT
    WITH CHECK ( true ); -- We allow inserts from anywhere so the server can log guest connection attempts

CREATE POLICY "Only admins can view audit logs" ON public.security_audit_logs
    FOR SELECT
    USING ( public.get_my_role() = 'admin' );
