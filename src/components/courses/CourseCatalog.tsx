"use client";

import { useState } from "react";
import { courseCategories, courses, type CourseCategory } from "@/data/courses";
import { CourseCard } from "./CourseCard";

type Filter = CourseCategory | "all";

export function CourseCatalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? courses : courses.filter((c) => c.category === filter);
  const options: { value: Filter; label: string }[] = [{ value: "all", label: "All courses" }, ...courseCategories];

  return (
    <>
      <div className="chip-row" role="group" aria-label="Filter courses by category">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="chip"
            aria-pressed={filter === o.value}
            onClick={() => setFilter(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        Showing {visible.length} course{visible.length === 1 ? "" : "s"}
      </p>
      <div className="grid" style={{ "--min": "300px" } as React.CSSProperties}>
        {visible.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </>
  );
}
