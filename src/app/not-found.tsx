import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/ui/headings";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHeader eyebrow="404" title="Page not found" intro="The page you were looking for doesn't exist or has moved." />
        <section className="section">
          <div className="container text-center">
            <Link href="/" className="btn">
              Go to the home page
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
