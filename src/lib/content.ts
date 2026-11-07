import "server-only";

import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { buildProducts } from "@/lib/catalog";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";
import type { Book, Course, GalleryItem, MediaArticle, Plan, ResearchPaper } from "@/lib/types";

/**
 * Public content, read with the anon key (row level security returns only
 * published rows). No cookies are involved, so pages using these functions can
 * be pre-rendered; the admin dashboard refreshes them after every change.
 */
const publicDb = () =>
  createClient(supabaseUrl(), supabaseAnonKey(), { auth: { persistSession: false, autoRefreshToken: false } });

async function rows<T>(query: PromiseLike<{ data: T[] | null; error: { message: string } | null }>, what: string) {
  const { data, error } = await query;
  if (error) throw new Error(`Could not load ${what}: ${error.message}`);
  return data ?? [];
}

// ---------- Row shapes (snake_case, as stored) ----------
export type CourseRow = {
  slug: string;
  title: string;
  category: Course["category"];
  level: Course["level"];
  icon: string;
  summary: string;
  overview: string;
  outcomes: string[];
  topics: string[];
  prerequisites: string;
  audience: string[];
  price_kes: number;
  access_days: number;
  published: boolean;
  sort_order: number;
};

export type PlanRow = {
  id: string;
  name: string;
  access_days: number;
  price_kes: number;
  blurb: string;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

// ---------- Mappers ----------
export const toCourse = (r: CourseRow): Course => ({
  slug: r.slug,
  title: r.title,
  category: r.category,
  level: r.level,
  icon: r.icon,
  summary: r.summary,
  overview: r.overview,
  outcomes: r.outcomes,
  topics: r.topics,
  prerequisites: r.prerequisites,
  audience: r.audience,
  priceKes: r.price_kes,
  accessDays: r.access_days,
  published: r.published,
});

export const toPlan = (r: PlanRow): Plan => ({
  id: r.id,
  name: r.name,
  accessDays: r.access_days,
  priceKes: r.price_kes,
  blurb: r.blurb,
  featured: r.featured,
});

// ---------- Queries ----------
export const getCourses = cache(async (): Promise<Course[]> =>
  (
    await rows<CourseRow>(
      publicDb().from("courses").select("*").order("sort_order").order("title"),
      "courses",
    )
  ).map(toCourse),
);

export const getCourse = cache(async (slug: string): Promise<Course | undefined> =>
  (await getCourses()).find((c) => c.slug === slug),
);

export const getPlans = cache(async (): Promise<Plan[]> =>
  (await rows<PlanRow>(publicDb().from("plans").select("*").order("sort_order"), "plans")).map(toPlan),
);

export const getResearch = cache(async (): Promise<ResearchPaper[]> =>
  rows<ResearchPaper>(
    publicDb()
      .from("research_papers")
      .select("id, title, venue, year, doi, tags")
      .order("year", { ascending: false })
      .order("created_at"),
    "research papers",
  ),
);

export const getArticles = cache(async (): Promise<MediaArticle[]> =>
  (
    await rows<{ id: string; title: string; outlet: string; published_on: string; url: string }>(
      publicDb().from("media_articles").select("id, title, outlet, published_on, url").order("published_on", {
        ascending: false,
      }),
      "articles",
    )
  ).map((r) => ({ id: r.id, title: r.title, outlet: r.outlet, date: r.published_on, url: r.url })),
);

export const getBooks = cache(async (): Promise<Book[]> =>
  (
    await rows<{ id: string; title: string; image_url: string; amazon_url: string }>(
      publicDb().from("books").select("id, title, image_url, amazon_url").order("sort_order"),
      "books",
    )
  ).map((r) => ({ id: r.id, title: r.title, image: r.image_url, amazonUrl: r.amazon_url })),
);

export const getGallery = cache(async (): Promise<GalleryItem[]> =>
  (
    await rows<{
      id: string;
      image_url: string;
      alt: string;
      title: string;
      caption: string;
      category: GalleryItem["category"];
    }>(publicDb().from("gallery_items").select("id, image_url, alt, title, caption, category").order("sort_order"), "gallery")
  ).map((r) => ({ id: r.id, src: r.image_url, alt: r.alt, title: r.title, caption: r.caption, category: r.category })),
);

/** Distinct outlets, for the article filter. */
export const outletsOf = (articles: MediaArticle[]) => Array.from(new Set(articles.map((a) => a.outlet))).sort();

/** Purchasable products (published courses + active plans). */
export const getProducts = cache(async () => buildProducts(await getCourses(), await getPlans()));
