"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
    targetDate: string;
    onComplete?: () => void;
}

export const CountdownTimer = ({ targetDate, onComplete }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        // Initial set
        const initial = calculateTimeLeft();
        if (!initial) {
            onComplete?.();
            return;
        }
        setTimeLeft(initial);

        const timer = setInterval(() => {
            const tl = calculateTimeLeft();
            if (!tl) {
                clearInterval(timer);
                onComplete?.();
                setTimeLeft(null);
            } else {
                setTimeLeft(tl);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (!timeLeft) return null;

    return (
        <div className="flex gap-4 text-center font-heading font-black text-3xl uppercase">
            <div>
                <span className="text-rawr-red">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-xs block text-gray-400">Days</span>
            </div>
            <div>
                <span>:</span>
            </div>
            <div>
                <span className="text-rawr-red">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs block text-gray-400">Hrs</span>
            </div>
            <div>
                <span>:</span>
            </div>
            <div>
                <span className="text-rawr-red">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs block text-gray-400">Min</span>
            </div>
            <div>
                <span>:</span>
            </div>
            <div>
                <span className="text-rawr-red">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs block text-gray-400">Sec</span>
            </div>
        </div>
    );
};
