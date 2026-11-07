import { PublicationsNav } from "@/components/publications/PublicationsNav";
import { PageHeader } from "@/components/ui/headings";
import { mediaArticles } from "@/data/articles";
import { books } from "@/data/books";
import { researchPapers } from "@/data/research";

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Research, books & commentary"
        intro="Peer-reviewed research on actuarial science, AI and public policy, alongside books and regular opinion columns in Kenya's leading outlets."
      />
      <PublicationsNav
        counts={{ research: researchPapers.length, books: books.length, articles: mediaArticles.length }}
      />
      <section className="section section--tight">
        <div className="container">{children}</div>
      </section>
    </>
  );
}
