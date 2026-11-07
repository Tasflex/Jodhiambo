import Link from "next/link";
import { courseCategories, type Course } from "@/data/courses";
import { courseProductId } from "@/lib/catalog";
import { formatKes } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";
import styles from "./courses.module.css";

const categoryLabel = Object.fromEntries(courseCategories.map((c) => [c.value, c.label]));

export function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;
  return (
    <article className={`card card--hover ${styles.card}`}>
      <div className={styles.cardTop}>
        <span className="card-icon">
          <Icon aria-hidden />
        </span>
        <span className="badge">{categoryLabel[course.category]}</span>
      </div>
      <h3>
        <Link href={`/courses/${course.slug}`} className={styles.titleLink}>
          {course.title}
        </Link>
      </h3>
      <p>{course.summary}</p>
      <div className={styles.cardFooter}>
        <span className={styles.price}>{formatKes(course.priceKes)}</span>
        <AddToCartButton productId={courseProductId(course.slug)} />
      </div>
    </article>
  );
}
