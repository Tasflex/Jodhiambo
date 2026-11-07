import "server-only";

import { courses } from "@/data/courses";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Entitlement = { scope: string; starts_at: string; expires_at: string };

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

/** Course slugs the user can open right now, with when access ends. */
export function accessibleCourses(entitlements: Entitlement[]) {
  const scopes = summarise(entitlements);
  const allAccess = scopes.get("all");
  return courses
    .map((course) => {
      const own = scopes.get(`course:${course.slug}`);
      const expiries = [allAccess?.expires_at, own?.expires_at].filter(Boolean) as string[];
      return { course, expiresAt: expiries.sort().at(-1) };
    })
    .filter((c): c is { course: (typeof courses)[number]; expiresAt: string } => Boolean(c.expiresAt));
}

export function canAccessCourse(entitlements: Entitlement[], slug: string): boolean {
  return entitlements.some((e) => e.scope === "all" || e.scope === `course:${slug}`);
}

export type MaterialRow = { id: string; course_slug: string; title: string; storage_path: string; sort_order: number };
