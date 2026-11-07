import type { Metadata } from "next";
import { ArticleList } from "@/components/publications/ArticleList";
import { getArticles, outletsOf } from "@/lib/content";

export const metadata: Metadata = {
  title: "Media Articles",
  description:
    "Opinion columns in Business Daily Africa, Daily Nation, Citizen Digital and KIPPRA on education, the economy and AI.",
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <>
      <h2 className="visually-hidden">Media articles</h2>
      <ArticleList articles={articles} outlets={outletsOf(articles)} />
    </>
  );
}
