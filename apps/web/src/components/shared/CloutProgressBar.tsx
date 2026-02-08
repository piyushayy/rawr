
"use client";

import { getTier, getNextTier, TIERS } from "@/utils/tiers";
import { cn } from "@/lib/utils";

export const CloutProgressBar = ({ clout }: { clout: number }) => {
    const currentTier = getTier(clout);
    const nextTier = getNextTier(clout);

    let percentage = 100;
    if (nextTier) {
        const min = currentTier.minClout;
        const max = nextTier.minClout;
        percentage = Math.min(100, Math.max(0, ((clout - min) / (max - min)) * 100));
    }

    return (
        <div className="flex flex-col w-[140px] group cursor-default">
            <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500 mb-1">
                <span className={cn(currentTier.color.replace('bg-', 'text-'), "group-hover:text-rawr-black transition-colors")}>
                    {currentTier.name}
                </span>
                {nextTier && <span>{nextTier.name}</span>}
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={cn("h-full transition-all duration-1000 ease-out", currentTier.color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {nextTier && (
                <div className="text-[9px] text-right text-gray-400 mt-0.5 font-mono group-hover:text-rawr-red transition-colors">
                    {nextTier.minClout - clout} XP TO LEVEL UP
                </div>
            )}
        </div>
    );
};
