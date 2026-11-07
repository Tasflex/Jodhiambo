import Link from "next/link";
import { FaArrowRight, FaBookOpenReader, FaRegClock } from "react-icons/fa6";
import { categoryLabel } from "@/data/taxonomy";
import { courseProductId, describeAccess } from "@/lib/catalog";
import { CourseIcon } from "@/lib/course-icons";
import { formatKes } from "@/lib/format";
import type { Course } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";
import styles from "./courses.module.css";

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const href = `/courses/${course.slug}`;

  return (
    <article
      className={`card card--hover ${styles.card}`}
      data-reveal
      style={{ "--reveal-i": index % 6 } as React.CSSProperties}
    >
      <div className={styles.cardTop}>
        <span className="icon-tile">
          <CourseIcon name={course.icon} />
        </span>
        <div className={styles.tags}>
          <span className="badge badge--accent">{categoryLabel(course.category)}</span>
          <span className="badge">{course.level}</span>
        </div>
      </div>

      <h3 className={styles.cardTitle}>
        <Link href={href}>{course.title}</Link>
      </h3>
      <p className={styles.summary}>{course.summary}</p>

      <ul role="list" className={styles.meta}>
        <li>
          <FaRegClock aria-hidden /> {describeAccess(course.accessDays)} access
        </li>
        <li>
          <FaBookOpenReader aria-hidden /> {course.topics.length} topics · online reader
        </li>
      </ul>

      <div className={styles.cardFooter}>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatKes(course.priceKes)}</span>
        </div>
        <div className={styles.actions}>
          <Link href={href} className="btn btn--ghost btn--sm" aria-label={`View details: ${course.title}`}>
            View details <FaArrowRight aria-hidden />
          </Link>
          <AddToCartButton productId={courseProductId(course.slug)} size="sm" />
        </div>
      </div>
    </article>
  );
}
