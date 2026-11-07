import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <Image src="/img/hero.jpg" alt="" fill priority sizes="100vw" className={styles.bg} />
      <div className={styles.overlay} aria-hidden />
      <div className={`container ${styles.content}`}>
        <h1>{site.fullName}</h1>
        <p className={styles.tagline}>{site.tagline}</p>
        <p className={styles.lead}>
          Outstanding Actuary in Academia Award winner. Strategic thinker safeguarding financial stability and
          pioneering data-driven solutions for the challenges of tomorrow.
        </p>
        <div className={styles.ctas}>
          <Link href="/courses" className="btn btn--on-dark">
            Browse courses
          </Link>
          <Link href="/publications" className="btn btn--outline-light">
            View publications
          </Link>
        </div>
      </div>
    </section>
  );
}
