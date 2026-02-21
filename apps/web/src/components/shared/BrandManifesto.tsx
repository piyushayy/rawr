
"use client";

import { Leaf, Search, Sparkles, Shirt, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { useState } from "react";
import Link from "next/link";
import { Price } from "./Price";

const DNA = [
    {
        icon: <Search className="w-8 h-8" />,
        title: "The Hunt",
        description: "We scour thousands of bins so you don't have to. Only 1% makes the cut."
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "The Revival",
        description: "Each piece is washed, steamed, and graded. No weird smells. Just fresh heat."
    },
    {
        icon: <Leaf className="w-8 h-8" />,
        title: "The Impact",
        description: "Saving the planet one vintage tee at a time. Zero fast fashion guilt."
    },
    {
        icon: <Shirt className="w-8 h-8" />,
        title: "The Rarity",
        description: "Everything is 1-of-1. When it's gone, it's gone forever. Don't sleep."
    }
];

export const BrandManifesto = ({ items }: { items?: Product[] }) => {
    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

    return (
        <section className="bg-rawr-black text-rawr-white py-20 border-y-2 border-rawr-black overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tight mb-6 leading-none">
                        Respect <br /><span className="text-rawr-red">The Archive</span>
                    </h2>
                    <p className="text-xl md:text-xl font-bold text-gray-400 uppercase tracking-widest max-w-xl mx-auto">
                        We are not just a store. We are a curation engine for the rare and the reckless.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {DNA.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm hover:bg-white/10 transition-colors group"
                        >
                            <div className="mb-6 text-rawr-red p-4 bg-rawr-red/10 inline-block rounded-full group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-heading font-bold uppercase mb-3">{item.title}</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {items && items.length > 0 && (
                    <div className="mt-20 border-t-2 border-white/20 pt-20">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight mb-4">
                                Shop <span className="text-rawr-red">The Look</span>
                            </h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest">
                                Hover over the image to snag the pieces.
                            </p>
                        </div>

                        <div className="relative max-w-4xl mx-auto aspect-[4/5] md:aspect-[16/9] border-4 border-rawr-black bg-gray-900 group">
                            {/* Using a placeholder editorial image. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200"
                                alt="Lookbook Editorial"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                            />

                            {/* Hotspot 1 */}
                            {items[0] && (
                                <div
                                    className="absolute top-[30%] left-[45%] md:top-[40%] md:left-[55%] z-20"
                                    onMouseEnter={() => setActiveHotspot(items[0].id)}
                                    onMouseLeave={() => setActiveHotspot(null)}
                                >
                                    <button className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                                        <span className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></span>
                                        <ShoppingBag className="w-4 h-4 z-10 relative" />
                                    </button>

                                    <AnimatePresence>
                                        {activeHotspot === items[0].id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white text-black p-3 border-2 border-rawr-black shadow-[4px_4px_0px_#FF0000]"
                                            >
                                                <p className="font-heading font-black text-sm uppercase truncate leading-none mb-1">{items[0].title}</p>
                                                <p className="font-mono text-xs text-rawr-red font-bold mb-2"><Price amount={items[0].price} /></p>
                                                <Link href={`/product/${items[0].id}`} className="block w-full text-center bg-rawr-black text-white py-1 font-bold text-xs uppercase hover:bg-rawr-red transition-colors">
                                                    View Details
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Hotspot 2 */}
                            {items[1] && (
                                <div
                                    className="absolute top-[65%] left-[50%] md:top-[70%] md:left-[45%] z-20"
                                    onMouseEnter={() => setActiveHotspot(items[1].id)}
                                    onMouseLeave={() => setActiveHotspot(null)}
                                >
                                    <button className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                                        <span className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></span>
                                        <ShoppingBag className="w-4 h-4 z-10 relative" />
                                    </button>

                                    <AnimatePresence>
                                        {activeHotspot === items[1].id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white text-black p-3 border-2 border-rawr-black shadow-[4px_4px_0px_#FF0000]"
                                            >
                                                <p className="font-heading font-black text-sm uppercase truncate leading-none mb-1">{items[1].title}</p>
                                                <p className="font-mono text-xs text-rawr-red font-bold mb-2"><Price amount={items[1].price} /></p>
                                                <Link href={`/product/${items[1].id}`} className="block w-full text-center bg-rawr-black text-white py-1 font-bold text-xs uppercase hover:bg-rawr-red transition-colors">
                                                    View Details
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
