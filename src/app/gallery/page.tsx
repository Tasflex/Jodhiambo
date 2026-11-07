import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHeader } from "@/components/ui/headings";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Teaching, keynote presentations, policy panels, awards and events.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader title="Gallery" intro="Teaching, presentations, awards and events." />
      <section className="section">
        <div className="container">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
