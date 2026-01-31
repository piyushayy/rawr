import { searchProducts, SearchParams } from "@/services/products";
import { ProductCard } from "@/components/shared/ProductCard";
import FilterSidebar from "./FilterSidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const products = await searchProducts(params);

    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl md:text-6xl font-heading font-black uppercase mb-8">
                    Archive Search
                    {params.query && <span className="text-rawr-red block text-2xl md:text-4xl mt-2">Results for &quot;{params.query}&quot;</span>}
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <FilterSidebar />

                    {/* Results */}
                    <div className="flex-1">
                        {products.length === 0 ? (
                            <div className="text-center py-20 bg-white border-2 border-rawr-black p-12">
                                <h2 className="text-2xl font-black uppercase mb-4">No results found.</h2>
                                <p className="text-gray-600 mb-8">Try adjusting your filters or search for something else.</p>
                                <Link href="/search">
                                    <Button>CLEAR ALL</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <p className="font-bold text-gray-500 mb-4">{products.length} ITEMS FOUND</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} {...product} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
