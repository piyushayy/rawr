import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
    console.error("No SUPABASE_SERVICE_ROLE_KEY found in .env.local. Please make sure it's set.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function main() {
    const email = 'piyushkaushik121@gmail.com';
    const password = '123456';

    console.log(`Checking if user ${email} exists...`);

    // Check if user exists by listing users (simplified check, usually we'd just try to create and catch error, or update)
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("Error listing users:", listError.message);
        process.exit(1);
    }

    const existingUser = users.users.find(u => u.email === email);

    if (existingUser) {
        console.log("User already exists. Updating password and confirming email...");
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password, email_confirm: true }
        );

        if (updateError) {
            console.error("Error updating user:", updateError.message);
        } else {
            console.log("Successfully updated existing user password to 123456 and confirmed email.");
        }
    } else {
        console.log("Creating new user...");
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name: 'Admin Piyush'
            }
        });

        if (createError) {
            console.error("Error creating user:", createError.message);
        } else {
            console.log("Successfully created user with confirmed email.");
        }
    }

    console.log("Admin account is ready. You can now log in at /login with:");
    console.log("Email:", email);
    console.log("Password:", password);
}

main();
