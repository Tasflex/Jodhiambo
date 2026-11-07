import { revokeAccess } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { GrantAccessForm } from "@/components/admin/GrantAccessForm";
import { getAllCourses } from "@/lib/access";
import { listStudents } from "@/lib/admin/data";
import { formatKes } from "@/lib/format";
import styles from "@/components/admin/admin.module.css";

export const metadata = { title: "Students" };
export const dynamic = "force-dynamic";

const d = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Africa/Nairobi" });

export default async function StudentsPage() {
  const [students, courses] = await Promise.all([listStudents(), getAllCourses()]);
  const titles = new Map(courses.map((c) => [`course:${c.slug}`, c.title]));
  const label = (scope: string) => (scope === "all" ? "All-Access" : (titles.get(scope) ?? scope));

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Students</h1>
          <p>
            {students.length} account{students.length === 1 ? "" : "s"}. Grant access for offline payments, scholarships
            or corrections.
          </p>
        </div>
      </div>

      <div className={styles.twoCol}>
        <section className={styles.panel} aria-labelledby="list">
          <div className={styles.panelHead}>
            <h2 id="list">Accounts</h2>
          </div>
          {students.length === 0 ? (
            <p className={styles.empty}>No one has signed up yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Student</th>
                    <th scope="col">Active access</th>
                    <th scope="col">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.email}</strong>
                        <div className={styles.muted}>
                          Joined {d.format(new Date(s.createdAt))}
                          {s.lastSignIn && ` · last seen ${d.format(new Date(s.lastSignIn))}`}
                        </div>
                      </td>
                      <td>
                        {s.access.length === 0 ? (
                          <span className={styles.muted}>None</span>
                        ) : (
                          <ul role="list" style={{ display: "grid", gap: 6 }}>
                            {s.access.map((e) => (
                              <li key={e.id}>
                                <span className={`${styles.pill} ${styles.pill_yes}`}>{label(e.scope)}</span>{" "}
                                <span className={styles.muted}>until {d.format(new Date(e.expires_at))}</span>{" "}
                                <form action={revokeAccess} className={styles.inlineForm}>
                                  <input type="hidden" name="id" value={e.id} />
                                  <ConfirmButton
                                    className={`${styles.linkBtn} ${styles.dangerBtn}`}
                                    message={`Remove ${label(e.scope)} access for ${s.email}?`}
                                  >
                                    Revoke
                                  </ConfirmButton>
                                </form>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td>{s.spentKes ? formatKes(s.spentKes) : <span className={styles.muted}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="grant">
          <div className={styles.panelHead}>
            <h2 id="grant">Grant access</h2>
          </div>
          <div className={styles.panelBody}>
            <GrantAccessForm
              students={students.map((s) => s.email)}
              courses={courses.map((c) => ({ value: `course:${c.slug}`, label: c.title }))}
            />
          </div>
        </section>
      </div>
    </>
  );
}
