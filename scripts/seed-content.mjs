// Loads supabase/seed/content.json into the database (after 0002_admin_content.sql).
// Safe to re-run: each table is only filled when it is empty, so edits made in the
// admin dashboard are never overwritten.
//   node scripts/seed-content.mjs
import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd(), false);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const content = JSON.parse(readFileSync(new URL("../supabase/seed/content.json", import.meta.url), "utf8"));

// Parents before children (materials reference courses).
const order = ["courses", "plans", "research_papers", "media_articles", "books", "gallery_items"];

for (const table of order) {
  const rows = content[table];
  const { count, error: countError } = await db.from(table).select("*", { count: "exact", head: true });
  if (countError) throw new Error(`${table}: ${countError.message}`);
  if (count > 0) {
    console.log(`${table.padEnd(16)} already has ${count} rows, skipped`);
    continue;
  }
  const { error } = await db.from(table).insert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`${table.padEnd(16)} inserted ${rows.length}`);
}
