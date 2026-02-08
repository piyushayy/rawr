
"use client";

import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export const EstimatedDelivery = ({ days = 5 }: { days?: number }) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700 border border-gray-200 p-4 bg-gray-50/50">
                <Truck className="w-5 h-5 opacity-70" />
                <div className="flex flex-col leading-none gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Estimated Arrival</span>
                    <span>
                        Get it by <span className="text-rawr-black underline decoration-rawr-red decoration-2 underline-offset-2">{dateString}</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <div className="flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> 30-Day Returns
                </div>
                <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Secure Checkout
                </div>
            </div>
        </div>
    );
};
