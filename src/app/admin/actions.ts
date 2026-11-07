"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin/auth";
import { getResource } from "@/lib/admin/resources";
import { validateResource } from "@/lib/admin/validate";
import { fulfilOrder } from "@/lib/orders";
import { fieldErrors } from "@/lib/schemas";
import { createSupabaseAdminClient, MATERIALS_BUCKET } from "@/lib/supabase/admin";

const MEDIA_BUCKET = "site-media";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string> } | null;

/** Content is pre-rendered; refresh every public page after a change. */
function refreshSite() {
  revalidatePath("/", "layout");
}

const safeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";

// ---------------------------------------------------------------------------
// Generic content (courses, plans, research, articles, books, gallery)
// ---------------------------------------------------------------------------
export async function saveResource(_prev: FormState, form: FormData): Promise<FormState> {
  await assertAdmin();
  const def = getResource(String(form.get("_resource")));
  if (!def) return { ok: false, message: "Unknown content type." };

  const id = String(form.get("_id") ?? "");
  const mode = id ? "update" : "create";
  const parsed = validateResource(def, form, mode);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  const db = createSupabaseAdminClient();
  const values = { ...(parsed.data as Record<string, unknown>), updated_at: new Date().toISOString() };

  const { data, error } =
    mode === "create"
      ? await db.from(def.table).insert(values).select(def.idColumn).single<Record<string, string>>()
      : await db.from(def.table).update(values).eq(def.idColumn, id).select(def.idColumn).single<Record<string, string>>();

  if (error) {
    const duplicate = error.code === "23505";
    return {
      ok: false,
      message: duplicate ? `That ${def.idColumn === "slug" ? "slug" : "ID"} is already in use.` : `Could not save: ${error.message}`,
    };
  }

  refreshSite();
  const savedId = data[def.idColumn];
  // New courses go straight to their page so materials can be uploaded.
  if (mode === "create" && def.key === "courses") redirect(`/admin/courses/${savedId}?created=1`);
  redirect(`/admin/${def.key}?saved=1`);
}

export async function deleteResource(form: FormData) {
  await assertAdmin();
  const def = getResource(String(form.get("_resource")));
  const id = String(form.get("_id") ?? "");
  if (!def || !id) return;
  const db = createSupabaseAdminClient();

  if (def.key === "courses") {
    // Material rows cascade with the course; remove their files too.
    const { data: mats } = await db.from("materials").select("storage_path").eq("course_slug", id);
    const paths = (mats ?? []).map((m) => m.storage_path as string);
    if (paths.length) await db.storage.from(MATERIALS_BUCKET).remove(paths);
  }

  const { error } = await db.from(def.table).delete().eq(def.idColumn, id);
  if (error) throw new Error(`Could not delete: ${error.message}`);
  refreshSite();
  redirect(`/admin/${def.key}?deleted=1`);
}

// ---------------------------------------------------------------------------
// Uploads: the browser sends files straight to Supabase Storage using a
// one-time signed URL, so large PDFs never pass through this server.
// ---------------------------------------------------------------------------
export async function createImageUpload(folder: string, fileName: string) {
  await assertAdmin();
  const ext = (fileName.match(/\.(jpe?g|png|webp|avif)$/i)?.[1] ?? "jpg").toLowerCase();
  const path = `${safeName(folder)}/${Date.now()}-${safeName(fileName)}.${ext}`;
  const db = createSupabaseAdminClient();
  const { data, error } = await db.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  const publicUrl = db.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  return { bucket: MEDIA_BUCKET, path: data.path, token: data.token, publicUrl };
}

export async function createMaterialUpload(courseSlug: string, fileName: string) {
  await assertAdmin();
  const path = `${safeName(courseSlug)}/${Date.now()}-${safeName(fileName)}.pdf`;
  const { data, error } = await createSupabaseAdminClient().storage.from(MATERIALS_BUCKET).createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  return { bucket: MATERIALS_BUCKET, path: data.path, token: data.token };
}

// ---------------------------------------------------------------------------
// Course materials
// ---------------------------------------------------------------------------
export async function addMaterial(courseSlug: string, title: string, storagePath: string, sizeBytes: number) {
  await assertAdmin();
  const db = createSupabaseAdminClient();
  const { data: last } = await db
    .from("materials")
    .select("sort_order")
    .eq("course_slug", courseSlug)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();
  const { error } = await db.from("materials").insert({
    course_slug: courseSlug,
    title: title.trim().slice(0, 200) || "Untitled",
    storage_path: storagePath,
    size_bytes: sizeBytes,
    sort_order: (last?.sort_order ?? -1) + 1,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseSlug}`);
}

export async function renameMaterial(id: string, title: string) {
  await assertAdmin();
  const clean = title.trim().slice(0, 200);
  if (!clean) return;
  const { error } = await createSupabaseAdminClient().from("materials").update({ title: clean }).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Persists a new order for a course's materials (ids in display order). */
export async function reorderMaterials(courseSlug: string, ids: string[]) {
  await assertAdmin();
  const db = createSupabaseAdminClient();
  await Promise.all(
    ids.map((id, i) => db.from("materials").update({ sort_order: i }).eq("id", id).eq("course_slug", courseSlug)),
  );
  revalidatePath(`/admin/courses/${courseSlug}`);
}

export async function deleteMaterial(id: string) {
  await assertAdmin();
  const db = createSupabaseAdminClient();
  const { data } = await db.from("materials").select("storage_path, course_slug").eq("id", id).maybeSingle();
  if (!data) return;
  await db.storage.from(MATERIALS_BUCKET).remove([data.storage_path as string]);
  const { error } = await db.from("materials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${data.course_slug}`);
}

// ---------------------------------------------------------------------------
// Students and orders
// ---------------------------------------------------------------------------
export async function grantAccess(_prev: FormState, form: FormData): Promise<FormState> {
  await assertAdmin();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const scope = String(form.get("scope") ?? "");
  const days = Number(form.get("days"));
  if (!email || !scope || !Number.isInteger(days) || days < 1 || days > 3650) {
    return { ok: false, message: "Choose a student, what to unlock and a number of days (1 to 3650)." };
  }
  if (scope !== "all" && !/^course:[a-z0-9-]+$/.test(scope)) return { ok: false, message: "Unknown course." };

  const db = createSupabaseAdminClient();
  const { data: list, error: listError } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (listError) return { ok: false, message: listError.message };
  const student = list.users.find((u) => u.email?.toLowerCase() === email);
  if (!student) return { ok: false, message: `No account found for ${email}. Ask them to sign in once first.` };

  // Stack on top of any current access, like a purchase would.
  const { data: current } = await db
    .from("entitlements")
    .select("expires_at")
    .eq("user_id", student.id)
    .eq("scope", scope)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ expires_at: string }>();
  const start = new Date(Math.max(Date.now(), current ? Date.parse(current.expires_at) : 0));
  const expires = new Date(start.getTime() + days * 86_400_000);

  const { error } = await db.from("entitlements").insert({
    user_id: student.id,
    scope,
    starts_at: start.toISOString(),
    expires_at: expires.toISOString(),
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/students");
  return { ok: true, message: `Access granted to ${email} until ${expires.toLocaleDateString("en-GB")}.` };
}

export async function revokeAccess(form: FormData) {
  await assertAdmin();
  const id = String(form.get("id") ?? "");
  if (!id) return;
  const { error } = await createSupabaseAdminClient().from("entitlements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/students");
}

export async function recheckOrder(form: FormData) {
  await assertAdmin();
  const reference = String(form.get("reference") ?? "");
  if (reference) await fulfilOrder(reference);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
