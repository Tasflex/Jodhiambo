import type { Metadata } from "next";
import Link from "next/link";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { PageHeader } from "@/components/ui/headings";
import { getCourses, getPlans } from "@/lib/content";
import { formatKes } from "@/lib/format";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "E-learning materials in actuarial mathematics, risk, financial economics, stochastic processes, machine learning and research methods.",
};

export default async function CoursesPage() {
  const [courses, plans] = await Promise.all([getCourses(), getPlans()]);
  const cheapestPass = plans.length ? Math.min(...plans.map((p) => p.priceKes)) : null;

  return (
    <>
      <PageHeader
        eyebrow="E-learning"
        title="Courses & Learning Materials"
        intro="Study materials prepared by Dr. Odhiambo for actuarial, finance and data science students and professionals. Read online on any device."
      >
        {cheapestPass !== null && (
          <p data-reveal style={{ "--reveal-i": 2 } as React.CSSProperties}>
            Want everything?{" "}
            <Link href="/pricing" style={{ color: "#fff" }}>
              All-Access passes
            </Link>{" "}
            start at {formatKes(cheapestPass)}.
          </p>
        )}
      </PageHeader>
      <section className="section">
        <div className="container">
          <CourseCatalog courses={courses} />
        </div>
      </section>
    </>
  );
}
