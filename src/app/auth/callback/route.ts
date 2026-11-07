import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { site } from "@/data/site";
import { NEXT_COOKIE, safeNextPath } from "@/lib/safe-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Landing point for the emailed sign-in link: exchanges the code for a session.
 * Redirects use the configured site URL: behind nginx the request's own origin
 * is the internal address (127.0.0.1:3200), not the public domain.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const cookieStore = await cookies();
  const remembered = cookieStore.get(NEXT_COOKIE)?.value;
  const next = safeNextPath(searchParams.get("next") ?? (remembered ? decodeURIComponent(remembered) : null));

  let response: NextResponse | null = null;
  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) response = NextResponse.redirect(new URL(next, site.url));
  }

  if (!response) {
    const failed = new URL("/sign-in", site.url);
    failed.searchParams.set("error", "link");
    failed.searchParams.set("next", next);
    response = NextResponse.redirect(failed);
  }

  response.cookies.delete(NEXT_COOKIE);
  return response;
}
