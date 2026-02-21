"use client";

import { motion } from "framer-motion";

export const Marquee = () => {
    return (
        <div className="py-6 bg-rawr-red text-white overflow-hidden border-y-4 border-rawr-black flex transform -rotate-2 scale-105 shadow-[0px_8px_0px_#050505] z-20 relative">
            <motion.div
                className="whitespace-nowrap flex gap-4"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
            >
                {Array(20).fill("").map((_, i) => (
                    <h2 key={i} className="text-4xl md:text-6xl font-heading font-black">
                        FRESH KILLS <span className="text-rawr-black stroke-text">☠️ NO RESTOCKS ☠️</span>
                    </h2>
                ))}
            </motion.div>
        </div>
    );
};
