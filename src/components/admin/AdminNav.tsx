"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBook,
  FaChartPie,
  FaCrown,
  FaFileLines,
  FaGraduationCap,
  FaImages,
  FaNewspaper,
  FaReceipt,
  FaUsers,
} from "react-icons/fa6";
import styles from "./admin.module.css";

const groups = [
  {
    label: "Store",
    items: [
      { href: "/admin", label: "Dashboard", icon: FaChartPie },
      { href: "/admin/orders", label: "Orders", icon: FaReceipt },
      { href: "/admin/students", label: "Students", icon: FaUsers },
      { href: "/admin/courses", label: "Courses & PDFs", icon: FaGraduationCap },
      { href: "/admin/plans", label: "Plans", icon: FaCrown },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/research", label: "Research", icon: FaFileLines },
      { href: "/admin/articles", label: "Articles", icon: FaNewspaper },
      { href: "/admin/books", label: "Books", icon: FaBook },
      { href: "/admin/gallery", label: "Gallery", icon: FaImages },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <nav aria-label="Admin" className={styles.nav}>
      {groups.map((g) => (
        <div key={g.label} className={styles.navGroup}>
          <p className={styles.navLabel}>{g.label}</p>
          <ul role="list">
            {g.items.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink} aria-current={active(href) ? "page" : undefined}>
                  <Icon aria-hidden /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
