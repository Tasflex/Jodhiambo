import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaBook, FaFileLines, FaNewspaper } from "react-icons/fa6";
import styles from "@/components/publications/publications.module.css";
import { getArticles, getBooks, getResearch, outletsOf } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Research papers, books and media commentary by Dr. Joab Odhiambo on actuarial science, AI and public policy.",
};

export default async function PublicationsOverview() {
  const [researchPapers, books, mediaArticles] = await Promise.all([getResearch(), getBooks(), getArticles()]);
  const outlets = outletsOf(mediaArticles);
  const years = researchPapers.length ? researchPapers.map((p) => p.year) : [new Date().getFullYear()];
  const sections = [
    {
      href: "/publications/research",
      icon: FaFileLines,
      title: "Research papers",
      count: researchPapers.length,
      text: `Peer-reviewed work from ${Math.min(...years)} to ${Math.max(...years)} on mortality modelling, quantitative finance, AI and policy foresight.`,
    },
    {
      href: "/publications/books",
      icon: FaBook,
      title: "Books",
      count: books.length,
      text: "On AI in actuarial science, systematic mortality risk, and practical AI for Sub-Saharan Africa.",
    },
    {
      href: "/publications/articles",
      icon: FaNewspaper,
      title: "Media commentary",
      count: mediaArticles.length,
      text: `Opinion columns in ${outlets.join(", ")} on education, the economy and technology.`,
    },
  ];

  return (
    <>
      <ul role="list" className={styles.overviewCards}>
        {sections.map(({ href, icon: Icon, title, count, text }, i) => (
          <li key={href} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
            <Link href={href} className={`card card--hover ${styles.overviewCard}`}>
              <span className="icon-tile">
                <Icon aria-hidden />
              </span>
              <span className={styles.overviewCount}>{count}</span>
              <h2>{title}</h2>
              <p>{text}</p>
              <span className="link-arrow">
                Browse <FaArrowRight aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.overviewSplit}>
        <section aria-labelledby="latest-research" data-reveal>
          <div className={styles.miniHead}>
            <h2 id="latest-research">Latest research</h2>
            <Link href="/publications/research" className="link-arrow">
              All papers <FaArrowRight aria-hidden />
            </Link>
          </div>
          <ul role="list" className={styles.miniList}>
            {researchPapers.slice(0, 4).map((p) => (
              <li key={p.id}>
                <span className={styles.miniYear}>{p.year}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.venue}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="latest-media" data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
          <div className={styles.miniHead}>
            <h2 id="latest-media">Latest commentary</h2>
            <Link href="/publications/articles" className="link-arrow">
              All articles <FaArrowRight aria-hidden />
            </Link>
          </div>
          <ul role="list" className={styles.miniList}>
            {mediaArticles.slice(0, 4).map((a) => (
              <li key={a.url}>
                <span className={styles.miniYear}>{a.date.slice(0, 4)}</span>
                <div>
                  <h3>
                    <a href={a.url} target="_blank" rel="noopener noreferrer">
                      {a.title}
                    </a>
                  </h3>
                  <p>
                    {a.outlet} · {formatDate(a.date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="books-strip" className={styles.booksStrip} data-reveal>
        <div className={styles.miniHead}>
          <h2 id="books-strip">Books</h2>
          <Link href="/publications/books" className="link-arrow">
            View books <FaArrowRight aria-hidden />
          </Link>
        </div>
        <div className={styles.coverRow}>
          {books.map((b) => (
            <a key={b.id} href={b.amazonUrl} target="_blank" rel="noopener noreferrer" className={styles.coverLink}>
              <Image src={b.image} alt={`Cover of ${b.title}`} width={180} height={270} />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
