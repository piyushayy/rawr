import { createClient } from "./supabase/server";
import { headers } from "next/headers";

/**
 * Throws an error if the user is not an authenticated Admin.
 * Returns the verified user object.
 */
export async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized: Identity verification failed.");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        // Log unauthorized attempt silently
        await logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', user.id, { attempted_action: 'verifyAdmin' });
        throw new Error("Forbidden: Strict Admin clearance required.");
    }

    return user;
}

/**
 * Logs a security event to the audit table.
 */
export async function logSecurityEvent(actionType: string, actorId?: string | null, details: Record<string, any> = {}) {
    try {
        const supabase = await createClient();
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';

        await supabase.from('security_audit_logs').insert({
            action_type: actionType,
            actor_id: actorId,
            ip_address: ip,
            details: details
        });
    } catch (error) {
        console.error("Failed to write to security audit log:", error);
    }
}
