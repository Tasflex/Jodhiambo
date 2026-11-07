"use client";

import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import { useCart, useHydrated } from "@/lib/cart-store";

export function CartButton({ className, badgeClassName }: { className?: string; badgeClassName?: string }) {
  const items = useCart();
  const hydrated = useHydrated();
  const count = hydrated ? items.length : 0;

  return (
    <Link
      href="/cart"
      className={className}
      aria-label={count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
    >
      <FaCartShopping aria-hidden />
      {count > 0 && (
        <span className={badgeClassName} aria-hidden>
          {count}
        </span>
      )}
    </Link>
  );
}
