import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomerNotesForm } from "./CustomerNotesForm";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import Image from "next/image";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Profile + Orders
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            *,
            orders (
                *,
                order_items (
                    *,
                    products (title, images)
                )
            )
        `)
        .eq('id', id)
        .single();

    if (!profile) {
        notFound();
    }

    // Sort orders
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = profile.orders?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

    return (
        <div className="space-y-6">
            <Link href="/admin/customers" className="text-gray-500 hover:text-black flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to CRM
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="space-y-6">
                    <div className="bg-white border-2 border-rawr-black p-6 text-center">
                        <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden relative">
                            {profile.avatar_url ? (
                                <Image src={profile.avatar_url} alt="User" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-400">?</div>
                            )}
                        </div>
                        <h1 className="text-2xl font-black uppercase">{profile.full_name}</h1>
                        <p className="text-gray-500 mb-4">{profile.email}</p>

                        <div className="flex justify-center gap-4 border-t pt-4">
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase">Clout</p>
                                <p className="text-xl font-black text-rawr-red">{profile.clout_score}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase">Orders</p>
                                <p className="text-xl font-black">{orders.length}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a href={`mailto:${profile.email}`}>
                                <Button className="w-full gap-2">
                                    <Mail className="w-4 h-4" /> Email Customer
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-white border-2 border-rawr-black p-6">
                        <h3 className="font-bold uppercase mb-4">Internal Notes</h3>
                        <CustomerNotesForm userId={id} initialNotes={profile.admin_notes || ''} />
                    </div>
                </div>

                {/* Right Column: Order History */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-heading font-black uppercase text-2xl">Order History</h3>

                    {orders.length === 0 ? (
                        <div className="p-8 bg-gray-50 border border-gray-200 text-center text-gray-500">
                            No orders placed yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {orders.map((order: any) => (
                                <div key={order.id} className="bg-white border border-gray-200 p-4 rounded hover:shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-bold uppercase text-sm">Order #{order.id.slice(0, 8)}</p>
                                            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">${order.total}</p>
                                            <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {order.order_items.map((item: any) => (
                                            <div key={item.id} className="w-12 h-12 bg-gray-100 border border-gray-200 shrink-0 relative">
                                                {item.products?.images?.[0] && (
                                                    <Image src={item.products.images[0]} alt={item.products.title} fill className="object-cover" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-2 border-t flex justify-end">
                                        <Link href={`/admin/orders`}>
                                            <Button size="sm" variant="ghost" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
                                                Manage in Orders
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Support Tickets Section */}
            <div className="lg:col-span-2 space-y-6 pt-8 border-t border-gray-200">
                <h3 className="font-heading font-black uppercase text-2xl">Support Tickets</h3>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {profile.support_tickets && profile.support_tickets.length > 0 ? (
                    <div className="space-y-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {profile.support_tickets.map((ticket: any) => (
                            <div key={ticket.id} className="bg-white border border-gray-200 p-4 rounded hover:shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm uppercase mb-1">{ticket.subject}</p>
                                    <p className="text-xs text-gray-500">
                                        Created: {new Date(ticket.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm mt-2 text-gray-700 max-w-md truncate">{ticket.message}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded uppercase font-bold inline-block mb-2
                                            ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                                            ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}`
                                    }>
                                        {ticket.status}
                                    </span>
                                    <div className="text-xs text-gray-400">ID: {ticket.id.slice(0, 6)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 bg-gray-50 border border-gray-200 text-center text-gray-500">
                        No support tickets filed.
                    </div>
                )}
            </div>
        </div>
    );
}
