
"use server";

import { stripe } from "@/utils/stripe";
import { processOrder } from "./order-service";
import { createClient } from "@/utils/supabase/server";
import { CartItem } from "@/types";
import { rateLimit } from "@/utils/rate-limiter";
import { headers } from "next/headers";
import { CheckoutRequestSchema } from "@/lib/validations/checkout";
import { verifyTurnstileToken } from "@/utils/turnstile";

export async function createPaymentIntent(items: CartItem[], currency: string = 'usd', metadata: any, userDetails?: { id?: string, email?: string, address?: any }, turnstileToken?: string) {
    const isBotClear = await verifyTurnstileToken(turnstileToken);
    if (!isBotClear) {
        return { error: "Security check failed. Please refresh and try again." };
    }

    const parsed = CheckoutRequestSchema.safeParse({ items, user: userDetails, currency, turnstileToken });
    if (!parsed.success) {
        return { error: "Invalid request data: " + parsed.error.issues[0].message };
    }

    // Use clean validated data
    const cleanItems = parsed.data.items as CartItem[];
    const cleanUser = parsed.data.user;
    const cleanCurrency = parsed.data.currency || currency;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const checkoutUser = {
        id: user?.id || userDetails?.id,
        email: user?.email || userDetails?.email,
        address: userDetails?.address
    };

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    const limitKey = `checkout_${ip}_${checkoutUser.email || 'guest'}`;

    if (!rateLimit(limitKey, 5, 60 * 1000)) {
        return { error: "Too many checkout attempts. Take a breath and wait a minute." };
    }

    // 1. Create Pending Order & Check Stock
    // This decrement stock immediately. If user abandons, stock is held until timed out (cron job needed) or manual cleanup.
    // For a "Drop", this holding strategy is aggressive but prevents overselling.
    const orderResult = await processOrder(items, checkoutUser);

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
