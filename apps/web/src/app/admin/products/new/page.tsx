import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="text-gray-500 hover:text-black">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-heading font-black uppercase">Add New Product</h2>
            </div>

            <ProductForm action={createProduct} />
        </div>
    );
}
