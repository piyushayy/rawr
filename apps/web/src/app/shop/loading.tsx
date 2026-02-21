import { SkeletonCard } from "@/components/skeletons/SkeletonCard";
import { ShopFilters } from "@/components/shared/ShopFilters";

export default function ShopLoading() {
    return (
        <div className="bg-rawr-white min-h-screen">
            {/* Header Skeleton */}
            <div className="bg-rawr-black text-rawr-white py-12 border-b-2 border-rawr-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-6xl md:text-8xl font-heading font-black uppercase text-center animate-pulse text-gray-400">
                        LOADING...
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="md:col-span-1 border-r-2 border-transparent md:border-rawr-black pr-0 md:pr-8">
                        <div className="sticky top-8 opacity-50 pointer-events-none">
                            {/* Reusing actual filters but disabled/dimmed helps layout consistency */}
                            <ShopFilters />
                        </div>
                    </div>

                    {/* Products Grid Skeleton */}
                    <div className="md:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-4 bg-gray-200 w-32 animate-pulse" />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
