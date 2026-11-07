import { NextResponse } from "next/server";
import { canAccessCourse, getActiveEntitlements, type MaterialRow } from "@/lib/access";
import { createSupabaseAdminClient, MATERIALS_BUCKET } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { VIEWER_HEADER } from "@/lib/viewer";


const noStore = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};

/**
 * Streams a course PDF to the in-app reader, and only to a signed-in user with
 * active access to that course. The bucket is private: there is no public or
 * signed URL that could be shared.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (request.headers.get(VIEWER_HEADER) !== "1") {
    return new NextResponse("Materials can only be opened in the online reader.", { status: 403, headers: noStore });
  }

  const user = await getUser();
  if (!user) return new NextResponse("Sign in required", { status: 401, headers: noStore });

  const { id } = await params;
  const db = createSupabaseAdminClient();
  const { data: material } = await db
    .from("materials")
    .select("course_slug, storage_path")
    .eq("id", id)
    .maybeSingle<Pick<MaterialRow, "course_slug" | "storage_path">>();
  if (!material) return new NextResponse("Not found", { status: 404, headers: noStore });

  if (!canAccessCourse(await getActiveEntitlements(), material.course_slug)) {
    return new NextResponse("Your access to this course has ended.", { status: 403, headers: noStore });
  }

  const { data: file, error } = await db.storage.from(MATERIALS_BUCKET).download(material.storage_path);
  if (error || !file) {
    console.error("[materials] download failed", material.storage_path, error);
    return new NextResponse("File unavailable", { status: 500, headers: noStore });
  }

  return new NextResponse(file.stream(), {
    headers: {
      ...noStore,
      // Not application/pdf, so browsers never hand it to their own (downloadable) PDF viewer.
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "inline",
    },
  });
}
