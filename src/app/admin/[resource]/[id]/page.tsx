import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { deleteResource } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { MaterialsManager } from "@/components/admin/MaterialsManager";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { listMaterials } from "@/lib/admin/data";
import { getResource } from "@/lib/admin/resources";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import styles from "@/components/admin/admin.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ resource: string; id: string }>;
  searchParams: Promise<{ created?: string }>;
};

/** Defaults for a new item. */
const defaults: Record<string, Record<string, unknown>> = {
  courses: { level: "Intermediate", icon: "book", category: "actuarial", access_days: 365, published: false, sort_order: 100 },
  plans: { active: true, featured: false, sort_order: 10 },
  research: { year: new Date().getFullYear() },
  articles: { published_on: new Date().toISOString().slice(0, 10) },
  books: { sort_order: 10 },
  gallery: { category: "events", sort_order: 100 },
};

export default async function ResourceEdit({ params, searchParams }: Props) {
  const { resource, id: rawId } = await params;
  const def = getResource(resource);
  if (!def) notFound();
  const { created } = await searchParams;

  const isNew = rawId === "new";
  const id = decodeURIComponent(rawId);
  let values: Record<string, unknown> = defaults[def.key] ?? {};

  if (!isNew) {
    const { data } = await createSupabaseAdminClient().from(def.table).select("*").eq(def.idColumn, id).maybeSingle();
    if (!data) notFound();
    values = data;
  }

  const materials = def.key === "courses" && !isNew ? await listMaterials(id) : null;
  const title = isNew ? `Add ${def.singular}` : String(values.title ?? values.name ?? `Edit ${def.singular}`);

  return (
    <>
      <Link href={`/admin/${def.key}`} className={styles.crumb}>
        <FaArrowLeft aria-hidden /> {def.title}
      </Link>
      <div className={styles.pageHead}>
        <div>
          <h1>{title}</h1>
          {def.key === "courses" && !isNew && (
            <p>
              <Link href={`/courses/${id}`} target="_blank" className="link-arrow">
                View course page <FaArrowUpRightFromSquare aria-hidden />
              </Link>
            </p>
          )}
        </div>
      </div>

      {created && (
        <p className={styles.notice}>Course created. Upload its PDF materials below, then tick Published when ready.</p>
      )}

      {materials && (
        <section className={styles.panel} style={{ marginBottom: 24 }} aria-labelledby="materials">
          <div className={styles.panelHead}>
            <h2 id="materials">Course materials (PDF)</h2>
            <span className={styles.muted}>
              {materials.length} file{materials.length === 1 ? "" : "s"} · view-only for students
            </span>
          </div>
          <div className={styles.panelBody}>
            <MaterialsManager courseSlug={id} initial={materials} />
          </div>
        </section>
      )}

      <section className={styles.panel} aria-label="Details">
        <div className={styles.panelBody}>
          <ResourceForm resource={def.key} fields={def.fields} values={values} id={isNew ? null : id} />
        </div>
      </section>

      {!isNew && (
        <form action={deleteResource} style={{ marginTop: 24 }}>
          <input type="hidden" name="_resource" value={def.key} />
          <input type="hidden" name="_id" value={id} />
          <ConfirmButton
            className="btn btn--ghost btn--sm"
            message={
              def.key === "courses"
                ? "Delete this course and all its PDF materials? Students who bought it will lose it from My Learning. This cannot be undone."
                : `Delete this ${def.singular}? This cannot be undone.`
            }
          >
            Delete {def.singular}
          </ConfirmButton>
        </form>
      )}
    </>
  );
}
