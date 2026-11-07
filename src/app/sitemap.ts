import type { MetadataRoute } from "next";
import { courses } from "@/data/courses";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/expertise",
    "/publications/research",
    "/publications/books",
    "/publications/articles",
    "/courses",
    "/pricing",
    "/gallery",
    "/contact",
  ];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...courses.map((c) => ({ url: `${site.url}/courses/${c.slug}` })),
  ];
}
