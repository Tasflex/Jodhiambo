import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaAward, FaGraduationCap } from "react-icons/fa6";
import { PageHeader } from "@/components/ui/headings";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { credentials } from "@/data/expertise";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dr. Joab Onyango Odhiambo: actuary, Chartered Financial and Actuarial Analyst, public policy researcher and educator.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Dr. Joab Onyango Odhiambo" intro="Actuarial data scientist, public policy expert and educator." />

      <section className="section">
        <div className={`container ${styles.layout}`}>
          <div className={styles.photo}>
            <Image
              src="/img/about.jpg"
              alt="Dr. Joab Odhiambo"
              width={600}
              height={800}
              priority
              sizes="(max-width: 900px) 100vw, 40vw"
            />
          </div>

          <div>
            <div className="prose">
              <p>
                Dr. Joab Onyango Odhiambo is a distinguished scholar, educator and thought leader in actuarial science,
                artificial intelligence and public policy. He holds a BSc, MSc and PhD in Actuarial Science,
                complemented by a Postdoctoral qualification in Public Policy Research and Analysis.
              </p>
              <p>
                As a Chartered Financial and Actuarial Analyst, Dr. Odhiambo brings extensive expertise in actuarial
                modelling, data science and evidence-based policy design, particularly within the Sub-Saharan African
                context. His multidisciplinary research spans artificial intelligence, insurance and financial
                mathematics, and public policy.
              </p>
              <p>
                He actively mentors Master&apos;s, PhD and Post-Doc candidates across actuarial science, public policy
                and data analytics, guiding students from African universities and leading global institutions. His
                commitment to fostering the next generation of actuaries, policy experts and AI researchers reflects
                his enduring dedication to academic excellence and societal advancement.
              </p>
            </div>

            <h2 className={styles.subheading}>Awards &amp; Qualifications</h2>
            <ul role="list" className={styles.credentials}>
              {credentials.map((c) => (
                <li key={c.title}>
                  <span className={styles.credIcon}>
                    {c.kind === "award" ? <FaAward aria-hidden /> : <FaGraduationCap aria-hidden />}
                  </span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className={styles.subheading}>Connect</h2>
            <SocialLinks />
            <p className={styles.ctaRow}>
              <Link href="/contact" className="btn">
                Get in touch
              </Link>
              <Link href="/publications" className="btn btn--ghost">
                Read my work
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
