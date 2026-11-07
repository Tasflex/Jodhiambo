"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./publications.module.css";

type Counts = { research: number; books: number; articles: number };

export function PublicationsNav({ counts }: { counts: Counts }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/publications", label: "Overview" },
    { href: "/publications/research", label: "Research", count: counts.research },
    { href: "/publications/books", label: "Books", count: counts.books },
    { href: "/publications/articles", label: "Media", count: counts.articles },
  ];

  return (
    <nav aria-label="Publication types" className={styles.subnav}>
      <div className="container">
        <ul role="list" className={styles.tabs}>
          {tabs.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className={styles.tab} aria-current={pathname === t.href ? "page" : undefined}>
                {t.label}
                {t.count !== undefined && <span className={styles.tabCount}>{t.count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
