/** App-facing content types (camelCase), mapped from database rows in lib/content.ts. */

export type CourseCategory = "actuarial" | "finance" | "data";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type Course = {
  slug: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  icon: string;
  summary: string;
  overview: string;
  outcomes: string[];
  topics: string[];
  prerequisites: string;
  audience: string[];
  priceKes: number;
  accessDays: number;
  published: boolean;
};

export type Plan = {
  id: string;
  name: string;
  accessDays: number;
  priceKes: number;
  blurb: string;
  featured: boolean;
};

export type ResearchPaper = {
  id: string;
  title: string;
  venue: string;
  year: number;
  doi: string | null;
  tags: string[];
};

export type MediaArticle = {
  id: string;
  title: string;
  outlet: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  url: string;
};

export type Book = {
  id: string;
  title: string;
  image: string;
  amazonUrl: string;
};

export type GalleryCategory = "teaching" | "presentations" | "awards" | "events";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: GalleryCategory;
};
