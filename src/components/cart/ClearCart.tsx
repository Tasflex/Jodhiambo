"use client";

import { useEffect } from "react";
import { cart } from "@/lib/cart-store";

/** Empties the cart once a payment has been confirmed. Renders nothing. */
export function ClearCart() {
  useEffect(() => cart.clear(), []);
  return null;
}
