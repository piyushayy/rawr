"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { getProductsByIds } from "@/services/products";

const STORAGE_KEY = "rawr_recently_viewed";
const MAX_ITEMS = 8;

export const RecentlyViewed = ({ currentProductId }: { currentProductId?: string }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // 1. Get history from localStorage
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];

        // 2. Add current product to history if on PDP
        if (currentProductId) {
            const newHistory = [
                currentProductId,
                ...history.filter(id => id !== currentProductId)
            ].slice(0, MAX_ITEMS);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        }

        // 3. Fetch product details for the history (excluding current product for display)
        const displayIds = currentProductId
            ? history.filter(id => id !== currentProductId)
            : history;

        if (displayIds.length > 0) {
            // Since this is a client component but needs server-side data, 
            // we should ideally use a server action or a client-side fetch from an API route.
            // For simplicity and speed, I'll use a server action.
            const fetchHistory = async () => {
                const { getProductsByIdsAction } = await import("@/app/search/actions");
                const data = await getProductsByIdsAction(displayIds);
                setProducts(data);
            };
            fetchHistory();
        }
    }, [currentProductId]);

    if (products.length === 0) return null;

    return (
        <section className="mt-20 border-t-2 border-rawr-black pt-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black uppercase mb-10">
                Back for <span className="text-rawr-red">More?</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </section>
    );
};
