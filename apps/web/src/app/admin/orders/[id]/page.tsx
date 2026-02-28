import { createClient } from "@/utils/supabase/server";
import { updateOrderStatus } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Price } from "@/components/shared/Price";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
            *,
            profiles (email, full_name, clout_score),
            order_items (
                id,
                price,
                quantity,
                products (title, images, size)
            )
        `,
    )
    .eq("id", id)
    .single();

  if (!order) {
    return <div>Order not found</div>;
  }

  const address = order.address as any; // Cast jsonb

  return (
    <div className="space-y-8">
      <Link
        href="/admin/orders"
        className="flex items-center text-sm hover:underline text-gray-500"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-heading font-black uppercase">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded text-lg font-bold uppercase ${
            order.status === "paid"
              ? "bg-green-100 text-green-800"
              : order.status === "shipped"
                ? "bg-blue-100 text-blue-800"
                : order.status === "completed"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold uppercase mb-4">Items</h3>
              <div className="space-y-4">
                {order.order_items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative w-20 h-24 border border-gray-200 shrink-0">
                      {item.products?.images?.[0] && (
                        <Image
                          src={item.products.images[0]}
                          alt={item.products.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold">{item.products?.title}</h4>
                        <div className="font-bold">
                          <Price amount={item.price} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Size: {item.products?.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                <span className="font-bold text-xl">
                  Total: <Price amount={order.total} />
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h3 className="font-bold uppercase mb-4">Order Actions</h3>
              <div className="flex gap-4">
                {order.status === "paid" && (
                  <div className="w-full">
                    <form
                      action={updateOrderStatus.bind(null, order.id, "shipped")}
                      className="flex flex-col md:flex-row gap-2 w-full"
                    >
                      <input
                        name="trackingNumber"
                        placeholder="Enter Tracking ID..."
                        className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white"
                        required
                      />
                      <Button
                        type="submit"
                        className="bg-rawr-black text-white hover:bg-gray-800 whitespace-nowrap"
                      >
                        <Truck className="w-4 h-4 mr-2" /> Mark Shipped
                      </Button>
                    </form>
                  </div>
                )}
                {order.status === "shipped" && (
                  <form
                    action={updateOrderStatus.bind(null, order.id, "completed")}
                  >
                    <Button variant="outline" className="w-full md:w-auto">
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark Delivered
                    </Button>
                  </form>
                )}
                <Button variant="secondary" disabled>
                  Print Label (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Customer Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold uppercase mb-4">Customer</h3>
              <div className="space-y-2">
                <p className="font-bold">{order.profiles?.full_name}</p>
                <p className="text-sm text-gray-500">{order.profiles?.email}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs uppercase font-bold text-gray-400">
                    Clout Score
                  </p>
                  <p className="font-mono text-lg">
                    {order.profiles?.clout_score}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold uppercase mb-4">Shipping Address</h3>
              {address ? (
                <div className="text-sm space-y-1">
                  <p>
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p>{address.country}</p>
                  {order.tracking_number && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs uppercase font-bold text-gray-400">
                        Tracking Number
                      </p>
                      <p className="font-mono text-lg font-bold text-rawr-black bg-yellow-100 inline-block px-2">
                        {order.tracking_number}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No address provided (Digital/Pickup?)
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
