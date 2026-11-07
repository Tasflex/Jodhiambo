import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getCourses } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    "",
    "/about",
    "/expertise",
    "/publications",
    "/publications/research",
    "/publications/books",
    "/publications/articles",
    "/courses",
    "/pricing",
    "/gallery",
    "/contact",
  ];
  const courses = await getCourses();
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...courses.map((c) => ({ url: `${site.url}/courses/${c.slug}` })),
  ];
}
