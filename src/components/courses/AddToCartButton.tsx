"use client";

import Link from "next/link";
import { FaCartPlus, FaCheck } from "react-icons/fa6";
import { cart, useCart, useHydrated } from "@/lib/cart-store";

type Props = {
  productId: string;
  block?: boolean;
  label?: string;
  variant?: "primary" | "secondary";
};

export function AddToCartButton({ productId, block = false, label = "Add to cart", variant = "primary" }: Props) {
  const items = useCart();
  const hydrated = useHydrated();
  const inCart = hydrated && items.includes(productId);
  const cls = `btn ${variant === "secondary" ? "btn--secondary" : ""} ${block ? "btn--block" : ""}`;

  if (inCart) {
    return (
      <Link href="/cart" className={`${cls} btn--ghost`}>
        <FaCheck aria-hidden /> In cart, view cart
      </Link>
    );
  }

  return (
    <button type="button" className={cls} onClick={() => cart.add(productId)} disabled={!hydrated}>
      <FaCartPlus aria-hidden /> {label}
    </button>
  );
}
