"use client";

import { useState } from "react";
import { FaArrowUpRightFromSquare, FaCheck, FaMagnifyingGlass, FaQuoteLeft } from "react-icons/fa6";
import { AUTHOR, researchPapers, type ResearchPaper } from "@/data/research";
import styles from "./publications.module.css";

const allTags = Array.from(new Set(researchPapers.flatMap((p) => p.tags))).sort();

function citation(p: ResearchPaper) {
  return `${AUTHOR} (${p.year}). ${p.title}. ${p.venue}.${p.doi ? ` https://doi.org/${p.doi}` : ""}`;
}

function CiteButton({ paper }: { paper: ResearchPaper }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(citation(paper));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable (e.g. insecure context): nothing to do */
    }
  }
  return (
    <button type="button" className={styles.paperAction} onClick={copy}>
      {copied ? <FaCheck aria-hidden /> : <FaQuoteLeft aria-hidden />}
      {copied ? "Copied" : "Cite"}
      <span className="visually-hidden" aria-live="polite">
        {copied ? " citation copied" : ""}
      </span>
    </button>
  );
}

export function ResearchExplorer() {
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = researchPapers.filter(
    (p) =>
      (!tag || p.tags.includes(tag)) &&
      (!q || `${p.title} ${p.venue} ${p.tags.join(" ")}`.toLowerCase().includes(q)),
  );
  const years = Array.from(new Set(visible.map((p) => p.year))).sort((a, b) => b - a);

  return (
    <>
      <div className={styles.filters}>
        <label className={styles.search}>
          <span className="visually-hidden">Search research</span>
          <FaMagnifyingGlass aria-hidden />
          <input
            type="search"
            className="form-control"
            placeholder="Search titles, journals, topics"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className={styles.tagRow} role="group" aria-label="Filter by topic">
          <button type="button" className="chip" aria-pressed={tag === null} onClick={() => setTag(null)}>
            All topics
          </button>
          {allTags.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={tag === t} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        {visible.length} of {researchPapers.length} papers
      </p>

      {years.length === 0 && <p className={styles.empty}>No papers match your search.</p>}

      <div className={styles.timeline}>
        {years.map((year) => (
          <section key={year} className={styles.yearGroup} aria-labelledby={`y-${year}`}>
            <h2 id={`y-${year}`} className={styles.yearLabel}>
              {year}
            </h2>
            <ul role="list" className={styles.papers}>
              {visible
                .filter((p) => p.year === year)
                .map((p, i) => (
                  <li key={p.title} className={styles.paper} data-reveal style={{ "--reveal-i": i % 4 } as React.CSSProperties}>
                    <h3>{p.title}</h3>
                    <p className={styles.paperMeta}>
                      <span>{AUTHOR}</span>
                      <span aria-hidden>·</span>
                      <em>{p.venue}</em>
                    </p>
                    <div className={styles.paperFoot}>
                      <ul role="list" className={styles.tags} aria-label="Topics">
                        {p.tags.map((t) => (
                          <li key={t} className="badge">
                            {t}
                          </li>
                        ))}
                      </ul>
                      <div className={styles.paperActions}>
                        {p.doi && (
                          <a
                            href={`https://doi.org/${p.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.paperAction}
                          >
                            <FaArrowUpRightFromSquare aria-hidden /> DOI
                            <span className="visually-hidden"> {p.doi} (opens in a new tab)</span>
                          </a>
                        )}
                        <CiteButton paper={p} />
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
