import type { Metadata } from "next";
import Link from "next/link";
import { FaCircleCheck, FaCircleXmark, FaClock } from "react-icons/fa6";
import { ClearCart } from "@/components/cart/ClearCart";
import { PageHeader } from "@/components/ui/headings";
import { site } from "@/data/site";
import { fulfilOrder, type FulfilResult } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Payment status",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ reference?: string; trxref?: string }> };

const REFERENCE = /^JO-[A-Z0-9-]{6,60}$/;

/** Paystack redirects here after payment with ?reference=… */
export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref;

  let result: FulfilResult = "not_found";
  if (reference && REFERENCE.test(reference)) {
    try {
      result = await fulfilOrder(reference);
    } catch (err) {
      console.error("[verify] could not confirm payment", err);
      result = "pending";
    }
  }

  const view = {
    paid: {
      icon: <FaCircleCheck aria-hidden />,
      color: "var(--c-success)",
      title: "Payment successful",
      body: "Your access is active. Open My Learning to start reading.",
      cta: { href: "/learn", label: "Go to My Learning" },
    },
    pending: {
      icon: <FaClock aria-hidden />,
      color: "var(--c-primary)",
      title: "Payment is being confirmed",
      body: "This can take a minute for M-Pesa payments. Your access will appear in your account as soon as it is confirmed. You can safely refresh this page.",
      cta: { href: "/account", label: "View my account" },
    },
    failed: {
      icon: <FaCircleXmark aria-hidden />,
      color: "var(--c-danger)",
      title: "Payment was not completed",
      body: "You have not been charged. Your cart is still saved, so you can try again.",
      cta: { href: "/cart", label: "Back to cart" },
    },
    not_found: {
      icon: <FaCircleXmark aria-hidden />,
      color: "var(--c-danger)",
      title: "Order not found",
      body: "We couldn't find that payment. If you were charged, please contact us with your payment reference.",
      cta: { href: "/contact", label: "Contact us" },
    },
  }[result];

  return (
    <>
      <PageHeader eyebrow="Store" title="Payment status" />
      <section className="section">
        <div className="container">
          {result === "paid" && <ClearCart />}
          <div className="card card--center" style={{ maxWidth: 600, margin: "0 auto" }}>
            <span className="icon-tile" style={{ color: view.color, fontSize: "1.8rem", width: 72, height: 72 }}>
              {view.icon}
            </span>
            <h2>{view.title}</h2>
            {reference && (
              <p>
                Reference: <strong>{reference}</strong>
              </p>
            )}
            <p style={{ margin: "12px 0 24px" }}>{view.body}</p>
            <Link href={view.cta.href} className="btn">
              {view.cta.label}
            </Link>
            <p style={{ marginTop: 20, fontSize: "0.9rem" }}>
              Questions? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
