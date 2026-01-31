import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../ProductForm";
import { updateProduct } from "../actions";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: product } = await supabase.from("products").select("*").eq("id", id).single();

    if (!product) {
        notFound();
    }

    // Bind ID to action
    const updateAction = updateProduct.bind(null, id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="text-gray-500 hover:text-black">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <p className="text-xs font-bold uppercase text-gray-400">Editing</p>
                    <h2 className="text-3xl font-heading font-black uppercase text-3xl">{product.title}</h2>
                </div>
            </div>

            <ProductForm action={updateAction} initialData={product} />
        </div>
    );
}
