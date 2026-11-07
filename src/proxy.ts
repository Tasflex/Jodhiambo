import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session cookie on each request so Server Components
 * always see a valid session. (Next.js 16 renamed middleware.ts to proxy.ts.)
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // If Supabase falls back to the Site URL (e.g. the redirect URL isn't allow-listed),
  // the sign-in code lands on the home page. Send it on to the callback that handles it.
  if (pathname === "/") {
    if (searchParams.has("code")) {
      const callback = request.nextUrl.clone();
      callback.pathname = "/auth/callback";
      return NextResponse.redirect(callback);
    }
    // An expired or already-used link: show the sign-in page with a clear message.
    if (searchParams.has("error_code")) {
      const signIn = new URL("/sign-in", request.nextUrl);
      signIn.searchParams.set("error", "link");
      return NextResponse.redirect(signIn);
    }
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(toSet, headers) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  // Do not run code between createServerClient and getUser: it validates and refreshes the session.
  await supabase.auth.getUser();
  return response;
}

export const config = {
  // Only routes that need a session; public pages stay static and fast.
  matcher: ["/", "/account/:path*", "/learn/:path*", "/checkout/:path*", "/api/checkout", "/api/materials/:path*"],
};
