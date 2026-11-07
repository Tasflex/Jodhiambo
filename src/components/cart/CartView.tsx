"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaCrown, FaTrashCan } from "react-icons/fa6";
import { describeAccess, type Product } from "@/lib/catalog";
import { CourseIcon } from "@/lib/course-icons";
import { cart, useCart, useHydrated } from "@/lib/cart-store";
import { formatKes } from "@/lib/format";
import { priceItems } from "@/lib/pricing";
import styles from "./cart.module.css";

function ProductIcon({ product }: { product: Product }) {
  return product.kind === "plan" ? <FaCrown aria-hidden /> : <CourseIcon name={product.icon ?? "book"} />;
}

export function CartView({ products }: { products: Product[] }) {
  const items = useCart();
  const hydrated = useHydrated();
  const { lines, totalKes } = priceItems(items, products);
  const hasPlan = lines.some((l) => l.kind === "plan");
  const hasCourses = lines.some((l) => l.kind === "course");

  // Drop products that no longer exist in the catalogue (e.g. renamed or retired).
  useEffect(() => {
    priceItems(items, products).unknown.forEach((id) => cart.remove(id));
  }, [items, products]);

  if (!hydrated) {
    return <p className="text-center">Loading your cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className={`card card--center ${styles.empty}`}>
        <h2>Your cart is empty</h2>
        <p>Pick individual courses, or get everything with an All-Access pass.</p>
        <p className={styles.emptyCtas}>
          <Link href="/courses" className="btn">
            Browse courses
          </Link>
          <Link href="/pricing" className="btn btn--ghost">
            See All-Access passes
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div>
        <ul role="list" className={styles.lines}>
          {lines.map((line) => (
            <li key={line.id} className={`card ${styles.line}`}>
              <span className={styles.lineIcon}>
                <ProductIcon product={line} />
              </span>
              <span>
                <Link href={line.href} className={styles.lineTitle}>
                  {line.title}
                </Link>
                <br />
                <small className={styles.muted}>{describeAccess(line.accessDays)} access</small>
              </span>
              <span className={styles.linePrice}>{formatKes(line.priceKes)}</span>
              <button
                type="button"
                className={styles.remove}
                onClick={() => cart.remove(line.id)}
                aria-label={`Remove ${line.title} from cart`}
              >
                <FaTrashCan aria-hidden />
              </button>
            </li>
          ))}
        </ul>
        {hasPlan && hasCourses && (
          <p className={styles.note} role="note">
            Your All-Access pass already includes every course. You can remove the individual courses unless you want
            them to stay available after the pass ends.
          </p>
        )}
      </div>

      <aside className={`card ${styles.summary}`} aria-label="Order summary">
        <h2>Summary</h2>
        <dl>
          <div>
            <dt>Items</dt>
            <dd>{lines.length}</dd>
          </div>
          <div className={styles.total}>
            <dt>Total</dt>
            <dd>{formatKes(totalKes)}</dd>
          </div>
        </dl>
        <Link href="/checkout" className="btn btn--block">
          Proceed to checkout
        </Link>
        <Link href="/courses" className={styles.continue}>
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
