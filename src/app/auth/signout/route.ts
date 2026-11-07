import { NextResponse } from "next/server";
import { site } from "@/data/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  // Use the public site URL: behind nginx the request origin is the internal address.
  return NextResponse.redirect(new URL("/", site.url), { status: 303 });
}
