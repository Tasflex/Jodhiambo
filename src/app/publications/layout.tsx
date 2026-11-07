import { PublicationsNav } from "@/components/publications/PublicationsNav";
import { PageHeader } from "@/components/ui/headings";

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Publications"
        intro="Peer-reviewed research, books and opinion columns on actuarial science, AI and public policy."
      />
      <section className="section">
        <div className="container">
          <PublicationsNav />
          {children}
        </div>
      </section>
    </>
  );
}
