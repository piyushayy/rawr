"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function FilterSidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [priceRange, setPriceRange] = useState([
        Number(searchParams.get("minPrice")) || 0,
        Number(searchParams.get("maxPrice")) || 500
    ]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.getAll("category"));
    const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.getAll("size"));

    useEffect(() => {
        setPriceRange([
            Number(searchParams.get("minPrice")) || 0,
            Number(searchParams.get("maxPrice")) || 500
        ]);
        setSelectedCategories(searchParams.getAll("category"));
        setSelectedSizes(searchParams.getAll("size"));
    }, [searchParams]);

    const toggleFilterArray = (key: string, value: string, currentSelections: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        let newSelections = [...currentSelections];

        if (newSelections.includes(value)) {
            newSelections = newSelections.filter(v => v !== value);
        } else {
            newSelections.push(value);
        }

        params.delete(key);
        newSelections.forEach(val => params.append(key, val));

        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", priceRange[0].toString());
        params.set("maxPrice", priceRange[1].toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const categories = ["tops", "bottoms", "outerwear", "accessories"];
    const sizes = ["S", "M", "L", "XL", "XXL"];

    return (
        <div className="w-full md:w-64 shrink-0 space-y-8 p-4 border-2 border-rawr-black bg-white h-fit">

            {/* Categories */}
            <div>
                <h3 className="font-heading font-bold uppercase mb-4 text-lg">Category</h3>
                <div className="space-y-2">
                    {categories.map((cat) => {
                        const isSelected = selectedCategories.includes(cat);
                        return (
                            <div key={cat} className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleFilterArray("category", cat, selectedCategories)}
                                    className={`w-full text-left font-bold uppercase hover:text-rawr-red transition-colors flex items-center justify-between ${isSelected ? "text-rawr-red" : "text-gray-500"}`}
                                >
                                    {cat}
                                    {isSelected && <Check className="w-4 h-4" />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-heading font-bold uppercase mb-4 text-lg">Price</h3>
                <div className="px-2">
                    <Slider
                        defaultValue={[0, 500]}
                        value={priceRange}
                        max={500}
                        step={10}
                        onValueChange={handlePriceChange}
                        className="mb-4"
                    />
                    <div className="flex justify-between font-bold text-sm mb-4">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                    <Button onClick={applyPriceFilter} size="sm" className="w-full">APPLY</Button>
                </div>
            </div>

            {/* Sizes */}
            <div>
                <h3 className="font-heading font-bold uppercase mb-4 text-lg">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                        const isSelected = selectedSizes.includes(size);
                        return (
                            <button
                                key={size}
                                onClick={() => toggleFilterArray("size", size, selectedSizes)}
                                className={`w-10 h-10 border-2 font-bold uppercase flex items-center justify-center transition-all min-w-[2.5rem] px-1 ${isSelected ? "border-rawr-red bg-rawr-red text-white" : "border-rawr-black hover:bg-gray-100"}`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Reset */}
            <div className="pt-4 border-t-2 border-gray-100">
                <Button variant="ghost" className="w-full text-gray-500 hover:text-red-500" onClick={() => router.push(pathname)}>
                    RESET FILTERS
                </Button>
            </div>
        </div>
    );
}
