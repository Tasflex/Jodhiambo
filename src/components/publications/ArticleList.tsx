"use client";

import { useState } from "react";
import { FaArrowUpRightFromSquare, FaMagnifyingGlass } from "react-icons/fa6";
import { mediaArticles, outlets, type Outlet } from "@/data/articles";
import { formatDate } from "@/lib/format";
import styles from "./publications.module.css";

const initials = (o: string) =>
  o
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

export function ArticleList() {
  const [outlet, setOutlet] = useState<Outlet | "all">("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = mediaArticles.filter(
    (a) => (outlet === "all" || a.outlet === outlet) && (!q || a.title.toLowerCase().includes(q)),
  );
  const years = Array.from(new Set(visible.map((a) => a.date.slice(0, 4)))).sort().reverse();

  return (
    <>
      <div className={styles.filters}>
        <label className={styles.search}>
          <span className="visually-hidden">Search articles</span>
          <FaMagnifyingGlass aria-hidden />
          <input
            type="search"
            className="form-control"
            placeholder="Search article titles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className={styles.tagRow} role="group" aria-label="Filter by publication">
          {(["all", ...outlets] as const).map((o) => (
            <button key={o} type="button" className="chip" aria-pressed={outlet === o} onClick={() => setOutlet(o)}>
              {o === "all" ? "All outlets" : o}
              <span className="count">
                {o === "all" ? mediaArticles.length : mediaArticles.filter((a) => a.outlet === o).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        {visible.length} of {mediaArticles.length} articles
      </p>

      {years.length === 0 && <p className={styles.empty}>No articles match your search.</p>}

      <div className={styles.timeline}>
        {years.map((year) => (
          <section key={year} className={styles.yearGroup} aria-labelledby={`a-${year}`}>
            <h2 id={`a-${year}`} className={styles.yearLabel}>
              {year}
            </h2>
            <ul role="list" className={styles.articleGrid}>
              {visible
                .filter((a) => a.date.startsWith(year))
                .map((a, i) => (
                  <li key={a.url} data-reveal style={{ "--reveal-i": i % 4 } as React.CSSProperties}>
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className={styles.article}>
                      <span className={styles.outletMark} aria-hidden>
                        {initials(a.outlet)}
                      </span>
                      <span className={styles.articleBody}>
                        <span className={styles.articleMeta}>
                          {a.outlet} · <time dateTime={a.date}>{formatDate(a.date)}</time>
                        </span>
                        <span className={styles.articleTitle}>{a.title}</span>
                      </span>
                      <FaArrowUpRightFromSquare aria-hidden className={styles.articleIcon} />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
