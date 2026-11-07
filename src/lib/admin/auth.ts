import "server-only";

import type { User } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

/**
 * Admins are the signed-in users whose email is listed in ADMIN_EMAILS
 * (comma-separated, server-only). Checked on every admin page and action.
 */
function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdmin(user: Pick<User, "email"> | null | undefined): boolean {
  return Boolean(user?.email && adminEmails().has(user.email.toLowerCase()));
}

/** For admin pages: sign-in if anonymous, a plain 404 for everyone who isn't an admin. */
export async function requireAdminPage(path = "/admin"): Promise<User> {
  const user = await getUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(path)}`);
  if (!isAdmin(user)) notFound();
  return user;
}

/** For server actions and route handlers. */
export async function assertAdmin(): Promise<User> {
  const user = await getUser();
  if (!user || !isAdmin(user)) throw new Error("Not authorised");
  return user;
}
