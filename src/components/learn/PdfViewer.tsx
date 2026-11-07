"use client";

import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand, FaMagnifyingGlassMinus, FaMagnifyingGlassPlus } from "react-icons/fa6";
import { materialFileUrl, VIEWER_HEADER } from "@/lib/viewer";
import styles from "./PdfViewer.module.css";

type Props = {
  materialId: string;
  /** Printed across every page so shared screenshots can be traced to an account. */
  watermark: string;
};

type Status = { kind: "loading" } | { kind: "ready"; pages: number } | { kind: "error"; message: string };

const ZOOM_STEPS = [0.75, 1, 1.25, 1.5, 2, 2.5];

/**
 * View-only PDF reader. Pages are drawn onto a <canvas> with pdf.js: there is no
 * file link, no text layer to copy, no print or download button, and each page
 * carries a watermark. (Nothing in a browser can stop screenshots; the
 * watermark discourages sharing them.)
 */
export function PdfViewer({ materialId, watermark }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const taskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const renderRef = useRef<RenderTask | null>(null);

  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [page, setPage] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(1); // 1 = fit to width

  // Load the document once.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(materialFileUrl(materialId), {
          headers: { [VIEWER_HEADER]: "1" },
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!res.ok) throw new Error((await res.text()) || "Could not open this document.");
        const data = new Uint8Array(await res.arrayBuffer());

        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";
        if (cancelled) return;
        const task = pdfjs.getDocument({ data, enableXfa: false });
        taskRef.current = task;
        const doc = await task.promise;
        if (cancelled) return;
        docRef.current = doc;
        setStatus({ kind: "ready", pages: doc.numPages });
      } catch (err) {
        if (!cancelled) {
          setStatus({ kind: "error", message: err instanceof Error ? err.message : "Could not open this document." });
        }
      }
    })();

    return () => {
      cancelled = true;
      renderRef.current?.cancel();
      void taskRef.current?.destroy(); // also frees the document and worker
      taskRef.current = null;
      docRef.current = null;
    };
  }, [materialId]);

  const render = useCallback(async () => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!doc || !canvas || !frame) return;

    renderRef.current?.cancel();
    const pdfPage = await doc.getPage(page);

    const fitWidth = (frame.clientWidth - 2) / pdfPage.getViewport({ scale: 1 }).width;
    const cssScale = fitWidth * ZOOM_STEPS[zoomIndex];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = pdfPage.getViewport({ scale: cssScale * dpr });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
    canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

    const task = pdfPage.render({ canvas, viewport });
    renderRef.current = task;
    try {
      await task.promise;
    } catch {
      return; // cancelled by a newer render
    }
    drawWatermark(canvas, watermark);
  }, [page, zoomIndex, watermark]);

  useEffect(() => {
    if (status.kind !== "ready") return;
    void render();
    const onResize = () => void render();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [status, render]);

  const pages = status.kind === "ready" ? status.pages : 0;
  const go = (n: number) => setPage(Math.min(Math.max(1, n), pages || 1));

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "PageDown") go(page + 1);
    if (e.key === "ArrowLeft" || e.key === "PageUp") go(page - 1);
  }

  return (
    <div className={styles.viewer} onContextMenu={(e) => e.preventDefault()}>
      <div className={styles.toolbar} role="toolbar" aria-label="Reader controls">
        <div className={styles.group}>
          <button type="button" onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Previous page">
            <FaChevronLeft aria-hidden />
          </button>
          <span className={styles.pageInfo}>
            <label htmlFor="pdf-page" className="visually-hidden">
              Page
            </label>
            <input
              id="pdf-page"
              type="number"
              min={1}
              max={pages || 1}
              value={page}
              onChange={(e) => go(Number(e.target.value))}
              disabled={!pages}
            />
            <span>of {pages || "…"}</span>
          </span>
          <button type="button" onClick={() => go(page + 1)} disabled={!pages || page >= pages} aria-label="Next page">
            <FaChevronRight aria-hidden />
          </button>
        </div>
        <div className={styles.group}>
          <button
            type="button"
            onClick={() => setZoomIndex((z) => Math.max(0, z - 1))}
            disabled={zoomIndex === 0}
            aria-label="Zoom out"
          >
            <FaMagnifyingGlassMinus aria-hidden />
          </button>
          <span className={styles.zoom}>{Math.round(ZOOM_STEPS[zoomIndex] * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoomIndex((z) => Math.min(ZOOM_STEPS.length - 1, z + 1))}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            aria-label="Zoom in"
          >
            <FaMagnifyingGlassPlus aria-hidden />
          </button>
          <button type="button" onClick={() => setZoomIndex(1)} aria-label="Fit to width">
            <FaExpand aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={frameRef}
        className={styles.frame}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={pages ? `Document, page ${page} of ${pages}` : "Document"}
      >
        {status.kind === "loading" && <p className={styles.message}>Loading document…</p>}
        {status.kind === "error" && (
          <p className={`${styles.message} alert alert--error`} role="alert">
            {status.message}
          </p>
        )}
        <canvas ref={canvasRef} className={styles.canvas} hidden={status.kind !== "ready"} />
      </div>
    </div>
  );
}

function drawWatermark(canvas: HTMLCanvasElement, text: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const label = `${text} · ${new Date().toLocaleDateString("en-GB")}`;
  const size = Math.max(14, Math.round(canvas.width / 38));

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#c0392b";
  ctx.font = `600 ${size}px "Segoe UI", system-ui, sans-serif`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 6);

  const stepX = ctx.measureText(label).width + size * 4;
  const stepY = size * 7;
  const reach = Math.hypot(canvas.width, canvas.height);
  for (let y = -reach; y < reach; y += stepY) {
    const offset = (Math.round(y / stepY) % 2) * (stepX / 2);
    for (let x = -reach; x < reach; x += stepX) ctx.fillText(label, x + offset, y);
  }
  ctx.restore();
}
