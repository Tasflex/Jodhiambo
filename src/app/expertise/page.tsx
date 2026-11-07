import type { Metadata } from "next";
import Link from "next/link";
import { ExpertiseGrid } from "@/components/ExpertiseGrid";
import { PageHeader, SectionTitle } from "@/components/ui/headings";
import { coreExpertise, policyExpertise } from "@/data/expertise";

export const metadata: Metadata = {
  title: "Expertise",
  description: "Actuarial science, education and public policy expertise, monitoring & evaluation, and strategic consulting.",
};

export default function ExpertisePage() {
  return (
    <>
      <PageHeader
        eyebrow="Expertise"
        title="From rigorous models to policy that works"
        intro="Actuarial science, data analytics and public policy expertise for institutions, governments and learners."
      />

      <section className="section" aria-labelledby="core-title">
        <div className="container">
          <SectionTitle id="core-title" eyebrow="Core" title="Core expertise" />
          <ExpertiseGrid items={coreExpertise} />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="policy-title">
        <div className="container">
          <SectionTitle id="policy-title" eyebrow="Policy" title="Public policy expertise" />
          <ExpertiseGrid items={policyExpertise} />
          <p className="text-center mt-lg">
            <Link href="/contact" className="btn">
              Discuss a project
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
