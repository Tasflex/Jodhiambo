export type Plan = {
  id: string;
  name: string;
  /** Days of All-Access granted per purchase. Buying again extends from the current expiry. */
  accessDays: number;
  /** PLACEHOLDER price in Kenyan shillings; replace before launch. */
  priceKes: number;
  blurb: string;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "monthly",
    name: "1 Month",
    accessDays: 30,
    priceKes: 1500,
    blurb: "Short revision sprint before an exam.",
  },
  {
    id: "quarterly",
    name: "3 Months",
    accessDays: 90,
    priceKes: 4000,
    blurb: "A full semester of study.",
    featured: true,
  },
  {
    id: "annual",
    name: "12 Months",
    accessDays: 365,
    priceKes: 12000,
    blurb: "Best value for a full year of exams.",
  },
];

export const planFeatures = [
  "View every course's materials while your pass is active",
  "New materials added during your pass are included",
  "Read online on phone, tablet or computer",
  "Pay with M-Pesa or card via Paystack",
];
