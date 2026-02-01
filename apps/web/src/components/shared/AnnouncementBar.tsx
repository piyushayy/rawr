
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-rawr-red text-white text-xs font-bold uppercase tracking-widest relative z-[60]"
            >
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex-1 text-center">
                        <span>Free Worldwide Shipping on Orders Over $150</span>
                        <span className="hidden md:inline mx-2">//</span>
                        <span className="hidden md:inline">No Restocks. Ever.</span>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
