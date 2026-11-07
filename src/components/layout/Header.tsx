"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaCircleUser, FaXmark } from "react-icons/fa6";
import { mainNav } from "@/data/site";
import { CartButton } from "./CartButton";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Close on Escape and lock background scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo}>
          Dr. <span>Odhiambo</span>
        </Link>

        <nav aria-label="Main" className={styles.nav}>
          <ul id="main-menu" role="list" className={`${styles.links} ${open ? styles.open : ""}`}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.link}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link href="/account" className={styles.iconBtn} aria-label="My account">
            <FaCircleUser aria-hidden />
          </Link>
          <CartButton className={styles.iconBtn} badgeClassName={styles.badge} />
          <ThemeToggle className={styles.iconBtn} />
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            aria-expanded={open}
            aria-controls="main-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <FaXmark aria-hidden /> : <FaBars aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
