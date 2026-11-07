import type { Metadata } from "next";
import { ResearchExplorer } from "@/components/publications/ResearchExplorer";
import { getResearch } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research Papers",
  description: "Peer-reviewed research on mortality modelling, quantitative finance, AI, energy and health policy.",
};

export default async function ResearchPage() {
  const papers = await getResearch();
  return (
    <>
      <h2 className="visually-hidden">Research papers</h2>
      <ResearchExplorer papers={papers} />
    </>
  );
}
