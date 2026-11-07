import Link from "next/link";
import { mainNav, site } from "@/data/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import styles from "./Footer.module.css";

const shopLinks = [
  { href: "/courses", label: "All courses" },
  { href: "/pricing", label: "All-Access pass" },
  { href: "/learn", label: "My Learning" },
  { href: "/account", label: "My account" },
  { href: "/publications/books", label: "Books" },
  { href: "/cart", label: "Your cart" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <h2 className={styles.heading}>{site.name}</h2>
          <p>
            Actuary, public policy analyst and educator dedicated to advancing actuarial science and developing
            data-driven policy solutions.
          </p>
          <SocialLinks variant="footer" />
        </div>

        <nav aria-label="Footer">
          <h2 className={styles.heading}>Quick links</h2>
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
            {shopLinks.map((item) => (
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
          <p>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </p>
          <p>
            <a href={site.contact.phoneHref}>{site.contact.phone}</a>
          </p>
          <p>{site.contact.affiliation}</p>
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
