import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaBookOpenReader,
  FaCircleCheck,
  FaLayerGroup,
  FaLock,
  FaMobileScreen,
  FaRegClock,
  FaSignal,
} from "react-icons/fa6";
import { AddToCartButton } from "@/components/courses/AddToCartButton";
import { CourseCard } from "@/components/courses/CourseCard";
import styles from "@/components/courses/courses.module.css";
import { SectionTitle } from "@/components/ui/headings";
import { categoryLabel } from "@/data/taxonomy";
import { getCourse, getCourses, getPlans } from "@/lib/content";
import { courseProductId, describeAccess } from "@/lib/catalog";
import { formatKes } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCourses()).map((c) => ({ slug: c.slug }));
}

// Courses added later in the admin dashboard are rendered on first visit.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse((await params).slug);
  return course ? { title: course.title, description: course.overview } : {};
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse((await params).slug);
  if (!course) notFound();

  const [courses, plans] = await Promise.all([getCourses(), getPlans()]);
  const access = describeAccess(course.accessDays);
  const cheapestPass = plans.length ? Math.min(...plans.map((p) => p.priceKes)) : null;
  const related = courses.filter((c) => c.category === course.category && c.slug !== course.slug).slice(0, 3);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/courses">Courses</Link>
            <span aria-hidden>/</span>
            <span>{categoryLabel(course.category)}</span>
          </nav>
          <h1 data-reveal>{course.title}</h1>
          <p data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
            {course.summary}
          </p>
          <div className={styles.heroMeta} data-reveal style={{ "--reveal-i": 2 } as React.CSSProperties}>
            <span>
              <FaSignal aria-hidden /> {course.level}
            </span>
            <span>
              <FaLayerGroup aria-hidden /> {course.topics.length} topics
            </span>
            <span>
              <FaRegClock aria-hidden /> {access} access
            </span>
            <span>
              <FaBookOpenReader aria-hidden /> Online reader
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.detail}`}>
          <div>
            <div className={styles.block} data-reveal>
              <h2>About this course</h2>
              <p className={styles.lead}>{course.overview}</p>
            </div>

            <div className={styles.block} data-reveal>
              <h2>What you will learn</h2>
              <ul role="list" className={styles.outcomes}>
                {course.outcomes.map((o) => (
                  <li key={o}>
                    <FaCircleCheck aria-hidden /> <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.block} data-reveal>
              <h2>Course topics</h2>
              <ol role="list" className={styles.syllabus}>
                {course.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </div>

            <div className={`${styles.block} ${styles.twoCol}`} data-reveal>
              <div className={styles.infoBox}>
                <h3>Who this course is for</h3>
                <ul>
                  {course.audience.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.infoBox}>
                <h3>Before you start</h3>
                <p>{course.prerequisites}</p>
              </div>
            </div>

            <div className={styles.block} data-reveal>
              <h2>How access works</h2>
              <p>
                After payment, the course materials appear in <strong>My Learning</strong>. They open in a secure
                online reader on your phone, tablet or computer for {access}. Materials are view-only and cannot be
                downloaded. Buying again extends your access from the current end date.
              </p>
            </div>
          </div>

          <aside className={`card ${styles.buyBox}`} aria-label="Purchase">
            <span className={styles.price}>{formatKes(course.priceKes)}</span>
            <p className={styles.buyNote}>One-off payment · {access} access</p>
            <AddToCartButton productId={courseProductId(course.slug)} block />
            <ul role="list" className={styles.includes}>
              <li>
                <FaBookOpenReader aria-hidden /> Full course materials
              </li>
              <li>
                <FaMobileScreen aria-hidden /> Read on any device
              </li>
              <li>
                <FaRegClock aria-hidden /> {access} of access
              </li>
              <li>
                <FaLock aria-hidden /> Secure payment with M-Pesa or card
              </li>
            </ul>
            {cheapestPass !== null && (
              <p className={styles.upsell}>
                Studying several subjects? <Link href="/pricing">An All-Access pass</Link> from{" "}
                {formatKes(cheapestPass)} includes every course.
              </p>
            )}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--alt" aria-labelledby="related-title">
          <div className="container">
            <SectionTitle id="related-title" eyebrow="Keep learning" title="Related courses" />
            <div className="grid" style={{ "--min": "320px" } as React.CSSProperties}>
              {related.map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
