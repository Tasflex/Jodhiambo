import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { dashboardStats, displayStatus } from "@/lib/admin/data";
import { formatKes } from "@/lib/format";
import styles from "@/components/admin/admin.module.css";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const dt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" });

export default async function AdminDashboard() {
  const s = await dashboardStats();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Dashboard</h1>
          <p>Sales, students and content at a glance.</p>
        </div>
        <Link href="/admin/courses/new" className="btn btn--sm">
          Add a course
        </Link>
      </div>

      <div className={styles.stats}>
        <div className={`${styles.stat} ${styles.statAccent}`}>
          <span>Revenue (all time)</span>
          <strong>{formatKes(s.revenue)}</strong>
          <small>{formatKes(s.revenue30)} in the last 30 days</small>
        </div>
        <div className={styles.stat}>
          <span>Paid orders</span>
          <strong>{s.paidOrders}</strong>
          <small>{s.awaitingPayment} awaiting payment</small>
        </div>
        <div className={styles.stat}>
          <span>Students</span>
          <strong>{s.students}</strong>
          <small>{s.activeLearners} with active access</small>
        </div>
        <div className={styles.stat}>
          <span>Published courses</span>
          <strong>{s.publishedCourses}</strong>
          <small>{s.materials} PDF materials uploaded</small>
        </div>
      </div>

      <div className={styles.twoCol}>
        <section className={styles.panel} aria-labelledby="recent">
          <div className={styles.panelHead}>
            <h2 id="recent">Recent orders</h2>
            <Link href="/admin/orders" className="link-arrow">
              All orders <FaArrowRight aria-hidden />
            </Link>
          </div>
          {s.recent.length === 0 ? (
            <p className={styles.empty}>No orders yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Customer</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {s.recent.map((o) => {
                    const st = displayStatus(o);
                    return (
                      <tr key={o.id}>
                        <td>{o.customer_email ?? <span className={styles.muted}>unknown</span>}</td>
                        <td>{formatKes(o.amount_kes)}</td>
                        <td>
                          <span className={`${styles.pill} ${styles[`pill_${st.key}`]}`}>{st.label}</span>
                        </td>
                        <td className={styles.muted}>{dt.format(new Date(o.created_at))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="best">
          <div className={styles.panelHead}>
            <h2 id="best">Best sellers</h2>
          </div>
          {s.bestSellers.length === 0 ? (
            <p className={styles.empty}>Sales will appear here.</p>
          ) : (
            <ol className={styles.panelBody} style={{ display: "grid", gap: 10, paddingLeft: 40 }}>
              {s.bestSellers.map(([title, n]) => (
                <li key={title}>
                  <strong>{title}</strong> <span className={styles.muted}>· {n} sold</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
