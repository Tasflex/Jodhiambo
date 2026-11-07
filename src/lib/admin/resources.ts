import { courseCategories, courseLevels, galleryCategories } from "@/data/taxonomy";
import { courseIcons } from "@/lib/course-icons";

/**
 * Admin-editable content types. Each definition drives the list table, the
 * edit form and server-side validation (see lib/admin/validate.ts), so adding a
 * field is a one-line change here plus a database column.
 *
 * Field `name`s are the database column names.
 */

export type FieldType = "text" | "textarea" | "number" | "date" | "select" | "checkbox" | "lines" | "image" | "url" | "slug";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Empty input is stored as NULL instead of "". */
  nullable?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  placeholder?: string;
  min?: number;
  /** Only editable when creating (identifiers that other data refers to). */
  createOnly?: boolean;
  /** Spans the full form width. */
  wide?: boolean;
};

export type ColumnDef = {
  name: string;
  label: string;
  format?: "price" | "date" | "bool" | "image" | "count";
};

export type ResourceDef = {
  key: string;
  table: string;
  title: string;
  singular: string;
  description: string;
  idColumn: string;
  /** "generated": database UUID; "field": taken from a create-only field (slug). */
  idSource: "generated" | "field";
  fields: FieldDef[];
  columns: ColumnDef[];
  order: { column: string; ascending: boolean }[];
};

const iconOptions = Object.entries(courseIcons).map(([value, { label }]) => ({ value, label }));

export const resources: ResourceDef[] = [
  {
    key: "courses",
    table: "courses",
    title: "Courses",
    singular: "course",
    description: "The store catalogue. Open a course to upload its PDF materials.",
    idColumn: "slug",
    idSource: "field",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      {
        name: "slug",
        label: "URL slug",
        type: "slug",
        required: true,
        createOnly: true,
        help: "Used in the course address (/courses/your-slug). Cannot be changed later.",
      },
      { name: "category", label: "Category", type: "select", required: true, options: courseCategories },
      { name: "level", label: "Level", type: "select", required: true, options: courseLevels.map((l) => ({ value: l, label: l })) },
      { name: "icon", label: "Icon", type: "select", required: true, options: iconOptions },
      { name: "price_kes", label: "Price (KES)", type: "number", required: true, min: 0 },
      { name: "access_days", label: "Access period (days)", type: "number", required: true, min: 1, help: "365 = 12 months" },
      { name: "summary", label: "Card summary (one sentence)", type: "textarea", required: true, wide: true },
      { name: "overview", label: "Overview paragraph", type: "textarea", wide: true },
      { name: "outcomes", label: "What students will learn", type: "lines", wide: true, help: "One per line." },
      { name: "topics", label: "Course topics", type: "lines", wide: true, help: "One per line, in teaching order." },
      { name: "audience", label: "Who it is for", type: "lines", wide: true, help: "One per line." },
      { name: "prerequisites", label: "Before you start", type: "textarea", wide: true },
      { name: "sort_order", label: "Display order", type: "number", min: 0, help: "Lower numbers appear first." },
      { name: "published", label: "Published (visible and on sale)", type: "checkbox" },
    ],
    columns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "price_kes", label: "Price", format: "price" },
      { name: "published", label: "Published", format: "bool" },
    ],
    order: [
      { column: "sort_order", ascending: true },
      { column: "title", ascending: true },
    ],
  },
  {
    key: "plans",
    table: "plans",
    title: "All-Access plans",
    singular: "plan",
    description: "Passes that unlock every course for a fixed period.",
    idColumn: "id",
    idSource: "field",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "3 Months" },
      { name: "id", label: "Plan ID", type: "slug", required: true, createOnly: true, help: "e.g. quarterly. Cannot be changed later." },
      { name: "price_kes", label: "Price (KES)", type: "number", required: true, min: 1 },
      { name: "access_days", label: "Access period (days)", type: "number", required: true, min: 1 },
      { name: "blurb", label: "Short description", type: "text", wide: true },
      { name: "sort_order", label: "Display order", type: "number", min: 0 },
      { name: "featured", label: "Highlight as most popular", type: "checkbox" },
      { name: "active", label: "Active (on sale)", type: "checkbox" },
    ],
    columns: [
      { name: "name", label: "Name" },
      { name: "price_kes", label: "Price", format: "price" },
      { name: "access_days", label: "Days" },
      { name: "active", label: "Active", format: "bool" },
    ],
    order: [{ column: "sort_order", ascending: true }],
  },
  {
    key: "research",
    table: "research_papers",
    title: "Research papers",
    singular: "paper",
    description: "Peer-reviewed publications, shown by year.",
    idColumn: "id",
    idSource: "generated",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "venue", label: "Journal / venue", type: "text", required: true },
      { name: "year", label: "Year", type: "number", required: true, min: 1950 },
      { name: "doi", label: "DOI", type: "text", nullable: true, placeholder: "10.1000/xyz123", help: "Without https://doi.org/" },
      { name: "tags", label: "Topics", type: "lines", help: "One per line." },
    ],
    columns: [
      { name: "year", label: "Year" },
      { name: "title", label: "Title" },
      { name: "venue", label: "Venue" },
    ],
    order: [
      { column: "year", ascending: false },
      { column: "created_at", ascending: true },
    ],
  },
  {
    key: "articles",
    table: "media_articles",
    title: "Media articles",
    singular: "article",
    description: "Opinion columns and commentary in the press.",
    idColumn: "id",
    idSource: "generated",
    fields: [
      { name: "title", label: "Headline", type: "text", required: true, wide: true },
      { name: "outlet", label: "Outlet", type: "text", required: true, placeholder: "Business Daily Africa" },
      { name: "published_on", label: "Date published", type: "date", required: true },
      { name: "url", label: "Link", type: "url", required: true, wide: true },
    ],
    columns: [
      { name: "published_on", label: "Date", format: "date" },
      { name: "title", label: "Headline" },
      { name: "outlet", label: "Outlet" },
    ],
    order: [{ column: "published_on", ascending: false }],
  },
  {
    key: "books",
    table: "books",
    title: "Books",
    singular: "book",
    description: "Books shown in Publications, linking to Amazon.",
    idColumn: "id",
    idSource: "generated",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "image_url", label: "Cover image", type: "image", required: true, wide: true },
      { name: "amazon_url", label: "Amazon link", type: "url", required: true, wide: true },
      { name: "sort_order", label: "Display order", type: "number", min: 0 },
    ],
    columns: [
      { name: "image_url", label: "", format: "image" },
      { name: "title", label: "Title" },
    ],
    order: [{ column: "sort_order", ascending: true }],
  },
  {
    key: "gallery",
    table: "gallery_items",
    title: "Gallery",
    singular: "photo",
    description: "Photos on the Gallery page.",
    idColumn: "id",
    idSource: "generated",
    fields: [
      { name: "image_url", label: "Photo", type: "image", required: true, wide: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "select", required: true, options: galleryCategories },
      { name: "alt", label: "Description for screen readers", type: "text", required: true, wide: true, help: "Describe what is in the photo." },
      { name: "caption", label: "Caption", type: "textarea", wide: true },
      { name: "sort_order", label: "Display order", type: "number", min: 0 },
    ],
    columns: [
      { name: "image_url", label: "", format: "image" },
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
    ],
    order: [{ column: "sort_order", ascending: true }],
  },
];

export const getResource = (key: string) => resources.find((r) => r.key === key);
