import { searchProducts, SearchParams } from "@/services/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { ShopFilters } from "@/components/shared/ShopFilters";
import { Metadata } from "next";

import { DealCountdown } from "@/components/shared/DealCountdown";

export const metadata: Metadata = {
    title: "RAWR | SHOP ALL",
    description: "Browse the latest drop. No restocks.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const products = await searchProducts(params);

    return (
        <div className="bg-rawr-white min-h-screen">
            {/* Header */}
            <div className="bg-rawr-black text-rawr-white py-12 border-b-2 border-rawr-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-6xl md:text-8xl font-heading font-black uppercase text-center">
                        All Items
                    </h1>
                </div>
            </div>

            <DealCountdown />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="md:col-span-1 border-r-2 border-transparent md:border-rawr-black pr-0 md:pr-8">
                        <div className="sticky top-8">
                            <ShopFilters />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="md:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-gray-500 uppercase">{products.length} Products Found</span>
                            {/* Sort Component could go here */}
                        </div>

                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                                <h3 className="text-2xl font-heading font-black uppercase text-gray-400 mb-2">
                                    No Results
                                </h3>
                                <p className="text-gray-500 font-bold">
                                    Try adjusting your filters.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
