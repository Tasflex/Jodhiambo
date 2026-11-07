"use client";

import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { mediaArticles, outlets, type Outlet } from "@/data/articles";
import { formatDate } from "@/lib/format";
import styles from "./publications.module.css";

const PAGE_SIZE = 10;

export function ArticleList() {
  const [outlet, setOutlet] = useState<Outlet | "all">("all");
  const [shown, setShown] = useState(PAGE_SIZE);

  const filtered = outlet === "all" ? mediaArticles : mediaArticles.filter((a) => a.outlet === outlet);
  const visible = filtered.slice(0, shown);
  const remaining = filtered.length - visible.length;

  function selectOutlet(next: Outlet | "all") {
    setOutlet(next);
    setShown(PAGE_SIZE);
  }

  return (
    <>
      <div className="chip-row" role="group" aria-label="Filter by publication">
        {(["all", ...outlets] as const).map((o) => (
          <button key={o} type="button" className="chip" aria-pressed={outlet === o} onClick={() => selectOutlet(o)}>
            {o === "all" ? "All outlets" : o}
          </button>
        ))}
      </div>

      <p className={styles.count} aria-live="polite">
        Showing {visible.length} of {filtered.length} articles
      </p>

      <ul role="list" className={styles.articles}>
        {visible.map((a) => (
          <li key={a.url} className={styles.article}>
            <h3>{a.title}</h3>
            <p>
              {a.outlet} · <time dateTime={a.date}>{formatDate(a.date)}</time>
            </p>
            <a href={a.url} target="_blank" rel="noopener noreferrer" className="link-arrow">
              Read article <FaArrowUpRightFromSquare aria-hidden />
            </a>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <p className="text-center mt-lg">
          <button type="button" className="btn" onClick={() => setShown((n) => n + PAGE_SIZE)}>
            Load {Math.min(PAGE_SIZE, remaining)} more
          </button>
        </p>
      )}
    </>
  );
}
