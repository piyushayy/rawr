"use client";

import { useCurrencyStore, formatPrice } from "@/store/useCurrencyStore";
import { useEffect, useState } from "react";

export const Price = ({
  amount,
  className = "",
}: {
  amount: number;
  className?: string;
}) => {
  const { currency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering USD on server/first render
  if (!mounted) {
    return <span className={className}>${amount.toFixed(2)}</span>;
  }

  return <span className={className}>{formatPrice(amount, currency)}</span>;
};
