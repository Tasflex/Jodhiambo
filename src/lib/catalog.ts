import { COURSE_ACCESS_DAYS, courses } from "@/data/courses";
import { plans } from "@/data/plans";

/**
 * Everything that can go in the cart. IDs are namespaced so courses and plans
 * can share one cart: "course:<slug>" or "plan:<id>".
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
};

export const courseProductId = (slug: string) => `course:${slug}`;
export const planProductId = (id: string) => `plan:${id}`;

const products = new Map<string, Product>([
  ...courses.map((c): [string, Product] => [
    courseProductId(c.slug),
    {
      id: courseProductId(c.slug),
      kind: "course",
      title: c.title,
      priceKes: c.priceKes,
      scope: `course:${c.slug}`,
      accessDays: COURSE_ACCESS_DAYS,
      href: `/courses/${c.slug}`,
    },
  ]),
  ...plans.map((p): [string, Product] => [
    planProductId(p.id),
    {
      id: planProductId(p.id),
      kind: "plan",
      title: `All-Access Pass: ${p.name}`,
      priceKes: p.priceKes,
      scope: "all",
      accessDays: p.accessDays,
      href: "/pricing",
    },
  ]),
]);

export function getProduct(id: string): Product | undefined {
  return products.get(id);
}

/** Human-readable access period, e.g. "30 days", "3 months", "12 months". */
export function describeAccess(days: number): string {
  if (days % 365 === 0) return days === 365 ? "12 months" : `${days / 365} years`;
  if (days % 30 === 0 && days >= 60) return `${days / 30} months`;
  if (days === 30) return "1 month";
  return `${days} days`;
}
