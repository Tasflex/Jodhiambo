import type { CourseCategory, CourseLevel, GalleryCategory } from "@/lib/types";

/** Fixed lists used by the site and the admin forms (not editable content). */

export const courseCategories: { value: CourseCategory; label: string }[] = [
  { value: "actuarial", label: "Actuarial Science" },
  { value: "finance", label: "Finance & Economics" },
  { value: "data", label: "Statistics & Data" },
];

export const categoryLabel = (c: CourseCategory) => courseCategories.find((x) => x.value === c)?.label ?? c;

export const courseLevels: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"];

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "teaching", label: "Teaching" },
  { value: "presentations", label: "Presentations" },
  { value: "awards", label: "Awards" },
  { value: "events", label: "Events" },
];

export const planFeatures = [
  "View every course's materials while your pass is active",
  "New materials added during your pass are included",
  "Read online on phone, tablet or computer",
  "Pay with M-Pesa or card via Paystack",
];
