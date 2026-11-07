import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { site } from "@/data/site";
import type { OrderItem } from "@/lib/orders";
import { initializeTransaction } from "@/lib/paystack";
import { priceItems } from "@/lib/pricing";
import { checkoutSchema } from "@/lib/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";

/**
 * Creates a pending order from the cart and starts a Paystack payment.
 * Prices come from the server-side catalogue, never from the request.
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user?.email) {
    return NextResponse.json({ ok: false, message: "Please sign in to check out." }, { status: 401 });
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Your cart is empty." }, { status: 400 });
  }

  const { lines, unknown, totalKes } = priceItems(parsed.data.items);
  if (unknown.length > 0 || lines.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Some items in your cart are no longer available. Please review your cart." },
      { status: 409 },
    );
  }

  const reference = `JO-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString("hex").toUpperCase()}`;
  const items: OrderItem[] = lines.map(({ id, title, priceKes, scope, accessDays }) => ({
    id,
    title,
    priceKes,
    scope,
    accessDays,
  }));

  const db = createSupabaseAdminClient();
  const { error } = await db.from("orders").insert({
    user_id: user.id,
    reference,
    items,
    amount_kes: totalKes,
    currency: "KES",
  });
  if (error) {
    console.error("[checkout] could not create order", error);
    return NextResponse.json({ ok: false, message: "Could not start checkout. Please try again." }, { status: 500 });
  }

  try {
    const tx = await initializeTransaction({
      email: user.email,
      amountKes: totalKes,
      reference,
      callbackUrl: `${site.url}/checkout/verify`,
      metadata: { user_id: user.id, items: items.map((i) => i.id) },
    });
    return NextResponse.json({ ok: true, authorizationUrl: tx.authorization_url });
  } catch (err) {
    console.error("[checkout] Paystack initialize failed", err);
    await db.from("orders").update({ status: "failed" }).eq("reference", reference);
    return NextResponse.json(
      { ok: false, message: "The payment service is unavailable right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
