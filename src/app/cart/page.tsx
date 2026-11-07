import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/ui/headings";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader title="Your Cart" />
      <section className="section">
        <div className="container">
          <CartView />
        </div>
      </section>
    </>
  );
}
