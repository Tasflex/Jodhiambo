import type { ExpertiseArea } from "@/data/expertise";

export function ExpertiseGrid({ items }: { items: ExpertiseArea[] }) {
  return (
    <ul role="list" className="grid">
      {items.map(({ icon: Icon, title, description }) => (
        <li key={title} className="card card--hover card--center">
          <span className="card-icon">
            <Icon aria-hidden />
          </span>
          <h3>{title}</h3>
          <p>{description}</p>
        </li>
      ))}
    </ul>
  );
}
