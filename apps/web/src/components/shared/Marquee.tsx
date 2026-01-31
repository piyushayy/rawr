"use client";

import { motion } from "framer-motion";

export const Marquee = () => {
    return (
        <div className="py-8 bg-rawr-black text-rawr-white overflow-hidden border-y-2 border-rawr-black flex">
            <motion.div
                className="whitespace-nowrap flex gap-4"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            >
                {Array(20).fill("FRESH KILLS • ").map((text, i) => (
                    <h2 key={i} className="text-4xl md:text-6xl font-heading font-black">
                        {text}
                    </h2>
                ))}
            </motion.div>
        </div>
    );
};
