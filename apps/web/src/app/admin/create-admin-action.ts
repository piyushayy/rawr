"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Creates an admin user account
 * This should only be run once during initial setup
 */
export async function createAdminUser() {
    const supabase = await createClient();

    const email = "piyushkaushik121@gmail.com";
    const password = "123456";

    // 1. Create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (authError) {
        console.error("Auth creation error:", authError);
        return { error: authError.message };
    }

    // 2. Update or create profile with admin role
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: authData.user.id,
            email,
            role: 'admin',
            full_name: 'Admin User',
            clout_score: 0,
        });

    if (profileError) {
        console.error("Profile creation error:", profileError);
        return { error: profileError.message };
    }

    return { success: true, userId: authData.user.id };
}
