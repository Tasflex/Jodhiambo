"use client";

import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { courseCategories } from "@/data/taxonomy";
import type { Course, CourseCategory } from "@/lib/types";
import { CourseCard } from "./CourseCard";
import styles from "./courses.module.css";

type Filter = CourseCategory | "all";

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = courses.filter(
    (c) =>
      (filter === "all" || c.category === filter) &&
      (!q || [c.title, c.summary, ...c.topics].some((t) => t.toLowerCase().includes(q))),
  );

  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: courses.length },
    ...courseCategories.map((c) => ({ ...c, count: courses.filter((x) => x.category === c.value).length })),
  ];

  return (
    <>
      <div className={styles.toolbar}>
        <div className="chip-row" role="group" aria-label="Filter courses by category">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className="chip"
              aria-pressed={filter === o.value}
              onClick={() => setFilter(o.value)}
            >
              {o.label} <span className="count">{o.count}</span>
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <span className="visually-hidden">Search courses</span>
          <FaMagnifyingGlass aria-hidden />
          <input
            type="search"
            className="form-control"
            placeholder="Search courses or topics"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <p className="visually-hidden" aria-live="polite">
        Showing {visible.length} course{visible.length === 1 ? "" : "s"}
      </p>

      {visible.length === 0 ? (
        <p className={styles.empty}>No courses match “{query}”. Try another word or clear the filters.</p>
      ) : (
        <div className="grid" style={{ "--min": "320px" } as React.CSSProperties}>
          {visible.map((course, i) => (
            <CourseCard key={course.slug} course={course} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
