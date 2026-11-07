import "server-only";

import type { OrderRow } from "@/lib/orders";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** Server-side queries for the admin dashboard (service role, after an admin check). */

export type AdminOrder = Pick<
  OrderRow,
  "id" | "reference" | "user_id" | "items" | "amount_kes" | "status" | "created_at" | "paid_at"
> & { customer_email: string | null };

/** An order still pending after an hour was abandoned at Paystack (no money moved). */
export const ABANDONED_AFTER_MS = 60 * 60 * 1000;

export function displayStatus(o: Pick<AdminOrder, "status" | "created_at">) {
  if (o.status === "pending" && Date.now() - Date.parse(o.created_at) > ABANDONED_AFTER_MS) {
    return { key: "failed" as const, label: "Not completed" };
  }
  return { key: o.status, label: { paid: "Paid", pending: "Awaiting payment", failed: "Failed" }[o.status] };
}

export async function listOrders(opts: { status?: string; limit?: number } = {}) {
  let q = createSupabaseAdminClient()
    .from("orders")
    .select("id, reference, user_id, customer_email, items, amount_kes, status, created_at, paid_at")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 200);
  if (opts.status && ["paid", "pending", "failed"].includes(opts.status)) q = q.eq("status", opts.status);
  const { data, error } = await q.returns<AdminOrder[]>();
  if (error) throw error;
  return data ?? [];
}

export async function listStudents() {
  const db = createSupabaseAdminClient();
  const [{ data: users, error }, { data: ents }, { data: paid }] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db
      .from("entitlements")
      .select("id, user_id, scope, starts_at, expires_at")
      .gt("expires_at", new Date().toISOString())
      .order("expires_at", { ascending: false }),
    db.from("orders").select("user_id, amount_kes").eq("status", "paid"),
  ]);
  if (error) throw error;

  const spent = new Map<string, number>();
  for (const o of paid ?? []) spent.set(o.user_id, (spent.get(o.user_id) ?? 0) + o.amount_kes);

  return users.users
    .map((u) => ({
      id: u.id,
      email: u.email ?? "(no email)",
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at ?? null,
      spentKes: spent.get(u.id) ?? 0,
      access: (ents ?? []).filter((e) => e.user_id === u.id) as {
        id: string;
        scope: string;
        starts_at: string;
        expires_at: string;
      }[],
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function dashboardStats() {
  const db = createSupabaseAdminClient();
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 86_400_000).toISOString();

  const [paid, pending, activeEnts, courses, materials, users, recent] = await Promise.all([
    db.from("orders").select("amount_kes, paid_at, items").eq("status", "paid"),
    db.from("orders").select("created_at").eq("status", "pending"),
    db.from("entitlements").select("user_id").gt("expires_at", now.toISOString()),
    db.from("courses").select("slug", { count: "exact", head: true }).eq("published", true),
    db.from("materials").select("id", { count: "exact", head: true }),
    db.auth.admin.listUsers({ perPage: 1000 }),
    listOrders({ limit: 8 }),
  ]);

  const paidRows = (paid.data ?? []) as { amount_kes: number; paid_at: string; items: { title: string }[] }[];
  const revenue = paidRows.reduce((s, o) => s + o.amount_kes, 0);
  const revenue30 = paidRows.filter((o) => o.paid_at >= monthAgo).reduce((s, o) => s + o.amount_kes, 0);

  const sales = new Map<string, number>();
  for (const o of paidRows) for (const i of o.items) sales.set(i.title, (sales.get(i.title) ?? 0) + 1);
  const bestSellers = [...sales.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const awaiting = (pending.data ?? []).filter((o) => now.getTime() - Date.parse(o.created_at) <= ABANDONED_AFTER_MS);

  return {
    revenue,
    revenue30,
    paidOrders: paidRows.length,
    awaitingPayment: awaiting.length,
    students: users.data?.users.length ?? 0,
    activeLearners: new Set((activeEnts.data ?? []).map((e) => e.user_id)).size,
    publishedCourses: courses.count ?? 0,
    materials: materials.count ?? 0,
    recent,
    bestSellers,
  };
}

export async function listMaterials(courseSlug: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("materials")
    .select("id, title, storage_path, size_bytes, sort_order")
    .eq("course_slug", courseSlug)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as { id: string; title: string; storage_path: string; size_bytes: number | null; sort_order: number }[];
}
