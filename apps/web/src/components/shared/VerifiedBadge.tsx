import { BadgeCheck } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const VerifiedBadge = () => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-full cursor-help hover:bg-blue-100 transition-colors border border-blue-100">
                        <BadgeCheck className="w-4 h-4 fill-blue-700 text-white" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Verified Authentic</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-rawr-black text-white border-none text-xs font-bold uppercase p-3 max-w-[200px] text-center shadow-xl">
                    <p>Every item is inspected by our experts for authenticity and quality.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
