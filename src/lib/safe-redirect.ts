/** Only allow same-site relative paths, so a "next" value can't send users to another domain. */
export function safeNextPath(next: string | null | undefined, fallback = "/account"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

/**
 * Cookie that remembers where to go after the emailed sign-in link. Keeping it out
 * of the redirect URL means Supabase only has to allow-list ".../auth/callback" exactly.
 */
export const NEXT_COOKIE = "jo_next";
