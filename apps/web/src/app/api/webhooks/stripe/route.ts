
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { createClient } from "@/utils/supabase/server";
import { sendOrderConfirmation } from "@/utils/email";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.PaymentIntent;

    if (event.type === "payment_intent.succeeded") {
        const orderId = session.metadata.orderId;

        // If we have an orderId, update it directly
        if (orderId && orderId !== "pending" && orderId !== "temp-id") {
            const supabase = await createClient();

            const shipping = session.shipping;
            let addressData = null;

            if (shipping?.address) {
                const nameParts = shipping.name?.split(' ') || ['Unknown'];
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || '';

                addressData = {
                    firstName,
                    lastName,
                    address: [shipping.address.line1, shipping.address.line2].filter(Boolean).join(', '),
                    city: shipping.address.city,
                    state: shipping.address.state,
                    zip: shipping.address.postal_code,
                    country: shipping.address.country
                };
            }

            // Update Order Status and Address
            const { error } = await supabase
                .from('orders')
                .update({
                    status: 'paid',
                    address: addressData
                })
                .eq('id', orderId);

            if (error) {
                console.error('Error updating order:', error);
                return new NextResponse('Database Error', { status: 500 });
            }

            // Retrieve Order to get User ID and Email
            const { data: order } = await supabase
                .from('orders')
                .select('*, profiles(email)') // Assuming relations or just get user_id
                .eq('id', orderId)
                .single();

            // If we can't join easily, we just use the customer email from Stripe if available
            const email = session.receipt_email || (order as any)?.profiles?.email; // Fallback

            if (email) {
                await sendOrderConfirmation(email, orderId, session.amount / 100);
            }

            // ---- SaaS CRM Event Tracking (PURCHASE) ----
            if (order && order.user_id) {
                // 1. Log the Purchase Event
                const purchaseAmount = session.amount / 100;
                await supabase.from("customer_events").insert({
                    customer_id: order.user_id,
                    event_type: 'PURCHASE',
                    event_data: {
                        order_id: orderId,
                        amount: purchaseAmount,
                        currency: session.currency
                    },
                    source: 'system',
                    url: '/api/webhooks/stripe'
                });

                // 2. Ensure customer CDP profile exists and update LTV / Order Count
                // Use RPC or an upsert to gracefully handle incrementing without race conditions
                // For MVP: direct fetch and update
                const { data: crmUser } = await supabase.from('crm_customers').select('*').eq('id', order.user_id).single();

                if (crmUser) {
                    await supabase.from('crm_customers').update({
                        total_orders: crmUser.total_orders + 1,
                        lifetime_value: Number(crmUser.lifetime_value) + purchaseAmount,
                        last_active_at: new Date().toISOString()
                    }).eq('id', order.user_id);
                } else if (email) { // Create them if they don't exist yet (e.g., existing users before CRM deployment)
                    await supabase.from('crm_customers').insert({
                        id: order.user_id,
                        email: email,
                        total_orders: 1,
                        lifetime_value: purchaseAmount
                    });
                }
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
