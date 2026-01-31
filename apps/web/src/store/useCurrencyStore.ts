import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

interface CurrencyState {
    currency: CurrencyCode;
    rate: number; // relative to USD
    symbol: string;
    setCurrency: (code: CurrencyCode) => void;
}

export const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; name: string }> = {
    USD: { symbol: '$', rate: 1, name: 'US Dollar' },
    EUR: { symbol: '€', rate: 0.92, name: 'Euro' }, // Mock rates
    GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
    JPY: { symbol: '¥', rate: 148.5, name: 'Japanese Yen' },
};

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            currency: 'USD',
            rate: 1,
            symbol: '$',
            setCurrency: (code) => set({
                currency: code,
                rate: CURRENCIES[code].rate,
                symbol: CURRENCIES[code].symbol
            }),
        }),
        {
            name: 'rawr-currency-storage',
        }
    )
);

export const formatPrice = (amountInUSD: number, currency: CurrencyCode) => {
    const { rate, symbol } = CURRENCIES[currency];
    const value = amountInUSD * rate;

    // Formatting nuances
    if (currency === 'JPY') {
        return `${symbol}${Math.round(value).toLocaleString()}`;
    }

    return `${symbol}${value.toFixed(2)}`;
};
