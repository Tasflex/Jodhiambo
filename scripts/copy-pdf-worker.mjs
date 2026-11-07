// Copies the pdf.js worker into /public so the reader can load it from the same origin,
// always matching the installed pdfjs-dist version. Runs automatically before dev/build.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const src = join(dirname(require.resolve("pdfjs-dist/package.json")), "build", "pdf.worker.min.mjs");
const destDir = join(process.cwd(), "public", "vendor");

mkdirSync(destDir, { recursive: true });
copyFileSync(src, join(destDir, "pdf.worker.min.mjs"));
console.log("pdf.js worker copied to public/vendor/");
