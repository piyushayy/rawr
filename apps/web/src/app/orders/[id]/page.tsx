import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Package, Truck, Home } from "lucide-react";
import Image from "next/image";
import DownloadInvoiceButton from "./DownloadInvoiceButton";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: order } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                *,
                products (*)
            )
        `)
        .eq("id", id)
        .eq("user_id", user.id) // Ensure user owns the order
        .single();

    if (!order) {
        notFound();
    }

    // Progress Logic
    const steps = [
        { status: 'pending', label: 'Order Placed', icon: Package },
        { status: 'paid', label: 'Payment Confirmed', icon: CheckCircle },
        { status: 'shipped', label: 'Shipped', icon: Truck },
        { status: 'completed', label: 'Delivered', icon: Home },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === (order.status === 'completed' ? 'completed' : order.status === 'shipped' ? 'shipped' : order.status === 'paid' ? 'paid' : 'pending'));

    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <Link href="/orders">
                    <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-rawr-red">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
                    </Button>
                </Link>

                <h1 className="text-3xl md:text-5xl font-heading font-black uppercase mb-8">
                    Order #{order.id.slice(0, 8)}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Status Tracking */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border-2 border-rawr-black p-8">
                            <h2 className="text-2xl font-bold uppercase mb-8">Tracking Timeline</h2>

                            <div className="relative">
                                {/* Line */}
                                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200 z-0"></div>

                                <div className="space-y-8 relative z-10">
                                    {steps.map((step, index) => {
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;

                                        return (
                                            <div key={step.status} className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-rawr-black text-white border-rawr-black' : 'bg-white text-gray-300 border-gray-200'}`}>
                                                    <step.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className={`font-bold uppercase text-lg ${isCompleted ? 'text-black' : 'text-gray-400'}`}>{step.label}</p>
                                                    {isCurrent && <p className="text-sm text-green-600 font-bold uppercase">In Progress...</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Generator */}
                        <DownloadInvoiceButton order={order} />
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 border-2 border-rawr-black p-6 h-fit">
                        <h3 className="font-heading font-bold uppercase text-xl mb-4">Summary</h3>
                        <div className="space-y-4 mb-6">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-16 bg-white border border-gray-200 shrink-0">
                                        {item.products && item.products.images && (
                                            <Image src={item.products.images[0]} alt={item.products.title} fill className="object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase leading-tight">{item.products?.title}</p>
                                        <p className="text-gray-500 text-sm">${item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-2 border-rawr-black pt-4 space-y-2">
                            <div className="flex justify-between font-bold">
                                <span>Subtotal</span>
                                <span>${order.total}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-black text-xl border-t border-gray-300 pt-2 mt-2">
                                <span>Total</span>
                                <span>${order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
