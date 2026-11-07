import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaCircleCheck } from "react-icons/fa6";
import { AddToCartButton } from "@/components/courses/AddToCartButton";
import { CourseCard } from "@/components/courses/CourseCard";
import styles from "@/components/courses/courses.module.css";
import { PageHeader, SectionTitle } from "@/components/ui/headings";
import { COURSE_ACCESS_DAYS, courseCategories, courses, getCourse } from "@/data/courses";
import { courseProductId, describeAccess } from "@/lib/catalog";
import { formatKes } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse((await params).slug);
  return course ? { title: course.title, description: course.summary } : {};
}

export default async function CoursePage({ params }: Props) {
  const course = getCourse((await params).slug);
  if (!course) notFound();

  const category = courseCategories.find((c) => c.value === course.category)?.label;
  const related = courses.filter((c) => c.category === course.category && c.slug !== course.slug).slice(0, 3);

  return (
    <>
      <PageHeader title={course.title} intro={course.summary} />

      <section className="section">
        <div className="container">
          <Link href="/courses" className={styles.backLink}>
            <FaArrowLeft aria-hidden /> All courses
          </Link>

          <div className={styles.detail}>
            <div>
              <h2>What you will study</h2>
              <ul role="list" className={styles.topics}>
                {course.topics.map((t) => (
                  <li key={t}>
                    <FaCircleCheck aria-hidden /> {t}
                  </li>
                ))}
              </ul>

              <h2>Who it is for</h2>
              <p>
                Undergraduate and postgraduate students preparing for university and professional actuarial
                examinations, and practitioners refreshing their technical foundations in {category?.toLowerCase()}.
              </p>
            </div>

            <aside className={`card ${styles.buyBox}`} aria-label="Purchase">
              <span className={styles.price}>{formatKes(course.priceKes)}</span>
              <AddToCartButton productId={courseProductId(course.slug)} block />
              <ul role="list">
                <li>{describeAccess(COURSE_ACCESS_DAYS)} of access</li>
                <li>Read online on any device (view only)</li>
                <li>Category: {category}</li>
                <li>Prepared by Dr. Joab Odhiambo</li>
              </ul>
              <p className={styles.upsell}>
                Studying several subjects? <Link href="/pricing">An All-Access pass</Link> includes every course.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--alt" aria-labelledby="related-title">
          <div className="container">
            <SectionTitle id="related-title" title="Related courses" />
            <div className="grid">
              {related.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
