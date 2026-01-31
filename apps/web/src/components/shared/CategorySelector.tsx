"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const CategorySelector = () => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh] md:h-[60vh]">
            <Link href="/shop?category=men" className="relative group block overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-rawr-black">
                <div className="absolute inset-0 bg-gray-200">
                    {/* Placeholder colors or images - using CSS patterns for now */}
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-300 to-gray-400" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
                    <h2 className="text-6xl md:text-8xl font-heading font-black uppercase text-rawr-black group-hover:scale-110 transition-transform duration-500">
                        Men
                    </h2>
                    <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold bg-rawr-black text-white px-4 py-2">
                        <span>SHOP MENS</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
            </Link>

            <Link href="/shop?category=women" className="relative group block overflow-hidden border-rawr-black">
                <div className="absolute inset-0 bg-gray-900">
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
                    <h2 className="text-6xl md:text-8xl font-heading font-black uppercase text-white group-hover:scale-110 transition-transform duration-500">
                        Women
                    </h2>
                    <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold bg-white text-rawr-black px-4 py-2">
                        <span>SHOP WOMENS</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </Link>
        </section>
    );
};
