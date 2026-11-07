import type { Metadata } from "next";
import { ResearchExplorer } from "@/components/publications/ResearchExplorer";

export const metadata: Metadata = {
  title: "Research Papers",
  description: "Peer-reviewed research on mortality modelling, quantitative finance, AI, energy and health policy.",
};

export default function ResearchPage() {
  return (
    <>
      <h2 className="visually-hidden">Research papers</h2>
      <ResearchExplorer />
    </>
  );
}
