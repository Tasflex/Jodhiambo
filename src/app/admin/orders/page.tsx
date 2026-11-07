import Link from "next/link";
import { recheckOrder } from "@/app/admin/actions";
import { displayStatus, listOrders } from "@/lib/admin/data";
import { formatKes } from "@/lib/format";
import styles from "@/components/admin/admin.module.css";

export const metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

const dt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" });

const filters = [
  { value: "", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending / not completed" },
  { value: "failed", label: "Failed" },
];

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "" } = await searchParams;
  const orders = await listOrders({ status });
  const total = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amount_kes, 0);

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Orders</h1>
          <p>
            {orders.length} order{orders.length === 1 ? "" : "s"} shown · {formatKes(total)} paid
          </p>
        </div>
        <div className={styles.filterRow} role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/admin/orders?status=${f.value}` : "/admin/orders"}
              className="chip"
              aria-current={status === f.value ? "page" : undefined}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <section className={styles.panel}>
        {orders.length === 0 ? (
          <p className={styles.empty}>No orders match this filter.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col">Reference</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const st = displayStatus(o);
                  return (
                    <tr key={o.id}>
                      <td className={styles.muted}>{dt.format(new Date(o.created_at))}</td>
                      <td>{o.customer_email ?? <span className={styles.muted}>{o.user_id.slice(0, 8)}…</span>}</td>
                      <td>{o.items.map((i) => i.title).join(", ")}</td>
                      <td>
                        <strong>{formatKes(o.amount_kes)}</strong>
                      </td>
                      <td>
                        <span className={`${styles.pill} ${styles[`pill_${st.key}`]}`}>{st.label}</span>
                        {o.status === "pending" && (
                          <form action={recheckOrder} className={styles.inlineForm}>
                            <input type="hidden" name="reference" value={o.reference} />{" "}
                            <button type="submit" className={styles.linkBtn} title="Ask Paystack again">
                              Re-check
                            </button>
                          </form>
                        )}
                      </td>
                      <td className={styles.muted}>
                        <code>{o.reference}</code>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
