import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { ExpertiseGrid } from "@/components/ExpertiseGrid";
import { CourseCard } from "@/components/courses/CourseCard";
import { Hero } from "@/components/home/Hero";
import { SectionTitle } from "@/components/ui/headings";
import { mediaArticles } from "@/data/articles";
import { books } from "@/data/books";
import { courses } from "@/data/courses";
import { coreExpertise } from "@/data/expertise";
import { researchPapers } from "@/data/research";
import { formatDate } from "@/lib/format";
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

  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="intro-title">
        <div className={`container ${styles.intro}`}>
          <div className={styles.introImg}>
            <Image
              src="/img/about.jpg"
              alt="Dr. Joab Odhiambo"
              width={600}
              height={800}
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
          <div>
            <h2 id="intro-title" className={styles.introTitle}>
              Actuarial Data Scientist &amp; Public Policy Expert
            </h2>
            <div className="prose">
              <p>
                Dr. Joab Onyango Odhiambo is a scholar, educator and thought leader in actuarial science, artificial
                intelligence and public policy. A Chartered Financial and Actuarial Analyst with a BSc, MSc and PhD in
                Actuarial Science and a Postdoctoral qualification in Public Policy Research and Analysis, he brings
                extensive expertise in actuarial modelling, data science and evidence-based policy design for Sub-Saharan
                Africa.
              </p>
            </div>
            <ul role="list" className={styles.stats}>
              {stats.map((s) => (
                <li key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="link-arrow">
              More about Dr. Odhiambo <FaArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="courses-title">
        <div className="container">
          <SectionTitle
            id="courses-title"
            title="Featured Courses"
            intro="Self-paced learning materials in actuarial science, finance and data analytics."
          />
          <div className="grid">
            {featuredCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
          <p className="text-center mt-lg">
            <Link href="/courses" className="btn btn--secondary">
              See all {courses.length} courses
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="expertise-title">
        <div className="container">
          <SectionTitle id="expertise-title" title="Areas of Expertise" />
          <ExpertiseGrid items={coreExpertise} />
          <p className="text-center mt-lg">
            <Link href="/expertise" className="link-arrow">
              Public policy expertise <FaArrowRight aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="articles-title">
        <div className="container">
          <SectionTitle id="articles-title" title="Latest Commentary" />
          <ul role="list" className="grid">
            {latestArticles.map((a) => (
              <li key={a.url} className="card card--hover">
                <p className={styles.meta}>
                  {a.outlet} · <time dateTime={a.date}>{formatDate(a.date)}</time>
                </p>
                <h3>{a.title}</h3>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  Read article <FaArrowUpRightFromSquare aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-center mt-lg">
            <Link href="/publications/articles" className="link-arrow">
              All media articles <FaArrowRight aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2>Speaking, training or a research collaboration?</h2>
          <p>Get in touch about keynotes, executive training, consulting and postgraduate supervision.</p>
          <Link href="/contact" className="btn btn--outline-light">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
