import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaAward, FaGraduationCap } from "react-icons/fa6";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <Image src="/img/hero.jpg" alt="" fill priority sizes="100vw" className={styles.bg} />
      <div className={styles.overlay} aria-hidden />

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={`eyebrow ${styles.eyebrow}`}>Actuary · Public Policy Analyst · Educator</span>
          <h1>
            Dr. Joab Onyango <span>Odhiambo</span>
          </h1>
          <p className={styles.lead}>
            Award-winning actuary and policy researcher turning rigorous data science into financial stability and
            better public policy for Sub-Saharan Africa.
          </p>
          <div className={styles.ctas}>
            <Link href="/courses" className="btn">
              Explore courses <FaArrowRight aria-hidden />
            </Link>
            <Link href="/publications" className="btn btn--light">
              Read the research
            </Link>
          </div>
          <ul role="list" className={styles.creds}>
            <li>
              <FaGraduationCap aria-hidden /> PhD, Actuarial Science
            </li>
            <li>
              <FaGraduationCap aria-hidden /> Post-Doc, Public Policy
            </li>
          </ul>
        </div>

        <div className={styles.visual}>
          <div className={styles.frame}>
            <Image
              src="/img/about.jpg"
              alt="Dr. Joab Odhiambo"
              fill
              priority
              sizes="(max-width: 900px) 70vw, 420px"
              className={styles.portrait}
            />
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>
              <FaAward aria-hidden />
            </span>
            <span>
              <strong>Outstanding Actuary</strong>
              <small>in Academia Award</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
