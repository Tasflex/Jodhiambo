import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa6";
import { PageHeader } from "@/components/ui/headings";
import { canAccessCourse, getActiveEntitlements, getAllCourses, type MaterialRow } from "@/lib/access";
import { createSupabaseServerClient, getUser } from "@/lib/supabase/server";
import styles from "../learn.module.css";

export const metadata: Metadata = { robots: { index: false } };

type Props = { params: Promise<{ slug: string }> };


export default async function LearnCoursePage({ params }: Props) {
  const { slug } = await params;
  const course = (await getAllCourses()).find((c) => c.slug === slug);
  if (!course) notFound();
  const user = await getUser();
  if (!user) redirect(`/sign-in?next=/learn/${slug}`);
  if (!canAccessCourse(await getActiveEntitlements(), slug, user)) redirect(`/courses/${slug}`);

  const supabase = await createSupabaseServerClient();
  const { data: materials } = await supabase
    .from("materials")
    .select("id, title, sort_order")
    .eq("course_slug", slug)
    .order("sort_order")
    .returns<Pick<MaterialRow, "id" | "title" | "sort_order">[]>();

  return (
    <>
      <PageHeader eyebrow="My Learning" title={course.title} />
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <Link href="/learn" className={styles.back}>
            <FaArrowLeft aria-hidden /> My Learning
          </Link>
          {!materials?.length ? (
            <p className="card">Materials for this course are being prepared. Please check back soon.</p>
          ) : (
            <ol className={styles.materials}>
              {materials.map((m) => (
                <li key={m.id}>
                  <Link href={`/learn/${slug}/${m.id}`} className={`card card--hover ${styles.material}`}>
                    <FaFilePdf aria-hidden />
                    <span>{m.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
