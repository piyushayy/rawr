"use client";

import { useCurrencyStore, CURRENCIES, CurrencyCode } from "@/store/useCurrencyStore";
import { Globe } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const CurrencySwitcher = () => {
    const { currency, setCurrency } = useCurrencyStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-xs font-bold uppercase hover:bg-white/10 hover:text-white text-gray-400">
                    <Globe className="w-4 h-4" />
                    {currency} / {CURRENCIES[currency].symbol}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-rawr-black border-gray-800 text-white min-w-[150px]">
                {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => setCurrency(code as CurrencyCode)}
                        className="font-mono text-xs cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
                    >
                        <span className="w-6 text-center">{symbol}</span>
                        <span className="flex-1 ml-2">{code}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
