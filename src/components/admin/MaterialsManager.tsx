"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCircleCheck,
  FaCircleExclamation,
  FaCloudArrowUp,
  FaEye,
  FaFilePdf,
  FaSpinner,
  FaTrashCan,
} from "react-icons/fa6";
import {
  addMaterial,
  createMaterialUpload,
  deleteMaterial,
  renameMaterial,
  reorderMaterials,
} from "@/app/admin/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import styles from "./admin.module.css";

type Material = { id: string; title: string; size_bytes: number | null };
type Upload = { name: string; state: "uploading" | "done" | "error"; error?: string };

const MAX_BYTES = 100 * 1024 * 1024;

const prettySize = (n: number | null) =>
  n == null ? "" : n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;

const titleFromFile = (name: string) =>
  name
    .replace(/\.pdf$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function MaterialsManager({ courseSlug, initial }: { courseSlug: string; initial: Material[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [lastInitial, setLastInitial] = useState(initial);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState(false);
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  // Pick up the server's list after a refresh (uploads, deletes).
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setItems(initial);
  }

  async function uploadFiles(files: File[]) {
    const pdfs = files.filter((f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name));
    if (pdfs.length === 0) return;
    setUploads(pdfs.map((f) => ({ name: f.name, state: "uploading" })));
    const supabase = createSupabaseBrowserClient();

    // One at a time keeps the order predictable and the connection light.
    for (const [i, file] of pdfs.entries()) {
      const set = (u: Partial<Upload>) => setUploads((list) => list.map((x, j) => (j === i ? { ...x, ...u } : x)));
      try {
        if (file.size > MAX_BYTES) throw new Error("Larger than 100 MB");
        const target = await createMaterialUpload(courseSlug, file.name);
        const { error } = await supabase.storage
          .from(target.bucket)
          .uploadToSignedUrl(target.path, target.token, file, { contentType: "application/pdf" });
        if (error) throw error;
        await addMaterial(courseSlug, titleFromFile(file.name), target.path, file.size);
        set({ state: "done" });
      } catch (err) {
        set({ state: "error", error: err instanceof Error ? err.message : "Upload failed" });
      }
    }
    router.refresh();
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(index + dir, 0, moved);
    setItems(next);
    startTransition(() => reorderMaterials(courseSlug, next.map((m) => m.id)));
  }

  function remove(m: Material) {
    if (!window.confirm(`Delete "${m.title}"? Students will no longer see it.`)) return;
    setItems((list) => list.filter((x) => x.id !== m.id));
    startTransition(async () => {
      await deleteMaterial(m.id);
      router.refresh();
    });
  }

  function rename(m: Material, title: string) {
    const clean = title.trim();
    if (!clean || clean === m.title) return;
    setItems((list) => list.map((x) => (x.id === m.id ? { ...x, title: clean } : x)));
    startTransition(() => renameMaterial(m.id, clean));
  }

  const busy = uploads.some((u) => u.state === "uploading");

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ""}`}
        onClick={() => !busy && fileRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !busy && fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!busy) void uploadFiles([...e.dataTransfer.files]);
        }}
        aria-disabled={busy}
      >
        <FaCloudArrowUp aria-hidden />
        <strong>{busy ? "Uploading…" : "Drop PDFs here or click to choose"}</strong>
        <span>Up to 100 MB each. Students can read them online but cannot download them.</span>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          hidden
          onChange={(e) => {
            const files = [...(e.target.files ?? [])];
            e.target.value = "";
            void uploadFiles(files);
          }}
        />
      </div>

      {uploads.length > 0 && (
        <div aria-live="polite" style={{ marginTop: 12 }}>
          {uploads.map((u) => (
            <div key={u.name} className={styles.uploadRow}>
              {u.state === "uploading" && <FaSpinner aria-hidden className="spin" />}
              {u.state === "done" && <FaCircleCheck aria-hidden style={{ color: "var(--c-success)" }} />}
              {u.state === "error" && <FaCircleExclamation aria-hidden style={{ color: "var(--c-danger)" }} />}
              <span>{u.name}</span>
              {u.error && <span className="field-error">{u.error}</span>}
            </div>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className={styles.muted} style={{ marginTop: 16 }}>
          No materials yet.
        </p>
      ) : (
        <ol role="list" className={styles.materials}>
          {items.map((m, i) => (
            <li key={m.id} className={styles.material}>
              <FaFilePdf aria-hidden />
              <input
                defaultValue={m.title}
                aria-label="Title (click to rename)"
                onBlur={(e) => rename(m, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              />
              <span className={styles.muted}>{prettySize(m.size_bytes)}</span>
              <div className={styles.matActions}>
                <a href={`/learn/${courseSlug}/${m.id}`} target="_blank" rel="noreferrer" title="Preview in the reader">
                  <FaEye aria-hidden />
                  <span className="visually-hidden">Preview {m.title}</span>
                </a>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                  <FaArrowUp aria-hidden />
                  <span className="visually-hidden">Move {m.title} up</span>
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down">
                  <FaArrowDown aria-hidden />
                  <span className="visually-hidden">Move {m.title} down</span>
                </button>
                <button type="button" className={styles.del} onClick={() => remove(m)} title="Delete">
                  <FaTrashCan aria-hidden />
                  <span className="visually-hidden">Delete {m.title}</span>
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
