"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
// import { Checkbox } from "@/components/ui/checkbox"; // Unused
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CATEGORIES = ["ALL", "TOPS", "BOTTOMS", "OUTERWEAR", "ACCESSORIES"];
const SIZES = ["S", "M", "L", "XL", "XXL", "OS"];

export const ShopFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(
    searchParams.get("category") || "ALL",
  );
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    const sizeParam = searchParams.get("size");
    if (sizeParam) {
      setSelectedSizes(sizeParam.split(","));
    }
  }, [searchParams]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/shop?${params.toString()}`);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    updateFilters({ category: cat === "ALL" ? null : cat.toLowerCase() });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSizes);
    updateFilters({ size: newSizes.length > 0 ? newSizes.join(",") : null });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center md:hidden">
        <h2 className="font-heading font-black uppercase text-xl">Filters</h2>
        {/* Mobile Close Button Logic would go here if in a drawer */}
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="category"
        className="w-full"
      >
        {/* Categories */}
        <AccordionItem value="category" className="border-rawr-black">
          <AccordionTrigger className="font-heading font-bold uppercase text-lg">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 pt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-left text-sm font-bold uppercase py-1 px-2 transition-colors ${
                    category === cat
                      ? "bg-rawr-black text-white"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-rawr-black">
          <AccordionTrigger className="font-heading font-bold uppercase text-lg">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-4 pb-4">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                className="my-4"
                onValueChange={(val) => setPriceRange(val)}
                onValueCommit={(val) =>
                  updateFilters({
                    minPrice: val[0].toString(),
                    maxPrice: val[1].toString(),
                  })
                }
              />
              <div className="flex justify-between text-xs font-bold font-mono">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}+</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sizes */}
        <AccordionItem value="size" className="border-rawr-black border-b-0">
          <AccordionTrigger className="font-heading font-bold uppercase text-lg">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`border-2 font-bold text-sm py-2 transition-all ${
                    selectedSizes.includes(size)
                      ? "border-rawr-black bg-rawr-black text-white"
                      : "border-gray-200 hover:border-rawr-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Active Filters Clear */}
      {(category !== "ALL" || selectedSizes.length > 0) && (
        <Button
          variant="outline"
          className="w-full uppercase font-bold text-xs"
          onClick={() => {
            setCategory("ALL");
            setSelectedSizes([]);
            router.push("/shop");
          }}
        >
          Clear All <X className="ml-2 w-3 h-3" />
        </Button>
      )}
    </div>
  );
};
