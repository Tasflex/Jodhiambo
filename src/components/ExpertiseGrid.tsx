import type { ExpertiseArea } from "@/data/expertise";

export function ExpertiseGrid({ items }: { items: ExpertiseArea[] }) {
  return (
    <ul role="list" className="grid">
      {items.map(({ icon: Icon, title, description }, i) => (
        <li
          key={title}
          className="card card--hover card--center"
          data-reveal
          style={{ "--reveal-i": i % 6 } as React.CSSProperties}
        >
          <span className="icon-tile">
            <Icon aria-hidden />
          </span>
          <h3>{title}</h3>
          <p>{description}</p>
        </li>
      ))}
    </ul>
  );
}
