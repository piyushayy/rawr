"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { quickSearch } from "@/app/search/actions";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Price } from "./Price";
import { useRouter } from "next/navigation";

export const InstantSearch = ({ onClose }: { onClose?: () => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        const data = await quickSearch(query);
        setResults(data);
        setIsSearching(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH THE ARCHIVE..."
          className="w-full bg-rawr-white border-2 border-rawr-black p-3 pl-12 font-heading font-bold focus:outline-none focus:ring-0 focus:border-rawr-red transition-colors placeholder:text-gray-400"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-rawr-red transition-colors" />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-rawr-red"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        )}
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-rawr-white border-2 border-rawr-black shadow-[8px_8px_0px_0px_#050505] z-50 max-h-[70vh] overflow-y-auto"
          >
            <div className="p-4 bg-gray-50 border-b-2 border-rawr-black flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                Results for &quot;{query}&quot;
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-rawr-red">
                {results.length} found
              </span>
            </div>

            {results.length > 0 ? (
              <div className="divide-y-2 divide-rawr-black">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setIsOpen(false);
                      if (onClose) onClose();
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="relative w-16 h-20 border border-rawr-black bg-white overflow-hidden shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-black uppercase text-lg leading-tight truncate">
                        {product.title}
                      </h4>
                      <p className="text-sm font-bold text-gray-500 uppercase">
                        {product.category}
                      </p>
                      <div className="mt-1 font-bold text-rawr-red">
                        <Price amount={product.price} />
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/search?query=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                  }}
                  className="block p-4 text-center font-heading font-black uppercase hover:bg-rawr-black hover:text-white transition-all underline decoration-2 underline-offset-4"
                >
                  View All {results.length} Results
                </Link>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="font-black uppercase text-xl">Ghost town...</p>
                <p className="text-sm text-gray-500 mt-2">
                  No items matching that query in the vault.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
