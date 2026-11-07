import type { Course, Plan } from "@/lib/types";

/**
 * Everything that can go in the cart. IDs are namespaced so courses and plans
 * can share one cart: "course:<slug>" or "plan:<id>". Products are plain data,
 * so server pages can pass them to client components.
 */
export type Product = {
  id: string;
  kind: "course" | "plan";
  title: string;
  priceKes: number;
  /** Entitlement scope granted on payment: "all" or "course:<slug>". */
  scope: string;
  accessDays: number;
  href: string;
  /** Course icon key (courses only). */
  icon?: string;
};

export const courseProductId = (slug: string) => `course:${slug}`;
export const planProductId = (id: string) => `plan:${id}`;

export function buildProducts(courses: Course[], plans: Plan[]): Product[] {
  return [
    ...courses
      .filter((c) => c.published)
      .map((c) => ({
        id: courseProductId(c.slug),
        kind: "course" as const,
        title: c.title,
        priceKes: c.priceKes,
        scope: `course:${c.slug}`,
        accessDays: c.accessDays,
        href: `/courses/${c.slug}`,
        icon: c.icon,
      })),
    ...plans.map((p) => ({
      id: planProductId(p.id),
      kind: "plan" as const,
      title: `All-Access Pass: ${p.name}`,
      priceKes: p.priceKes,
      scope: "all",
      accessDays: p.accessDays,
      href: "/pricing",
    })),
  ];
}

/** Human-readable access period, e.g. "1 month", "3 months", "12 months". */
export function describeAccess(days: number): string {
  if (days % 365 === 0) return days === 365 ? "12 months" : `${days / 365} years`;
  if (days === 30) return "1 month";
  if (days % 30 === 0 && days >= 60) return `${days / 30} months`;
  return `${days} days`;
}
