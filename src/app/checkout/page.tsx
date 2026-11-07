import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageHeader } from "@/components/ui/headings";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const user = await getUser();
  if (!user?.email) redirect("/sign-in?next=/checkout");

  return (
    <>
      <PageHeader title="Checkout" />
      <section className="section">
        <div className="container">
          <CheckoutForm email={user.email} />
        </div>
      </section>
    </>
  );
}
