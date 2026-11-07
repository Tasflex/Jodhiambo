import { getProduct, type Product } from "@/lib/catalog";

export type PricedOrder = {
  lines: Product[];
  unknown: string[];
  totalKes: number;
};

/**
 * Prices a list of product IDs from the catalogue. Used by the cart for display
 * and by the checkout API as the source of truth, so a tampered request cannot
 * change what the customer is charged.
 */
export function priceItems(ids: readonly string[]): PricedOrder {
  const lines: Product[] = [];
  const unknown: string[] = [];

  for (const id of new Set(ids)) {
    const product = getProduct(id);
    if (product) lines.push(product);
    else unknown.push(id);
  }

  return { lines, unknown, totalKes: lines.reduce((sum, l) => sum + l.priceKes, 0) };
}
