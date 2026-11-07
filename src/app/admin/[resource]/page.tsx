import Link from "next/link";
import { notFound } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { getResource } from "@/lib/admin/resources";
import { formatDate, formatKes } from "@/lib/format";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import styles from "@/components/admin/admin.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string }>;
};

export async function generateMetadata({ params }: Props) {
  return { title: getResource((await params).resource)?.title ?? "Admin" };
}

export default async function ResourceList({ params, searchParams }: Props) {
  const def = getResource((await params).resource);
  if (!def) notFound();
  const { saved, deleted } = await searchParams;

  let query = createSupabaseAdminClient().from(def.table).select("*");
  for (const o of def.order) query = query.order(o.column, { ascending: o.ascending });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Record<string, unknown>[];

  const cell = (row: Record<string, unknown>, col: (typeof def.columns)[number]) => {
    const v = row[col.name];
    switch (col.format) {
      case "price":
        return formatKes(Number(v));
      case "date":
        return formatDate(String(v));
      case "bool":
        return (
          <span className={`${styles.pill} ${v ? styles.pill_yes : styles.pill_no}`}>{v ? "Yes" : "No"}</span>
        );
      case "image":
        // eslint-disable-next-line @next/next/no-img-element -- tiny admin thumbnail from any origin
        return <img src={String(v)} alt="" className={styles.thumb} loading="lazy" />;
      default:
        return String(v ?? "");
    }
  };

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>{def.title}</h1>
          <p>{def.description}</p>
        </div>
        <Link href={`/admin/${def.key}/new`} className="btn btn--sm">
          <FaPlus aria-hidden /> Add {def.singular}
        </Link>
      </div>

      {saved && <p className={styles.notice}>Saved. The website has been updated.</p>}
      {deleted && <p className={styles.notice}>Deleted.</p>}

      <section className={styles.panel}>
        {rows.length === 0 ? (
          <p className={styles.empty}>Nothing here yet. Add the first {def.singular}.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {def.columns.map((c) => (
                    <th key={c.name} scope="col">
                      {c.label}
                    </th>
                  ))}
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const id = String(row[def.idColumn]);
                  const href = `/admin/${def.key}/${encodeURIComponent(id)}`;
                  return (
                    <tr key={id}>
                      {def.columns.map((c, i) => (
                        <td key={c.name}>
                          {i === 0 || (i === 1 && def.columns[0].format === "image") ? (
                            c.format === "image" ? (
                              cell(row, c)
                            ) : (
                              <Link href={href} className={styles.rowLink}>
                                {cell(row, c)}
                              </Link>
                            )
                          ) : (
                            cell(row, c)
                          )}
                        </td>
                      ))}
                      <td style={{ textAlign: "right" }}>
                        <Link href={href} className={styles.linkBtn}>
                          {def.key === "courses" ? "Edit & materials" : "Edit"}
                        </Link>
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
