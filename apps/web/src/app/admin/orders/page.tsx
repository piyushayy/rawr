import { createClient } from "@/utils/supabase/server";
import { updateOrderStatus } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    const { status } = await searchParams;
    const supabase = await createClient();

    let query = supabase
        .from("orders")
        .select(`
            *,
            profiles(email, full_name)
        `)
        .order("created_at", { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data: orders } = await query;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-heading font-black uppercase">Orders</h2>
                <div className="flex gap-2">
                    <Link href="/admin/orders?status=all">
                        <Button variant={!status || status === 'all' ? 'default' : 'outline'} size="sm">All</Button>
                    </Link>
                    <Link href="/admin/orders?status=pending">
                        <Button variant={status === 'pending' ? 'default' : 'outline'} size="sm">Pending</Button>
                    </Link>
                    <Link href="/admin/orders?status=shipped">
                        <Button variant={status === 'shipped' ? 'default' : 'outline'} size="sm">Shipped</Button>
                    </Link>
                    <Link href="/admin/orders?status=completed">
                        <Button variant={status === 'completed' ? 'default' : 'outline'} size="sm">Completed</Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Order ID</th>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Customer</th>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Total</th>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Status</th>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders?.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono text-xs">
                                    <Link href={`/admin/orders/${order.id}`} className="hover:underline text-blue-600">
                                        {order.id.slice(0, 8)}...
                                    </Link>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold">{order.profiles?.full_name || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">{order.profiles?.email}</div>
                                </td>
                                <td className="p-4 font-bold">${order.total}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {order.status !== 'shipped' && order.status !== 'completed' && (
                                            <form action={updateOrderStatus.bind(null, order.id, 'shipped')}>
                                                <Button size="sm" variant="outline" className="text-xs">Mark Shipped</Button>
                                            </form>
                                        )}
                                        {order.status === 'shipped' && (
                                            <form action={updateOrderStatus.bind(null, order.id, 'completed')}>
                                                <Button size="sm" variant="outline" className="text-xs">Mark Delivered</Button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
