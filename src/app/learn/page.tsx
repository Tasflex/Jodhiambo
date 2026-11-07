import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/headings";
import { accessibleCourses, getActiveEntitlements } from "@/lib/access";
import { getUser } from "@/lib/supabase/server";
import styles from "./learn.module.css";

export const metadata: Metadata = {
  title: "My Learning",
  robots: { index: false },
};

const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Africa/Nairobi" });

export default async function LearnPage() {
  if (!(await getUser())) redirect("/sign-in?next=/learn");
  const available = accessibleCourses(await getActiveEntitlements());

  return (
    <>
      <PageHeader eyebrow="Student area" title="My Learning" intro="Your courses. Materials open in the online reader." />
      <section className="section">
        <div className="container">
          {available.length === 0 ? (
            <div className="card card--center" style={{ maxWidth: 560, margin: "0 auto" }}>
              <h2>No active courses</h2>
              <p style={{ margin: "8px 0 20px" }}>Get an All-Access pass or buy a course to start learning.</p>
              <Link href="/pricing" className="btn">
                See passes
              </Link>
            </div>
          ) : (
            <ul role="list" className="grid">
              {available.map(({ course, expiresAt }) => {
                const Icon = course.icon;
                return (
                  <li key={course.slug} className={`card card--hover ${styles.course}`}>
                    <span className="icon-tile">
                      <Icon aria-hidden />
                    </span>
                    <h2 className={styles.courseTitle}>
                      <Link href={`/learn/${course.slug}`}>{course.title}</Link>
                    </h2>
                    <p>Access until {date.format(new Date(expiresAt))}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
