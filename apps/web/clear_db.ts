import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE credentials in .env.local.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
    console.log("Connecting to Database to wipe fake data...");

    // 1. Give 'piyushkaushik121@gmail.com' explicitly the 'admin' role in profiles so RLS works.
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error("Failed to list users:", userError.message);
    } else {
        const adminUser = users?.users?.find(u => u.email === 'piyushkaushik121@gmail.com');
        if (adminUser) {
            console.log("Upgrading user to raw 'admin' role in profiles table...");
            const { error: roleErr } = await supabase.from('profiles').upsert({
                id: adminUser.id,
                role: 'admin',
                full_name: 'Piyush'
            });
            if (roleErr) console.error("Could not upsert profile:", roleErr);
        }
    }

    // 2. Wipe fake data
    const tablesToWipe = [
        'customer_events',
        'crm_customers',
        'orders',
        'product_variants',
        'products',
        'lookbooks'
    ];

    for (const table of tablesToWipe) {
        console.log(`Clearing ${table}...`);
        // We use not.is.null on id to effectively "delete all" using REST since TRUNCATE requires SQL
        const { error: delErr } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');

        if (delErr) {
            console.error(`Failed to clear ${table}:`, delErr.message);
        } else {
            console.log(`Success cleared ${table}`);
        }
    }

    console.log("Database cleanup complete! Ready to start fresh.");
}

main();
