
"use client";

import { Leaf, Search, Sparkles, Shirt } from "lucide-react";
import { motion } from "framer-motion";

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

export const BrandManifesto = () => {
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
            </div>
        </section>
    );
};
