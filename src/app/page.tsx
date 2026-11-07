import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaArrowUpRightFromSquare, FaCircleCheck, FaCrown } from "react-icons/fa6";
import { ExpertiseGrid } from "@/components/ExpertiseGrid";
import { CourseCard } from "@/components/courses/CourseCard";
import { Hero } from "@/components/home/Hero";
import { SectionTitle } from "@/components/ui/headings";
import { mediaArticles } from "@/data/articles";
import { books } from "@/data/books";
import { courses } from "@/data/courses";
import { coreExpertise } from "@/data/expertise";
import { planFeatures, plans } from "@/data/plans";
import { researchPapers } from "@/data/research";
import { formatDate, formatKes } from "@/lib/format";
import styles from "./home.module.css";

const stats = [
  { value: researchPapers.length, label: "Research papers" },
  { value: mediaArticles.length, label: "Opinion columns" },
  { value: courses.length, label: "Courses" },
  { value: books.length, label: "Books" },
];

export default function HomePage() {
  const featuredCourses = courses.slice(0, 3);
  const latestArticles = mediaArticles.slice(0, 3);
  const cheapestPass = Math.min(...plans.map((p) => p.priceKes));

  return (
    <>
      <Hero />

      <div className="container">
        <ul role="list" className={styles.stats}>
          {stats.map((s, i) => (
            <li key={s.label} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <section className="section" aria-labelledby="intro-title">
        <div className={`container ${styles.intro}`}>
          <div className={styles.introImg} data-reveal="zoom">
            <Image
              src="/img/gallery/lecture-session.jpg"
              alt="Dr. Odhiambo lecturing a university class"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
          <div data-reveal>
            <span className="eyebrow">About</span>
            <h2 id="intro-title" className={styles.introTitle}>
              Actuarial data scientist &amp; public policy expert
            </h2>
            <div className="prose">
              <p>
                Dr. Joab Onyango Odhiambo is a Chartered Financial and Actuarial Analyst with a BSc, MSc and PhD in
                Actuarial Science and a Postdoctoral qualification in Public Policy Research and Analysis.
              </p>
              <p>
                His work spans actuarial modelling, artificial intelligence and evidence-based policy design for
                Sub-Saharan Africa, and he mentors Master&apos;s, PhD and Post-Doc candidates across the continent and
                beyond.
              </p>
            </div>
            <Link href="/about" className={`link-arrow ${styles.more}`}>
              More about Dr. Odhiambo <FaArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="courses-title">
        <div className="container">
          <SectionTitle
            id="courses-title"
            eyebrow="E-learning"
            title="Featured courses"
            intro="Study materials in actuarial science, finance and data analytics, read online on any device."
          />
          <div className="grid" style={{ "--min": "320px" } as React.CSSProperties}>
            {featuredCourses.map((course, i) => (
              <CourseCard key={course.slug} course={course} index={i} />
            ))}
          </div>
          <p className="text-center mt-lg">
            <Link href="/courses" className="btn btn--secondary">
              Browse all {courses.length} courses <FaArrowRight aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="pass-title">
        <div className="container">
          <div className={styles.pass} data-reveal="zoom">
            <div>
              <span className={styles.passIcon}>
                <FaCrown aria-hidden />
              </span>
              <h2 id="pass-title">One pass. Every course.</h2>
              <p>
                Get All-Access from <strong>{formatKes(cheapestPass)}</strong> and study any subject for as long as
                your pass is active. No auto-renewal.
              </p>
            </div>
            <ul role="list" className={styles.passList}>
              {planFeatures.map((f) => (
                <li key={f}>
                  <FaCircleCheck aria-hidden /> {f}
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="btn">
              See passes <FaArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="expertise-title">
        <div className="container">
          <SectionTitle
            id="expertise-title"
            eyebrow="Expertise"
            title="Where rigour meets real-world impact"
            intro="From insurance mathematics to national policy, the same commitment to evidence."
          />
          <ExpertiseGrid items={coreExpertise} />
          <p className="text-center mt-lg">
            <Link href="/expertise" className="link-arrow">
              Public policy expertise <FaArrowRight aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="articles-title">
        <div className="container">
          <div className={styles.sectionHead}>
            <SectionTitle
              id="articles-title"
              eyebrow="Commentary"
              title="Latest in the media"
              align="left"
            />
            <Link href="/publications/articles" className="btn btn--ghost" data-reveal>
              All articles <FaArrowRight aria-hidden />
            </Link>
          </div>
          <ul role="list" className="grid">
            {latestArticles.map((a, i) => (
              <li
                key={a.url}
                className={`card card--hover ${styles.article}`}
                data-reveal
                style={{ "--reveal-i": i } as React.CSSProperties}
              >
                <p className={styles.meta}>
                  <span>{a.outlet}</span>
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                </p>
                <h3>{a.title}</h3>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  Read article <FaArrowUpRightFromSquare aria-hidden />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container" data-reveal>
          <span className="eyebrow">Work together</span>
          <h2>Speaking, training or a research collaboration?</h2>
          <p>Keynotes, executive training, consulting and postgraduate supervision.</p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="btn">
              Get in touch
            </Link>
            <Link href="/expertise" className="btn btn--light">
              View expertise
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
