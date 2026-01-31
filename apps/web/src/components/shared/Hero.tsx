"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
    return (
        <section className="relative h-[80vh] flex flex-col items-center justify-center border-b-2 border-rawr-black overflow-hidden bg-rawr-white">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
                {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-rawr-black" />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center flex flex-col items-center gap-6 p-4"
            >
                <span className="bg-rawr-neon text-rawr-black px-4 py-1 text-sm font-bold uppercase tracking-widest border border-rawr-black shadow-[4px_4px_0px_0px_#050505]">
                    Drop 001 is Live
                </span>

                <h1 className="text-5xl md:text-8xl lg:text-[10rem] leading-[0.85] font-black font-heading tracking-tighter text-rawr-black uppercase mix-blend-multiply">
                    NO<br /><span className="text-rawr-red">MERCY</span>
                </h1>

                <p className="font-body text-lg md:text-2xl max-w-xl mx-auto font-medium text-rawr-black/80 px-4">
                    LIMITED EDITION STREETWEAR. ONCE IT&apos;S GONE, IT&apos;S GONE FOREVER.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full px-4 sm:w-auto">
                    <Link href="/shop" className="w-full sm:w-auto">
                        <Button size="lg" className="text-xl h-16 w-full sm:px-12">
                            SHOP THE DROP
                        </Button>
                    </Link>
                    <Link href="/about" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="text-xl h-16 w-full sm:px-12 bg-white">
                            MANIFESTO
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};
