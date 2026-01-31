import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toggleWishlist } from "./actions";

export default async function WishlistPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?message=Please login to view your stash");
    }

    const { data: items, error } = await supabase
        .from("wishlists")
        .select(`
            id,
            products (
                id,
                title,
                price,
                images,
                size
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return <div>Error loading stash.</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-heading font-black uppercase mb-2">My Stash</h2>
                <p className="text-gray-600">Items you&apos;re watching.</p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-rawr-black">
                    <p className="text-xl font-bold uppercase mb-4">Your stash is empty.</p>
                    <Link href="/shop">
                        <Button>Go Hunt</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {items.map((item: any) => (
                        <div key={item.id} className="border-2 border-rawr-black bg-white group relative">
                            <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-rawr-black bg-gray-100">
                                <Image
                                    src={item.products.images[0]}
                                    alt={item.products.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-2 right-2">
                                    <form action={async () => {
                                        "use server";
                                        await toggleWishlist(item.products.id);
                                    }}>
                                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-heading font-bold uppercase truncate">{item.products.title}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-bold">${item.products.price}</span>
                                    <Link href={`/product/${item.products.id}`}>
                                        <Button size="sm" variant="outline">VIEW</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
