"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { fieldErrors, signInSchema } from "@/lib/schemas";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignInForm({ next }: { next: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sentTo, setSentTo] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email: new FormData(e.currentTarget).get("email") });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setState("sending");

    const supabase = createSupabaseBrowserClient();
    const redirect = new URL("/auth/callback", window.location.origin);
    redirect.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: { emailRedirectTo: redirect.toString() },
    });

    if (error) {
      setState("error");
      return;
    }
    setSentTo(parsed.data.email);
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="card card--center" role="status">
        <h2>Check your email</h2>
        <p>
          We sent a sign-in link to <strong>{sentTo}</strong>. Open it on this device to continue.
        </p>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={onSubmit} noValidate>
      <p style={{ marginBottom: 18 }}>
        Enter your email and we&apos;ll send you a secure sign-in link. New here? The same link creates your account.
      </p>
      <Field label="Email" name="email" type="email" autoComplete="email" errors={errors} />
      <button type="submit" className="btn btn--block" disabled={state === "sending"}>
        {state === "sending" ? "Sending link…" : "Email me a sign-in link"}
      </button>
      {state === "error" && (
        <p className="alert alert--error" role="alert">
          We couldn&apos;t send the link. Please wait a minute and try again.
        </p>
      )}
    </form>
  );
}
