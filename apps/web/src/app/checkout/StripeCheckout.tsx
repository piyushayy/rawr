"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
    PaymentElement,
    useStripe,
    useElements,
    Elements,
    LinkAuthenticationElement,
    AddressElement
} from '@stripe/react-stripe-js';
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { createPaymentIntent } from "./stripe-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { Price } from "@/components/shared/Price";
import { useCurrencyStore } from "@/store/useCurrencyStore";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ amount, orderId }: { amount: number, orderId: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const { items, clearCart } = useCartStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
            },
            redirect: 'if_required'
        });

        if (error) {
            toast.error(error.message || "Payment Failed");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Success!
            // In a real app, create order in DB here or via webhook
            // For now, we'll assume webhook handles it, but let's clear cart
            // TODO: Call createOrder here as a backup or rely on success page?
            clearCart();
            toast.success("PAYMENT SUCCESSFUL");
            // We manually redirect if not using Stripe's redirect
            window.location.href = `/checkout/success?payment_intent=${paymentIntent.id}&orderId=${orderId}`;
        } else {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-bold text-sm uppercase">Contact Info</h3>
            <LinkAuthenticationElement />

            <h3 className="font-bold text-sm uppercase mt-6">Shipping Address</h3>
            <AddressElement options={{ mode: 'shipping', allowedCountries: ['US', 'CA', 'GB', 'AU'] }} />

            <h3 className="font-bold text-sm uppercase mt-6">Payment Details</h3>
            <PaymentElement />

            <Button
                disabled={isLoading || !stripe || !elements}
                className="w-full h-14 text-lg uppercase font-black tracking-widest mt-8 bg-rawr-black hover:bg-gray-800 text-white"
                type="submit"
            >
                {isLoading ? "PROCESSING..." : `PAY $${amount.toFixed(2)}`}
            </Button>
            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                <Lock className="w-4 h-4" />
                Securely processed by Stripe
            </div>
        </form>
    );
};


export function StripeWrapper({ clientSecret, amount, orderId }: { clientSecret: string, amount: number, orderId: string }) {
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#050505',
                colorBackground: '#ffffff',
                colorText: '#050505',
                fontFamily: 'Inter, sans-serif',
            },
        },
    };

    if (!clientSecret) {
        return <div className="p-8 text-center animate-pulse font-mono">INITIALIZING SECURE CHANNEL...</div>;
    }

    return (
        <Elements options={options} stripe={stripePromise}>
            <CheckoutForm amount={amount} orderId={orderId} />
        </Elements>
    );
}
