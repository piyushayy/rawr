"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Countdown = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex gap-4 md:gap-8 justify-center mt-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                    <div className="text-4xl md:text-8xl font-heading font-black bg-rawr-black text-white p-4 min-w-[80px] md:min-w-[140px] border-2 border-white shadow-[8px_8px_0px_0px_#E60000]">
                        {String(value).padStart(2, '0')}
                    </div>
                    <div className="text-sm md:text-lg font-bold uppercase mt-2 text-rawr-black">{unit}</div>
                </div>
            ))}
        </div>
    );
};

export function DropsClient({ nextDropDateString }: { nextDropDateString: string }) {
    const nextDropDate = new Date(nextDropDateString);
    return (
        <div className="min-h-screen bg-rawr-white flex flex-col items-center justify-center p-4 text-center">

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-4xl w-full"
            >
                <div className="inline-block bg-rawr-red text-white px-6 py-2 font-bold uppercase text-xl mb-8 border-2 border-rawr-black -rotate-2">
                    Next Collection
                </div>

                <h1 className="text-6xl md:text-9xl font-heading font-black uppercase leading-none mb-8">
                    System<br />Overload
                </h1>

                <p className="text-xl md:text-2xl font-body max-w-2xl mx-auto mb-12">
                    The grid is resetting. 50 unique 1-of-1 pieces.
                    <br />
                    <span className="font-bold">Be fast or be naked.</span>
                </p>

                <Countdown targetDate={nextDropDate} />

                <div className="mt-16">
                    <Button size="lg" className="h-20 text-2xl px-16 uppercase tracking-widest bg-transparent border-2 border-rawr-black text-rawr-black hover:bg-rawr-black hover:text-white transition-all">
                        Get Notified
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
