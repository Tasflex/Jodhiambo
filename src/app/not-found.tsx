import Link from "next/link";
import { PageHeader } from "@/components/ui/headings";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" intro="The page you were looking for doesn't exist or has moved." />
      <section className="section">
        <div className="container text-center">
          <Link href="/" className="btn">
            Go to the home page
          </Link>
        </div>
      </section>
    </>
  );
}
