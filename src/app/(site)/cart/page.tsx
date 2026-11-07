import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/ui/headings";
import { getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false },
};

export default async function CartPage() {
  const products = await getProducts();
  return (
    <>
      <PageHeader eyebrow="Store" title="Your cart" />
      <section className="section">
        <div className="container">
          <CartView products={products} />
        </div>
      </section>
    </>
  );
}
