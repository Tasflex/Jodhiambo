import type { ReactNode } from "react";

/** Coloured banner at the top of inner pages; holds the page's single <h1>. */
export function PageHeader({ title, intro }: { title: string; intro?: ReactNode }) {
  return (
    <section className="page-header">
      <div className="container">
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </section>
  );
}

export function SectionTitle({ title, intro, id }: { title: string; intro?: ReactNode; id?: string }) {
  return (
    <div className="section-title">
      <h2 id={id}>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}
