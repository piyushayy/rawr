import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteProduct } from "./actions";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const queryTerm = params.q || "";
    const supabase = await createClient();

    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (queryTerm) {
        query = query.ilike("title", `%${queryTerm}%`);
    }

    const { data: products } = await query;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-heading font-black uppercase">Products</h2>
                <div className="flex items-center gap-4">
                    <form className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            name="q"
                            placeholder="SEARCH SKU/NAME..."
                            className="pl-10 w-64 bg-white"
                            defaultValue={queryTerm}
                        />
                    </form>
                    <Link href="/admin/products/new">
                        <Button className="bg-rawr-black text-white hover:bg-gray-800 gap-2">
                            <Plus className="w-4 h-4" /> Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white border text-left border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Image</th>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Title</th>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Price</th>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Status</th>
                            <th className="p-4 text-xs font-bold uppercase text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products?.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4 w-20">
                                    <div className="relative w-12 h-16 bg-gray-100 rounded overflow-hidden">
                                        {product.images && product.images[0] && (
                                            <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-bold">{product.title}</td>
                                <td className="p-4">₹{product.price}</td>
                                <td className="p-4">
                                    {product.sold_out ? (
                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold uppercase">Sold Out</span>
                                    ) : (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold uppercase">Active</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <form action={deleteProduct.bind(null, product.id)}>
                                            <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </form>
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
