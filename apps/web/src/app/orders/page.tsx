import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";

export default async function OrdersPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?message=Please login to view orders");
    }

    const { data: orders, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                *,
                products (*)
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return <div>Error loading orders.</div>;
    }

    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl md:text-6xl font-heading font-black uppercase mb-8">
                    Your Stash
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white border-2 border-rawr-black">
                        <p className="text-xl font-bold uppercase mb-4">No orders yet.</p>
                        <Link href="/shop">
                            <Button>Go Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white border-2 border-rawr-black p-6">
                                <div className="flex flex-col md:flex-row justify-between border-b-2 border-rawr-black pb-4 mb-4 gap-4">
                                    <div>
                                        <p className="font-bold text-sm text-gray-500 uppercase">Order ID</p>
                                        <p className="font-bold">#{order.id.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-500 uppercase">Date</p>
                                        <p className="font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-500 uppercase">Total</p>
                                        <p className="font-bold text-xl">${order.total}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-500 uppercase">Status</p>
                                        <span className={`inline-block px-2 py-1 text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-200 text-green-900' :
                                            order.status === 'shipped' ? 'bg-blue-200 text-blue-900' :
                                                'bg-yellow-200 text-yellow-900'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Link href={`/orders/${order.id}`}>
                                            <Button size="sm" variant="outline">TRACK ORDER</Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {order.order_items.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            {item.products && item.products.images && (
                                                <NextImage src={item.products.images[0]} alt={item.products.title} width={64} height={64} className="w-16 h-16 object-cover border border-black" />
                                            )}
                                            <div>
                                                <p className="font-bold uppercase">{item.products?.title || "Unknown Product"}</p>
                                                <p className="text-sm">${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
