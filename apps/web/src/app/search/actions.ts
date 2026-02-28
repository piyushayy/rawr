"use server";

import { searchProducts } from "@/services/products";

export async function quickSearch(query: string) {
  if (!query || query.length < 2) return [];

  return await searchProducts({ query, sort: "newest" });
}

export async function getProductsByIdsAction(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  const { getProductsByIds } = await import("@/services/products");
  return await getProductsByIds(ids);
}
