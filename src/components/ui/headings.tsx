import type { ReactNode } from "react";

/** Dark banner at the top of inner pages; holds the page's single <h1>. */
export function PageHeader({
  title,
  intro,
  eyebrow,
  children,
}: {
  title: string;
  intro?: ReactNode;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-header">
      <div className="container">
        {eyebrow && (
          <span className="eyebrow" data-reveal="fade">
            {eyebrow}
          </span>
        )}
        <h1 data-reveal>{title}</h1>
        {intro && (
          <p data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionTitle({
  title,
  intro,
  eyebrow,
  id,
  align = "center",
}: {
  title: string;
  intro?: ReactNode;
  eyebrow?: string;
  id?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`section-title ${align === "left" ? "section-title--left" : ""}`} data-reveal>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 id={id}>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}
