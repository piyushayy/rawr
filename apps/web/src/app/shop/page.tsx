import { getProducts } from "@/services/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RAWR | SHOP ALL",
    description: "Browse the latest drop. No restocks.",
};

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="bg-rawr-black text-rawr-white py-12 border-b-2 border-rawr-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-6xl md:text-8xl font-heading font-black uppercase text-center">
                        All Items
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Filters (Mock) - Could become a client component */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8 border-b-2 border-rawr-black">
                    {["ALL", "TOPS", "BOTTOMS", "OUTERWEAR", "ACCESSORIES"].map((cat) => (
                        <button key={cat} className="px-4 py-2 border-2 border-transparent hover:border-rawr-black font-bold hover:bg-white transition-all uppercase cursor-pointer">
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
