
"use server";

import { stripe } from "@/utils/stripe";
import { processOrder } from "./order-service";
import { createClient } from "@/utils/supabase/server";
import { CartItem } from "@/types";

export async function createPaymentIntent(items: CartItem[], currency: string = 'usd', metadata: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" };
    }

    // 1. Create Pending Order & Check Stock
    // This decrement stock immediately. If user abandons, stock is held until timed out (cron job needed) or manual cleanup.
    // For a "Drop", this holding strategy is aggressive but prevents overselling.
    const orderResult = await processOrder(items, user.id);

    if (orderResult.error || !orderResult.success) {
        return { error: orderResult.error };
    }

    // 2. Create Stripe Payment Intent for that Order
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(orderResult.total! * 100),
            currency,
            metadata: {
                ...metadata,
                orderId: orderResult.orderId // IMPORTANT: Link Stripe to Supabase Order
            },
            automatic_payment_methods: {
                enabled: true,
            },
            // receipt_email: user.email 
        });

        return { clientSecret: paymentIntent.client_secret, id: paymentIntent.id, orderId: orderResult.orderId };
    } catch (error) {
        console.error("Error creating payment intent:", error);
        return { error: "Failed to create payment session." };
    }
}
