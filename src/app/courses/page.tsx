import type { Metadata } from "next";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { PageHeader } from "@/components/ui/headings";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "E-learning materials in actuarial mathematics, risk, financial economics, stochastic processes, machine learning and research methods.",
};

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        title="Courses & Learning Materials"
        intro="Specialised study materials prepared by Dr. Odhiambo for actuarial, finance and data science students and professionals."
      />
      <section className="section">
        <div className="container">
          <CourseCatalog />
        </div>
      </section>
    </>
  );
}
