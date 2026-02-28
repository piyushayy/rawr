import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "JPY";

interface CurrencyState {
  currency: CurrencyCode;
  rate: number; // relative to Base
  symbol: string;
  setCurrency: (code: CurrencyCode) => void;
}

export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; rate: number; name: string }
> = {
  INR: { symbol: "₹", rate: 1, name: "Indian Rupee" }, // Base Currency
  USD: { symbol: "$", rate: 0.012, name: "US Dollar" },
  EUR: { symbol: "€", rate: 0.011, name: "Euro" },
  GBP: { symbol: "£", rate: 0.0095, name: "British Pound" },
  JPY: { symbol: "¥", rate: 1.77, name: "Japanese Yen" },
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "INR",
      rate: 1,
      symbol: "₹",
      setCurrency: (code) =>
        set({
          currency: code,
          rate: CURRENCIES[code].rate,
          symbol: CURRENCIES[code].symbol,
        }),
    }),
    {
      name: "rawr-currency-storage-v2", // Changed version to reset cache
    },
  ),
);

export const formatPrice = (amount: number, currency: CurrencyCode) => {
  const { rate, symbol } = CURRENCIES[currency];
  const value = amount * rate;

  // Formatting nuances
  if (currency === "INR" || currency === "JPY") {
    return `${symbol}${Math.round(value).toLocaleString("en-IN")}`;
  }

  return `${symbol}${value.toFixed(2)}`;
};
