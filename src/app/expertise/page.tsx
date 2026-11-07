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
        title="Expertise"
        intro="Actuarial science, data analytics and public policy, from rigorous modelling to policy that works on the ground."
      />

      <section className="section" aria-labelledby="core-title">
        <div className="container">
          <SectionTitle id="core-title" title="Core Expertise" />
          <ExpertiseGrid items={coreExpertise} />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="policy-title">
        <div className="container">
          <SectionTitle id="policy-title" title="Public Policy Expertise" />
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
