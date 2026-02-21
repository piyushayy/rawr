export const SkeletonProductPage = () => {
    return (
        <div className="min-h-screen bg-rawr-white pt-24 md:pt-32 pb-20 animate-pulse">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* Left: Image Skeleton */}
                    <div className="relative aspect-[3/4] bg-gray-200 border-2 border-transparent w-full md:sticky md:top-32" />

                    {/* Right: Details Skeleton */}
                    <div className="space-y-8">
                        {/* Title & Price */}
                        <div className="space-y-4 pb-8 border-b-2 border-gray-100">
                            <div className="h-4 bg-gray-200 w-24" /> {/* "Vintage Pre-Owned" */}
                            <div className="h-10 md:h-14 bg-gray-200 w-3/4" /> {/* Product Title */}
                            <div className="h-8 bg-gray-200 w-32" /> {/* Price */}
                        </div>

                        {/* Size Selector */}
                        <div className="space-y-4 pb-8 border-b-2 border-gray-100">
                            <div className="h-4 bg-gray-200 w-20" /> {/* "Select Size" */}
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-12 bg-gray-100 border border-transparent" />
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="h-16 bg-gray-200 w-full" />

                        {/* Description */}
                        <div className="space-y-4 pt-4">
                            <div className="h-4 bg-gray-200 w-full" />
                            <div className="h-4 bg-gray-200 w-full" />
                            <div className="h-4 bg-gray-200 w-2/3" />
                        </div>

                        {/* Accordion Placeholders */}
                        <div className="space-y-2 pt-8">
                            <div className="h-12 bg-gray-100 w-full" />
                            <div className="h-12 bg-gray-100 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
