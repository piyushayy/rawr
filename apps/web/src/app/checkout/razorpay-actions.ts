'use server';

import Razorpay from 'razorpay';
import { createClient } from '@/utils/supabase/server';
import { processOrder } from './order-service';
import { CartItem } from '@/types';
import { rateLimit } from '@/utils/rate-limiter';
import { headers } from 'next/headers';
import { CheckoutRequestSchema } from "@/lib/validations/checkout";
import { verifyTurnstileToken } from "@/utils/turnstile";

// Initialize Razorpay
// Note: User must key in .env RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(items: CartItem[], userDetails?: { id?: string, email?: string, address?: any }, turnstileToken?: string) {
    const isBotClear = await verifyTurnstileToken(turnstileToken);
    if (!isBotClear) {
        return { error: "Security check failed. Please refresh and try again." };
    }

    const parsed = CheckoutRequestSchema.safeParse({ items, user: userDetails, turnstileToken });
    if (!parsed.success) {
        return { error: "Invalid request data: " + parsed.error.issues[0].message };
    }

    const cleanItems = parsed.data.items as CartItem[];
    const cleanUser = parsed.data.user;

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

    // 1. Process Order (Verify Stock, Prices, Create DB Order)
    const orderResult = await processOrder(items, checkoutUser);

    if (orderResult.error || !orderResult.success) {
        return { error: orderResult.error };
    }

    // 2. Create Razorpay Order
    try {
        const options = {
            amount: Math.round(orderResult.total! * 100), // Amount in smallest currency unit (paise)
            currency: "INR",
            receipt: orderResult.orderId,
            notes: {
                userId: checkoutUser.id || 'guest',
                orderId: orderResult.orderId // internal DB ID
            }
        };

        const order = await razorpay.orders.create(options);

        // Update DB Order with Payment metadata (optional but good practice)
        await supabase
            .from('payments')
            .insert({
                order_id: orderResult.orderId,
                provider: 'razorpay',
                transaction_id: order.id, // Razorpay Order ID (starts with order_)
                amount: orderResult.total!,
                status: 'pending'
            });

        return {
            razorpayOrderId: order.id,
            dbOrderId: orderResult.orderId,
            amount: orderResult.total,
            currency: "INR",
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID // Send key to client safely
        };
    } catch (error) {
        console.error("Razorpay Order Creation Failed:", error);
        return { error: "Failed to initiate payment." };
    }
}

export async function verifyRazorpayPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    dbOrderId: string
) {
    const crypto = require('crypto');

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const supabase = await createClient();

        // Update Order Status
        await supabase
            .from('orders')
            .update({ status: 'confirmed', payment_status: 'captured' })
            .eq('id', dbOrderId);

        // Update Payment Record
        await supabase
            .from('payments')
            .update({ status: 'captured', transaction_id: razorpay_payment_id })
            .eq('order_id', dbOrderId); // Safer to look up by razorpay_order_id match if possible

        return { success: true };
    } else {
        return { error: "Invalid signature" };
    }
}
