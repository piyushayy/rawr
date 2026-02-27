"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, CreditCard, Banknote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getTier, TIERS } from "@/utils/tiers";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Price } from "@/components/shared/Price";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { StripeWrapper } from "./StripeCheckout";
import Script from "next/script";
import { Turnstile } from '@marsidev/react-turnstile';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    const [shippingCost, setShippingCost] = useState<number | 'FREE'>(1500); // Default INR
    const [clout, setClout] = useState(0);
    const [country, setCountry] = useState('IN'); // Default India for now
    const { currency } = useCurrencyStore();

    // State
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | null>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState("");
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [guestEmail, setGuestEmail] = useState("");
    const [guestName, setGuestName] = useState("");
    const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment'>('details');

    useEffect(() => {
        const recoverCart = async () => {
            const params = new URLSearchParams(window.location.search);
            const recoveryId = params.get('recovery');
            if (recoveryId && items.length === 0) {
                const supabase = createClient();
                const { data: order } = await supabase.from('orders').select('order_items(*, products(title, images, size))').eq('id', recoveryId).single();

                if (order && order.order_items) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const restoredItems = order.order_items.map((oi: any) => ({
                        id: oi.product_id,
                        variant_id: oi.variant_id,
                        title: oi.products?.title,
                        price: oi.price,
                        image: oi.products?.images?.[0] || '',
                        size: oi.products?.size || 'M',
                        quantity: oi.quantity
                    }));

                    // Direct store update (hacky but works)
                    useCartStore.setState({ items: restoredItems, isOpen: true });
                    toast.success("Cart restored from previous session.");
                }
            }
        };
        recoverCart();
    }, [items.length]);

    const total = items.reduce((acc, item) => item.price * (item.quantity || 1) + acc, 0);

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsAuthenticated(true);
                setCheckoutStep('payment');
                const { data: profile } = await supabase.from('profiles').select('clout_score').eq('id', user.id).single();
                setClout(profile?.clout_score || 0);
            } else {
                setIsAuthenticated(false);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        // ... (Shipping Logic)
        const tier = getTier(clout);
        const isMember = tier.minClout >= TIERS.MEMBER.minClout;

        if (country !== 'IN') {
            // International
            setShippingCost(3000);
            return;
        }

        // Domestic Logic
        if (total >= 15000 || isMember) { // 15000 INR Threshold
            setShippingCost('FREE');
        } else {
            setShippingCost(1500);
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

    const handleRazorpayPayment = async () => {
        setIsLoading(true);
        try {
            const { createRazorpayOrder, verifyRazorpayPayment } = await import("./razorpay-actions");
            const userDetails = !isAuthenticated ? { email: guestEmail, name: guestName } : undefined;
            const data = await createRazorpayOrder(items, userDetails, turnstileToken || "");

            if (data.error || !data.razorpayOrderId) {
                toast.error(data.error || "Payment Init Failed");
                setIsLoading(false);
                return;
            }

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "RAWR Store",
                description: "Cop the Drop",
                order_id: data.razorpayOrderId,
                handler: async function (response: any) {
                    setIsLoading(true);
                    const verification = await verifyRazorpayPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature,
                        data.dbOrderId
                    );

                    if (verification.success) {
                        clearCart();
                        toast.success("PAYMENT SUCCESSFUL");
                        router.push(`/checkout/success?orderId=${data.dbOrderId}`);
                    } else {
                        toast.error("Payment Verification Failed");
                        setIsLoading(false);
                    }
                },
                prefill: {
                    name: "RAWR User", // Fetch from profile dynamically if possible
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#000000"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description);
                setIsLoading(false);
            });
            rzp.open();

        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    };

    const handleStripeInit = async () => {
        setIsLoading(true);
        const { createPaymentIntent } = await import("./stripe-actions");
        const userDetails = !isAuthenticated ? { email: guestEmail, name: guestName } : undefined;
        const data = await createPaymentIntent(items, currency.toLowerCase(), { source: "web" }, userDetails, turnstileToken || "");

        if (data.error) {
            toast.error(data.error);
            setIsLoading(false);
        } else if (data.clientSecret && data.orderId) {
            setClientSecret(data.clientSecret);
            setOrderId(data.orderId);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rawr-white lg:grid lg:grid-cols-2">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

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
                                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                                    <p className="font-bold mt-1"><Price amount={item.price * (item.quantity || 1)} /></p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* ... (Totals Section) */}
                    <div className="border-t-2 border-rawr-black mt-8 pt-8 space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span><Price amount={total} /></span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className={shippingCost === 'FREE' ? 'text-green-600 font-bold' : ''}>
                                {shippingCost === 'FREE' ? 'FREE' : <Price amount={Number(shippingCost)} />}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span><Price amount={finalTotal} /></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Payments */}
            <div className="p-8 lg:p-12">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-4xl font-heading font-black uppercase mb-8">Secure Checkout</h1>

                    {checkoutStep === 'details' ? (
                        <div className="space-y-6 py-12 text-center border-2 border-rawr-black p-8 bg-gray-50">
                            <Lock className="w-12 h-12 mx-auto text-rawr-black mb-4" />
                            <h3 className="text-2xl font-heading font-black uppercase mb-2">Join The Cult to Checkout</h3>
                            <p className="font-body text-gray-500 mb-8 max-w-sm mx-auto">
                                We need your details to secure your stash, provide accurate shipping, and prevent bots from eating our inventory.
                            </p>
                            <Link href="/login?redirect=/checkout" className="block w-full">
                                <Button className="w-full h-16 text-xl tracking-widest bg-rawr-black text-white hover:bg-gray-900 border-none uppercase shadow-[8px_8px_0px_0px_transparent] hover:shadow-[4px_4px_0px_0px_transparent] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
                                    Login / Sign Up
                                </Button>
                            </Link>
                        </div>
                    ) : !paymentMethod ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold uppercase">Select Payment Method</h3>
                                {!isAuthenticated && (
                                    <button onClick={() => setCheckoutStep('details')} className="text-sm underline hover:text-rawr-red">
                                        Edit Details
                                    </button>
                                )}
                            </div>

                            <div
                                onClick={() => { setPaymentMethod('razorpay'); }}
                                className="border-2 border-rawr-black p-6 cursor-pointer hover:bg-gray-50 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <Banknote className="w-8 h-8" />
                                    <div>
                                        <p className="font-bold uppercase text-lg">Razorpay (India)</p>
                                        <p className="text-sm text-gray-500">UPI, Credit/Debit Cards, Netbanking</p>
                                    </div>
                                </div>
                                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div
                                onClick={() => {
                                    setPaymentMethod('stripe');
                                    handleStripeInit();
                                }}
                                className="border-2 border-rawr-black p-6 cursor-pointer hover:bg-gray-50 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <CreditCard className="w-8 h-8" />
                                    <div>
                                        <p className="font-bold uppercase text-lg">International Card</p>
                                        <p className="text-sm text-gray-500">Powered by Stripe</p>
                                    </div>
                                </div>
                                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="text-xs text-center text-gray-400 mt-8">
                                Depending on your location, shipping costs may vary.
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Button variant="ghost" onClick={() => setPaymentMethod(null)} className="mb-4 pl-0 hover:bg-transparent hover:underline">
                                ← Change Method
                            </Button>

                            {paymentMethod === 'razorpay' && (
                                <div className="text-center py-8">
                                    <p className="mb-6 font-bold text-xl">Order Total: <Price amount={finalTotal} /></p>
                                    <div className="flex justify-center mb-6">
                                        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} onSuccess={setTurnstileToken} />
                                    </div>
                                    <Button
                                        onClick={handleRazorpayPayment}
                                        disabled={isLoading || !turnstileToken}
                                        className="w-full h-16 text-xl bg-[#3399cc] hover:bg-[#2b88b5] text-white font-bold disabled:opacity-50"
                                    >
                                        {isLoading ? "PROCESSING..." : "PAY WITH RAZORPAY"}
                                    </Button>
                                    <p className="text-xs text-gray-400 mt-4">Securely processed by Razorpay</p>
                                </div>
                            )}

                            {paymentMethod === 'stripe' && (
                                <>
                                    {clientSecret && orderId ? (
                                        <StripeWrapper amount={finalTotal} clientSecret={clientSecret} orderId={orderId} />
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="mb-6 font-bold text-xl">Order Total: <Price amount={finalTotal} /></p>
                                            <div className="flex justify-center mb-6">
                                                <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} onSuccess={setTurnstileToken} />
                                            </div>
                                            <Button
                                                onClick={handleStripeInit}
                                                disabled={isLoading || !turnstileToken}
                                                className="w-full h-16 text-xl bg-rawr-black hover:bg-gray-900 text-white font-bold disabled:opacity-50"
                                            >
                                                {isLoading ? "INITIATING..." : "PAY WITH STRIPE"}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
