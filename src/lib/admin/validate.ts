import { z } from "zod";
import type { FieldDef, ResourceDef } from "./resources";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Builds the validator for one field from its definition. */
function fieldSchema(f: FieldDef): z.ZodType {
  const req = (s: z.ZodString) => (f.required ? s.min(1, `${f.label} is required`) : s);
  switch (f.type) {
    case "number":
      return z.coerce
        .number({ error: `${f.label} must be a number` })
        .int(`${f.label} must be a whole number`)
        .min(f.min ?? Number.MIN_SAFE_INTEGER, `${f.label} must be at least ${f.min}`);
    case "checkbox":
      return z.boolean();
    case "lines":
      return z.array(z.string().max(500)).max(100);
    case "select":
      return z.enum(f.options!.map((o) => o.value) as [string, ...string[]], { error: `Choose a ${f.label.toLowerCase()}` });
    case "date":
      return z.string().regex(DATE, `${f.label} must be a date`);
    case "slug":
      return z.string().trim().regex(SLUG, "Use lowercase letters, numbers and hyphens only (e.g. my-course)").max(80);
    case "url":
      return req(z.string().trim()).pipe(z.url({ error: `${f.label} must be a full link starting with https://` }));
    case "image":
      return req(z.string().trim()).refine((v) => /^https:\/\//.test(v) || v.startsWith("/"), "Upload an image");
    default: {
      const s = req(z.string().trim().max(f.type === "textarea" ? 5000 : 300));
      return f.nullable ? s.transform((v) => (v === "" ? null : v)) : s;
    }
  }
}

/** Reads raw FormData into typed values for the resource's fields. */
function readForm(fields: FieldDef[], form: FormData) {
  const raw: Record<string, unknown> = {};
  for (const f of fields) {
    const v = form.get(f.name);
    if (f.type === "checkbox") raw[f.name] = v === "on";
    else if (f.type === "lines")
      raw[f.name] = String(v ?? "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    else raw[f.name] = v === null ? "" : String(v);
  }
  return raw;
}

export function validateResource(def: ResourceDef, form: FormData, mode: "create" | "update") {
  const fields = def.fields.filter((f) => mode === "create" || !f.createOnly);
  const schema = z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
  return schema.safeParse(readForm(fields, form));
}
