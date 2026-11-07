import type { Product } from "@/lib/catalog";

export type PricedOrder = {
  lines: Product[];
  unknown: string[];
  totalKes: number;
};

/**
 * Prices a list of product IDs against a catalogue. The cart uses it for display;
 * the checkout API uses it with a catalogue freshly loaded from the database, so a
 * tampered request can never change what the customer is charged.
 */
export function priceItems(ids: readonly string[], products: readonly Product[]): PricedOrder {
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines: Product[] = [];
  const unknown: string[] = [];

  for (const id of new Set(ids)) {
    const product = byId.get(id);
    if (product) lines.push(product);
    else unknown.push(id);
  }

  return { lines, unknown, totalKes: lines.reduce((sum, l) => sum + l.priceKes, 0) };
}
