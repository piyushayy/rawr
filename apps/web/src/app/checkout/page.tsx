"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createOrder } from "./actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getTier, TIERS } from "@/utils/tiers";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Price } from "@/components/shared/Price";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { StripeWrapper } from "./StripeCheckout";

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const total = items.reduce((acc, item) => acc + item.price, 0);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const [shippingCost, setShippingCost] = useState<number | 'FREE'>(15);
    const [clout, setClout] = useState(0);

    const [country, setCountry] = useState('US');

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('clout_score').eq('id', user.id).single();
                setClout(profile?.clout_score || 0);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const tier = getTier(clout);
        const isMember = tier.minClout >= TIERS.MEMBER.minClout;

        if (country !== 'US') {
            setShippingCost(30); // International Flat Rate
            return;
        }

        if (total >= 150 || isMember) {
            setShippingCost('FREE');
        } else {
            setShippingCost(15);
        }
    }, [total, clout, country]);

    const finalTotal = total + (shippingCost === 'FREE' ? 0 : shippingCost);

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-rawr-white flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-heading font-black uppercase mb-4">Your stash is empty</h1>
                <Link href="/shop">
                    <Button>GO SHOPPING</Button>
                </Link>
            </div>
        );
    }

    const [clientSecret, setClientSecret] = useState("");
    const { currency } = useCurrencyStore();
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        // Create PaymentIntent (and reserve stock) as soon as the page loads
        if (items.length > 0 && !clientSecret) {
            // Check !clientSecret to avoid creating duplicate orders on re-renders,
            // though strict mode might still trigger it. Better to refactor to a button click "Proceed to Payment" if strictly optimizing, 
            // but for this UX we want it ready.
            import("./stripe-actions").then(({ createPaymentIntent }) => {
                createPaymentIntent(items, currency.toLowerCase(), {
                    source: "web_checkout"
                }).then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                        // Optional: router.push('/shop') if out of stock
                    } else if (data.clientSecret && data.orderId) {
                        setClientSecret(data.clientSecret);
                        setOrderId(data.orderId);
                    }
                });
            });
        }
    }, [items, currency, clientSecret]);

    return (
        <div className="min-h-screen bg-rawr-white lg:grid lg:grid-cols-2">
            {/* Left: Summary */}
            <div className="p-8 lg:p-12 bg-gray-100 border-r-2 border-rawr-black block">
                <div className="max-w-xl mx-auto">
                    <h2 className="text-2xl font-heading font-black uppercase mb-8">Order Summary</h2>
                    <div className="space-y-6">
                        {items.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="relative w-20 h-24 border border-rawr-black shrink-0">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.size}</p>
                                    <p className="font-bold mt-1"><Price amount={item.price} /></p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t-2 border-rawr-black mt-8 pt-8 space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span><Price amount={total} /></span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className={shippingCost === 'FREE' ? 'text-green-600 font-bold' : ''}>
                                {shippingCost === 'FREE' ? 'FREE' : <Price amount={shippingCost} />}
                            </span>
                        </div>
                        {shippingCost === 'FREE' && clout >= 500 && total < 150 && (
                            <p className="text-xs text-green-600 text-right uppercase font-bold">Member Benefit</p>
                        )}
                        <div className="flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span><Price amount={finalTotal} /></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div className="p-8 lg:p-12">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-4xl font-heading font-black uppercase mb-8">Secure Checkout</h1>

                    {/* We are simplifying the form for this phase to focus on Payment Element */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="font-bold uppercase border-b border-rawr-black pb-2">Shipping Details</h3>
                            <div className="p-4 border-2 border-rawr-black bg-gray-50 text-sm text-gray-500">
                                Shipping Address collection is skipped in this Stripe Demo.
                                In a real app, this would be passed to the PaymentIntent.
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold uppercase border-b border-rawr-black pb-2">Payment</h3>
                            {clientSecret && orderId ? (
                                <StripeWrapper amount={finalTotal} clientSecret={clientSecret} orderId={orderId} />
                            ) : (
                                <div className="p-8 text-center animate-pulse font-mono border-2 border-dashed border-gray-300">
                                    INITIALIZING SECURE CHANNEL...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
