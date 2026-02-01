
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="bg-rawr-black text-rawr-white py-12 border-b-2 border-rawr-white">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-20 w-3/4 mx-auto bg-gray-800" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8 border-b-2 border-rawr-black">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-24 shrink-0" />
                    ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-[3/4] w-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
