"use client";

import { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { createImageUpload } from "@/app/admin/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import styles from "./admin.module.css";

const MAX_BYTES = 10 * 1024 * 1024;

/** Uploads an image to the public media bucket and stores its URL in a hidden input. */
export function ImageField({ name, folder, initial }: { name: string; folder: string; initial: string }) {
  const [url, setUrl] = useState(initial);
  const [status, setStatus] = useState<{ busy: boolean; error?: string }>({ busy: false });
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) return setStatus({ busy: false, error: "Choose a JPG, PNG or WebP image." });
    if (file.size > MAX_BYTES) return setStatus({ busy: false, error: "Images must be 10 MB or smaller." });
    setStatus({ busy: true });
    try {
      const target = await createImageUpload(folder, file.name);
      const { error } = await createSupabaseBrowserClient()
        .storage.from(target.bucket)
        .uploadToSignedUrl(target.path, target.token, file, { contentType: file.type });
      if (error) throw error;
      setUrl(target.publicUrl);
      setStatus({ busy: false });
    } catch (err) {
      setStatus({ busy: false, error: err instanceof Error ? err.message : "Upload failed." });
    }
  }

  return (
    <div className={styles.imageField}>
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- preview of an arbitrary uploaded URL
        <img src={url} alt="" className={styles.imagePreview} />
      ) : (
        <div className={styles.imagePreview} aria-hidden />
      )}
      <div className={styles.imageControls}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => inputRef.current?.click()}
          disabled={status.busy}
          style={{ justifySelf: "start" }}
        >
          <FaUpload aria-hidden /> {status.busy ? "Uploading…" : url ? "Replace image" : "Upload image"}
        </button>
        <p className={styles.help}>JPG, PNG or WebP, up to 10 MB.</p>
        {status.error && (
          <p className="field-error" role="alert">
            {status.error}
          </p>
        )}
      </div>
    </div>
  );
}
