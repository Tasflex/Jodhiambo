import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { PdfViewer } from "@/components/learn/PdfViewer";
import { canAccessCourse, getActiveEntitlements, getAllCourses, type MaterialRow } from "@/lib/access";
import { createSupabaseServerClient, getUser } from "@/lib/supabase/server";
import styles from "../../learn.module.css";

export const metadata: Metadata = { robots: { index: false } };

type Props = { params: Promise<{ slug: string; materialId: string }> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function MaterialPage({ params }: Props) {
  const { slug, materialId } = await params;
  const course = (await getAllCourses()).find((c) => c.slug === slug);
  if (!course || !UUID.test(materialId)) notFound();

  const user = await getUser();
  if (!user) redirect(`/sign-in?next=/learn/${slug}/${materialId}`);
  if (!canAccessCourse(await getActiveEntitlements(), slug, user)) redirect(`/courses/${slug}`);

  const supabase = await createSupabaseServerClient();
  const { data: material } = await supabase
    .from("materials")
    .select("id, title, course_slug")
    .eq("id", materialId)
    .eq("course_slug", slug)
    .maybeSingle<Pick<MaterialRow, "id" | "title" | "course_slug">>();
  if (!material) notFound();

  return (
    <section className={`section ${styles.readerSection}`}>
      <div className="container">
        <Link href={`/learn/${slug}`} className={styles.back}>
          <FaArrowLeft aria-hidden /> {course.title}
        </Link>
        <h1 className={styles.readerTitle}>{material.title}</h1>
        <PdfViewer materialId={material.id} watermark={user.email ?? user.id} />
      </div>
    </section>
  );
}
