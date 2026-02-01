
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const DealCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Set goal to midnight tonight or next 24h cycle
        const calculateTimeLeft = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setHours(24, 0, 0, 0); // Next midnight

            const diff = tomorrow.getTime() - now.getTime();

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            return { hours, minutes, seconds };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-rawr-black text-rawr-white p-6 border-b-2 border-white mb-8">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-rawr-red w-3 h-3 rounded-full animate-pulse" />
                    <div>
                        <h3 className="text-2xl font-heading font-black uppercase text-white leading-none">
                            Daily Drop
                        </h3>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                            Expires In
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 font-mono text-3xl md:text-5xl font-black text-rawr-red">
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Hrs</span>
                    </div>
                    <span>:</span>
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Min</span>
                    </div>
                    <span>:</span>
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Sec</span>
                    </div>
                </div>

                <Link href="/shop?category=accessories">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-white text-rawr-black hover:bg-rawr-red hover:text-white uppercase font-black px-8 h-12 text-lg">
                            Secure The Goods
                        </Button>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
};
