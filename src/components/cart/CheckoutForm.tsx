"use client";

import Link from "next/link";
import { useState } from "react";
import { FaLock } from "react-icons/fa6";
import { describeAccess, type Product } from "@/lib/catalog";
import { useCart, useHydrated } from "@/lib/cart-store";
import { formatKes } from "@/lib/format";
import { priceItems } from "@/lib/pricing";
import styles from "./cart.module.css";

type ApiResult = { ok: true; authorizationUrl: string } | { ok: false; message: string };

export function CheckoutForm({ email, products }: { email: string; products: Product[] }) {
  const items = useCart();
  const hydrated = useHydrated();
  const { lines, totalKes } = priceItems(items, products);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) return <p className="text-center">Loading…</p>;

  if (lines.length === 0) {
    return (
      <div className={`card card--center ${styles.empty}`}>
        <h2>Your cart is empty</h2>
        <p>Add a course or an All-Access pass before checking out.</p>
        <Link href="/courses" className="btn">
          Browse courses
        </Link>
      </div>
    );
  }

  async function pay() {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map((l) => l.id) }),
      });
      const data = (await res.json().catch(() => null)) as ApiResult | null;
      if (data?.ok) {
        window.location.assign(data.authorizationUrl); // Paystack hosted payment page
        return;
      }
      setError(data?.message ?? "Something went wrong. Please try again.");
    } catch {
      setError("Network error. Check your connection and try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className={styles.layout}>
      <div className="card">
        <h2 className={styles.formTitle}>Review your order</h2>
        <ul role="list" className={styles.summaryLines}>
          {lines.map((l) => (
            <li key={l.id}>
              <span>
                <strong>{l.title}</strong>
                <br />
                <small className={styles.muted}>{describeAccess(l.accessDays)} access</small>
              </span>
              <span>{formatKes(l.priceKes)}</span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Signed in as <strong>{email}</strong>. Your access is linked to this account and starts as soon as payment
          is confirmed.
        </p>
      </div>

      <aside className={`card ${styles.summary}`} aria-label="Payment">
        <h2>Total</h2>
        <p className={styles.bigTotal}>{formatKes(totalKes)}</p>
        <button type="button" className="btn btn--block" onClick={pay} disabled={submitting}>
          <FaLock aria-hidden /> {submitting ? "Redirecting to Paystack…" : "Pay with Paystack"}
        </button>
        <p className={styles.note}>M-Pesa and card payments are processed securely by Paystack.</p>
        {error && (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        )}
        <Link href="/cart" className={styles.continue}>
          Edit cart
        </Link>
      </aside>
    </div>
  );
}
