import "server-only";

import type { User } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin/auth";
import { toCourse, type CourseRow } from "@/lib/content";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Course } from "@/lib/types";

export type Entitlement = { scope: string; starts_at: string; expires_at: string };

export type MaterialRow = {
  id: string;
  course_slug: string;
  title: string;
  storage_path: string;
  sort_order: number;
  size_bytes: number | null;
};

/** The signed-in user's passes that have not yet expired (RLS limits rows to their own). */
export async function getActiveEntitlements(): Promise<Entitlement[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entitlements")
    .select("scope, starts_at, expires_at")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Latest expiry per scope, so stacked purchases show as one date. */
export function summarise(entitlements: Entitlement[]) {
  const byScope = new Map<string, Entitlement>();
  for (const e of entitlements) {
    const current = byScope.get(e.scope);
    if (!current || e.expires_at > current.expires_at) byScope.set(e.scope, e);
  }
  return byScope;
}

/**
 * Every course, including unpublished ones: a student who paid keeps access
 * even if the course is later hidden from the catalogue.
 */
export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("courses")
    .select("*")
    .order("sort_order")
    .returns<CourseRow[]>();
  if (error) throw error;
  return (data ?? []).map(toCourse);
}

/** Course slugs the user can open right now, with when access ends (admins: everything). */
export function accessibleCourses(entitlements: Entitlement[], courses: Course[], user?: User | null) {
  if (isAdmin(user)) return courses.map((course) => ({ course, expiresAt: null as string | null }));
  const scopes = summarise(entitlements);
  const allAccess = scopes.get("all");
  return courses
    .map((course) => {
      const own = scopes.get(`course:${course.slug}`);
      const expiries = [allAccess?.expires_at, own?.expires_at].filter(Boolean) as string[];
      return { course, expiresAt: expiries.sort().at(-1) ?? null };
    })
    .filter((c) => c.expiresAt !== null);
}

export function canAccessCourse(entitlements: Entitlement[], slug: string, user?: User | null): boolean {
  return isAdmin(user) || entitlements.some((e) => e.scope === "all" || e.scope === `course:${slug}`);
}
