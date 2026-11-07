"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaBars, FaCircleUser, FaXmark } from "react-icons/fa6";
import { Logo } from "@/components/ui/Logo";
import { mainNav, site } from "@/data/site";
import { CartButton } from "./CartButton";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Elevate the header once the page has scrolled.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // While the drawer is open: lock page scroll, close on Escape, manage focus.
  useEffect(() => {
    if (!open) return;
    const menuButton = menuBtnRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      menuButton?.focus();
    };
  }, [open]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.bar}`}>
          <Link href="/" className={styles.logo} aria-label="Jodhiambo home">
            <Logo />
          </Link>
  
          <nav aria-label="Main" className={styles.nav}>
            <ul role="list" className={styles.links}>
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
            <ThemeToggle className={`${styles.iconBtn} ${styles.hideOnMobile}`} />
            <button
              ref={menuBtnRef}
              type="button"
              className={`${styles.iconBtn} ${styles.menuBtn}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <FaBars aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer: outside <header>, whose backdrop-filter would trap position:fixed */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        id="mobile-menu"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <div className={styles.drawerTop}>
          <Logo className={styles.drawerLogo} />
          <button
            ref={closeRef}
            type="button"
            className={styles.iconBtn}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <FaXmark aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul role="list" className={styles.drawerLinks}>
            {mainNav.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  className={styles.drawerLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                  <FaArrowRight aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.drawerFooter}>
          <ThemeToggle className={styles.drawerTheme} label="Switch theme" />
          <Link href="/pricing" className="btn btn--block">
            Get All-Access
          </Link>
          <a href={`mailto:${site.contact.email}`} className={styles.drawerMail}>
            {site.contact.email}
          </a>
        </div>
      </div>
    </>
  );
}
