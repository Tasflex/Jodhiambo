"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/publications/research", label: "Research Papers" },
  { href: "/publications/books", label: "Books" },
  { href: "/publications/articles", label: "Media Articles" },
];

export function PublicationsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Publication types">
      <ul role="list" className="chip-row">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="chip" aria-current={pathname === t.href ? "page" : undefined}>
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
