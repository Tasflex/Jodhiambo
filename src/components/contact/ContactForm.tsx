"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { contactSchema, fieldErrors } from "@/lib/schemas";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done"; ok: boolean; message: string };

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const payload = Object.fromEntries(new FormData(formEl)) as Record<string, string>;

    const check = contactSchema.safeParse(payload);
    if (!check.success && !check.error.issues.some((i) => i.path[0] === "website")) {
      setErrors(fieldErrors(check.error));
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; message: string; errors?: Record<string, string> }
        | null;

      if (data?.ok) formEl.reset();
      setErrors(data?.errors ?? {});
      setStatus({
        kind: "done",
        ok: Boolean(data?.ok),
        message: data?.message ?? "An error occurred. Please try again later.",
      });
    } catch {
      setStatus({ kind: "done", ok: false, message: "Network error. Please try again later." });
    }
  }

  return (
    <form className="card" onSubmit={onSubmit} noValidate>
      <Field label="Name" name="name" autoComplete="name" errors={errors} />
      <Field label="Email" name="email" type="email" autoComplete="email" errors={errors} />
      <Field label="Subject" name="subject" errors={errors} />
      <Field label="Message" name="message" multiline errors={errors} />

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn--secondary" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>

      {status.kind === "done" && (
        <p className={`alert ${status.ok ? "alert--success" : "alert--error"}`} role={status.ok ? "status" : "alert"}>
          {status.message}
        </p>
      )}
    </form>
  );
}
