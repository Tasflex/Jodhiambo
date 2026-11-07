import "server-only";

import { formatKes } from "@/lib/format";
import { sendMail } from "@/lib/mailer";
import { verifyTransaction } from "@/lib/paystack";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type OrderItem = { id: string; title: string; priceKes: number; scope: string; accessDays: number };

export type OrderRow = {
  id: string;
  user_id: string;
  reference: string;
  items: OrderItem[];
  amount_kes: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  created_at: string;
  paid_at: string | null;
};

export type FulfilResult = "paid" | "pending" | "failed" | "not_found";

/**
 * Confirms a payment with Paystack and, if it succeeded, grants access.
 * Safe to call repeatedly and concurrently (the browser redirect and the webhook
 * both call it): the database function only fulfils a pending order once.
 */
export async function fulfilOrder(reference: string): Promise<FulfilResult> {
  const db = createSupabaseAdminClient();

  const { data: order } = await db.from("orders").select("*").eq("reference", reference).maybeSingle<OrderRow>();
  if (!order) return "not_found";
  if (order.status !== "pending") return order.status;

  const tx = await verifyTransaction(reference);
  if (tx.status !== "success") {
    if (tx.status === "failed" || tx.status === "abandoned" || tx.status === "reversed") {
      await db.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
      return "failed";
    }
    return "pending";
  }

  // Paystack reports amounts in the subunit; the order stores whole shillings.
  if (!Number.isInteger(tx.amount / 100)) {
    console.error(`[orders] unexpected fractional amount ${tx.amount} for ${reference}`);
    return "pending";
  }
  const { data: fulfilled, error } = await db.rpc("fulfil_order", {
    p_reference: reference,
    p_amount_kes: tx.amount / 100,
    p_currency: tx.currency,
  });
  if (error) throw error;

  if (fulfilled) {
    await notifyOwner(order).catch((err) => console.error("[orders] owner notification failed", err));
    return "paid";
  }

  // Not fulfilled: either another request got there first, or the amount/currency did not match.
  const { data: latest } = await db.from("orders").select("status").eq("id", order.id).single<Pick<OrderRow, "status">>();
  if (latest?.status === "paid") return "paid";
  console.error(`[orders] payment mismatch for ${reference}: paid ${tx.amount} ${tx.currency}, expected ${order.amount_kes * 100} ${order.currency}`);
  return "pending";
}

async function notifyOwner(order: OrderRow) {
  const db = createSupabaseAdminClient();
  const { data } = await db.auth.admin.getUserById(order.user_id);
  await sendMail({
    subject: `New payment ${order.reference}: ${formatKes(order.amount_kes)}`,
    text: [
      `Reference: ${order.reference}`,
      `Customer: ${data.user?.email ?? order.user_id}`,
      "",
      ...order.items.map((i) => `- ${i.title}: ${formatKes(i.priceKes)}`),
      "",
      `Total: ${formatKes(order.amount_kes)}`,
    ].join("\n"),
  });
}
