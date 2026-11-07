import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/headings";
import { getCourse } from "@/data/courses";
import { getActiveEntitlements, summarise } from "@/lib/access";
import { formatKes } from "@/lib/format";
import type { OrderRow } from "@/lib/orders";
import { createSupabaseServerClient, getUser } from "@/lib/supabase/server";
import styles from "./account.module.css";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Africa/Nairobi" });

/** An order still pending after an hour was abandoned at Paystack; no money moved. */
const ABANDONED_AFTER_MS = 60 * 60 * 1000;

function orderStatus(status: OrderRow["status"], createdAt: string) {
  if (status === "pending" && Date.now() - new Date(createdAt).getTime() > ABANDONED_AFTER_MS) {
    return { key: "failed" as const, label: "Not completed" };
  }
  return { key: status, label: { paid: "Paid", pending: "Pending", failed: "Failed" }[status] };
}

function scopeLabel(scope: string) {
  if (scope === "all") return "All-Access Pass";
  return getCourse(scope.replace(/^course:/, ""))?.title ?? scope;
}

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/sign-in?next=/account");

  const supabase = await createSupabaseServerClient();
  const [entitlements, { data: orders }] = await Promise.all([
    getActiveEntitlements(),
    supabase
      .from("orders")
      .select("reference, items, amount_kes, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .returns<Pick<OrderRow, "reference" | "items" | "amount_kes" | "status" | "created_at">[]>(),
  ]);
  const access = [...summarise(entitlements).values()];

  return (
    <>
      <PageHeader eyebrow="Student area" title="My Account" intro={user.email} />
      <section className="section">
        <div className={`container ${styles.layout}`}>
          <div className="card">
            <h2>Active access</h2>
            {access.length === 0 ? (
              <p>
                You don&apos;t have any active access. <Link href="/pricing">Get an All-Access pass</Link> or{" "}
                <Link href="/courses">buy a course</Link>.
              </p>
            ) : (
              <ul role="list" className={styles.access}>
                {access.map((e) => (
                  <li key={e.scope}>
                    <strong>{scopeLabel(e.scope)}</strong>
                    <span>Until {dateTime.format(new Date(e.expires_at))}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className={styles.actions}>
              <Link href="/learn" className="btn">
                Go to My Learning
              </Link>
              <Link href="/pricing" className="btn btn--ghost">
                Extend access
              </Link>
            </p>
          </div>

          <div className="card">
            <h2>Order history</h2>
            {!orders?.length ? (
              <p>No orders yet.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Items</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => {
                      const status = orderStatus(o.status, o.created_at);
                      return (
                      <tr key={o.reference}>
                        <td>{dateTime.format(new Date(o.created_at))}</td>
                        <td>{o.items.map((i) => i.title).join(", ")}</td>
                        <td>{formatKes(o.amount_kes)}</td>
                        <td>
                          <span className={`${styles.status} ${styles[status.key]}`}>{status.label}</span>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <form action="/auth/signout" method="post">
            <button type="submit" className="btn btn--ghost">
              Sign out
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
