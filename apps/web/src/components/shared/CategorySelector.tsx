"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const CategorySelector = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh] md:h-[60vh]">
      <Link
        href="/shop?category=men"
        className="relative group block overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-rawr-black cursor-crosshair"
      >
        <div className="absolute inset-0 bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1200"
            alt="Mens Category"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 blur-[2px] group-hover:blur-0 scale-105"
          />
          <div className="absolute inset-0 bg-rawr-black/30 group-hover:bg-transparent transition-colors duration-500" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
          <h2 className="text-6xl md:text-8xl font-heading font-black uppercase text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] group-hover:-translate-y-4 group-hover:scale-110 transition-transform duration-500">
            Men
          </h2>
          <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold bg-rawr-neon text-rawr-black px-6 py-3 uppercase tracking-widest shadow-[4px_4px_0px_#050505] border-2 border-rawr-black">
            <span>SHOP MENS</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Link>

      <Link
        href="/shop?category=women"
        className="relative group block overflow-hidden border-rawr-black cursor-crosshair"
      >
        <div className="absolute inset-0 bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"
            alt="Womens Category"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 blur-[2px] group-hover:blur-0 scale-105"
          />
          <div className="absolute inset-0 bg-rawr-black/30 group-hover:bg-transparent transition-colors duration-500" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
          <h2 className="text-6xl md:text-8xl font-heading font-black uppercase text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] group-hover:-translate-y-4 group-hover:scale-110 transition-transform duration-500">
            Women
          </h2>
          <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold bg-rawr-red text-white px-6 py-3 uppercase tracking-widest shadow-[4px_4px_0px_#050505] border-2 border-rawr-black">
            <span>SHOP WOMENS</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Link>
    </section>
  );
};
