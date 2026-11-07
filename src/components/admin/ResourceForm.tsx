"use client";

import { startTransition, useActionState, useState } from "react";
import { saveResource, type FormState } from "@/app/admin/actions";
import type { FieldDef } from "@/lib/admin/resources";
import { ImageField } from "./ImageField";
import styles from "./admin.module.css";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

type Props = {
  resource: string;
  fields: FieldDef[];
  values: Record<string, unknown>;
  /** null when creating */
  id: string | null;
};

export function ResourceForm({ resource, fields, values, id }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveResource, null);
  const creating = id === null;

  // When creating, keep the slug in step with the title until the admin edits it.
  const slugField = fields.find((f) => f.type === "slug");
  const [slug, setSlug] = useState(String(values[slugField?.name ?? ""] ?? ""));
  const [slugTouched, setSlugTouched] = useState(false);

  /** The title/name field fills in the slug while creating, until the slug is edited by hand. */
  const autoSlugFrom = (name: string) => creating && !!slugField && !slugTouched && (name === "title" || name === "name");

  const errors = state?.errors ?? {};
  const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

  return (
    // Submitted via onSubmit (not <form action>) so React does not reset the
    // fields when the server returns validation errors.
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="_resource" value={resource} />
      <input type="hidden" name="_id" value={id ?? ""} />

      <div className={styles.formGrid}>
        {fields.map((f) => {
          if (f.createOnly && !creating) {
            return (
              <div key={f.name} className="form-group">
                <label>{f.label}</label>
                <p className="form-control" style={{ background: "var(--c-surface-alt)" }}>
                  <code>{str(values[f.name])}</code>
                </p>
              </div>
            );
          }

          const inputId = `f-${f.name}`;
          const err = errors[f.name];
          const common = {
            id: inputId,
            name: f.name,
            className: "form-control",
            placeholder: f.placeholder,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${inputId}-err` : f.help ? `${inputId}-help` : undefined,
          };
          const wide = f.wide || f.type === "textarea" || f.type === "lines";

          let control: React.ReactNode;
          switch (f.type) {
            case "textarea":
              control = <textarea {...common} defaultValue={str(values[f.name])} rows={3} />;
              break;
            case "lines":
              control = (
                <textarea
                  {...common}
                  defaultValue={Array.isArray(values[f.name]) ? (values[f.name] as string[]).join("\n") : ""}
                  rows={5}
                />
              );
              break;
            case "select":
              control = (
                <select {...common} defaultValue={str(values[f.name])}>
                  {f.options!.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              );
              break;
            case "checkbox":
              return (
                <div key={f.name} className={`form-group ${styles.wide}`}>
                  <label className={styles.check}>
                    <input type="checkbox" name={f.name} defaultChecked={Boolean(values[f.name])} />
                    {f.label}
                  </label>
                </div>
              );
            case "image":
              control = <ImageField name={f.name} folder={resource} initial={str(values[f.name])} />;
              break;
            case "slug":
              control = (
                <input
                  {...common}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                />
              );
              break;
            case "text":
              control = (
                <input
                  {...common}
                  type="text"
                  defaultValue={str(values[f.name])}
                  onChange={autoSlugFrom(f.name) ? (e) => setSlug(slugify(e.target.value)) : undefined}
                />
              );
              break;
            default:
              control = (
                <input
                  {...common}
                  type={f.type === "url" ? "url" : f.type}
                  min={f.min}
                  defaultValue={str(values[f.name])}
                />
              );
          }

          return (
            <div key={f.name} className={`form-group ${wide ? styles.wide : ""}`}>
              <label htmlFor={inputId}>
                {f.label}
                {f.required && <span aria-hidden> *</span>}
              </label>
              {control}
              {f.help && !err && (
                <p id={`${inputId}-help`} className={styles.help}>
                  {f.help}
                </p>
              )}
              {err && (
                <p id={`${inputId}-err`} className="field-error">
                  {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.formActions}>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Saving…" : creating ? "Create" : "Save changes"}
        </button>
        {state && !state.ok && (
          <span className="field-error" role="alert">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
