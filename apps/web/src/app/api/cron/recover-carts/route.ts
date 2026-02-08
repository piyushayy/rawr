import { createClient } from "@/utils/supabase/server";
import { sendCartRecoveryEmail } from "@/utils/email";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // 1. Verify Authentication (Supports Vercel Header or Query Param)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const authHeader = request.headers.get('authorization');

    // Expected token from Environment
    const CRON_SECRET = process.env.CRON_SECRET;

    if (CRON_SECRET) {
        const isValid =
            (authHeader === `Bearer ${CRON_SECRET}`) ||
            (secret === CRON_SECRET);

        if (!isValid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const supabase = await createClient();

    // 1. Find Pending Orders created > 1 hour ago AND < 24 hours ago AND recovery_sent = false
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: abandonedOrders, error } = await supabase
        .from('orders')
        .select(`
            id,
            total,
            created_at,
            user_id,
            profiles (email, full_name, clout_score),
            order_items (products(title))
        `)
        .eq('status', 'pending') // Assuming 'pending' means not paid
        .eq('recovery_sent', false) // Ensure column exists!
        .lt('created_at', oneHourAgo)
        .gt('created_at', twentyFourHoursAgo);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!abandonedOrders || abandonedOrders.length === 0) {
        return NextResponse.json({ message: 'No abandoned carts found.' });
    }

    // 2. Send Emails
    const results = await Promise.all(abandonedOrders.map(async (order) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles as any;

        if (!profile?.email) return null;

        await sendCartRecoveryEmail(
            profile.email,
            profile.full_name || 'Member',
            `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rawr.stream'}/checkout?recovery=${order.id}`
        );

        // 3. Mark as Sent
        await supabase.from('orders').update({ recovery_sent: true }).eq('id', order.id);

        return order.id;
    }));

    return NextResponse.json({
        success: true,
        recovered_count: results.filter(Boolean).length
    });
}
