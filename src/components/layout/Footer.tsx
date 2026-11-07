import Link from "next/link";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { mainNav, site } from "@/data/site";
import styles from "./Footer.module.css";

const learnLinks = [
  { href: "/courses", label: "All courses" },
  { href: "/pricing", label: "All-Access pass" },
  { href: "/learn", label: "My Learning" },
  { href: "/account", label: "My account" },
  { href: "/publications/books", label: "Books" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="Jodhiambo home">
            <Logo />
          </Link>
          <p>
            Actuary, public policy analyst and educator advancing actuarial science and data-driven policy across
            Sub-Saharan Africa.
          </p>
          <SocialLinks variant="footer" />
        </div>

        <nav aria-label="Footer">
          <h2 className={styles.heading}>Explore</h2>
          <ul role="list" className={styles.links}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.heading}>Learn</h2>
          <ul role="list" className={styles.links}>
            {learnLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a href={site.instituteUrl} target="_blank" rel="noopener noreferrer">
                Jodhiambo Institute
              </a>
            </li>
          </ul>
        </div>

        <address className={styles.contact}>
          <h2 className={styles.heading}>Contact</h2>
          <ul role="list" className={styles.links}>
            <li>
              <FaEnvelope aria-hidden />
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </li>
            <li>
              <FaPhone aria-hidden />
              <a href={site.contact.phoneHref}>{site.contact.phone}</a>
            </li>
            <li>
              <FaLocationDot aria-hidden />
              <span>{site.contact.affiliation}</span>
            </li>
          </ul>
        </address>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p>
          Designed by{" "}
          <a className={styles.credit} href={site.designer.url} target="_blank" rel="noopener noreferrer">
            {site.designer.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
