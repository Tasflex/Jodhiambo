import type { Metadata } from "next";
import { FaFileLines } from "react-icons/fa6";
import { AUTHOR, researchPapers } from "@/data/research";
import styles from "@/components/publications/publications.module.css";

export const metadata: Metadata = {
  title: "Research Papers",
  description: "Peer-reviewed research on mortality modelling, quantitative finance, AI, energy and health policy.",
};

export default function ResearchPage() {
  return (
    <>
      <h2 className="visually-hidden">Research papers</h2>
      <ul role="list" className={`grid ${styles.research}`} style={{ "--min": "340px" } as React.CSSProperties}>
        {researchPapers.map((paper) => (
          <li key={paper.title} className={`card ${styles.paper}`}>
            <span className={styles.paperIcon}>
              <FaFileLines aria-hidden />
            </span>
            <h3>{paper.title}</h3>
            <p className={styles.paperMeta}>
              <span className={styles.venue}>{paper.venue}</span>
              <span className={styles.year}>{paper.year}</span>
            </p>
            <dl className={styles.details}>
              <div>
                <dt>Author</dt>
                <dd>{AUTHOR}</dd>
              </div>
              {paper.doi && (
                <div>
                  <dt>DOI</dt>
                  <dd>
                    <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                      {paper.doi}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <ul role="list" className={styles.tags} aria-label="Topics">
              {paper.tags.map((tag) => (
                <li key={tag} className="badge">
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
