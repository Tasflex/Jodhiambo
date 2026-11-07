"use client";

import { useActionState } from "react";
import { grantAccess, type FormState } from "@/app/admin/actions";

export function GrantAccessForm({
  students,
  courses,
}: {
  students: string[];
  courses: { value: string; label: string }[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(grantAccess, null);

  return (
    <form action={action}>
      <div className="form-group">
        <label htmlFor="grant-email">Student email</label>
        <input id="grant-email" name="email" type="email" list="student-emails" className="form-control" required />
        <datalist id="student-emails">
          {students.map((e) => (
            <option key={e} value={e} />
          ))}
        </datalist>
      </div>
      <div className="form-group">
        <label htmlFor="grant-scope">Unlock</label>
        <select id="grant-scope" name="scope" className="form-control" defaultValue="all" required>
          <option value="all">All-Access (every course)</option>
          <optgroup label="A single course">
            {courses.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="grant-days">For how many days</label>
        <input id="grant-days" name="days" type="number" min={1} max={3650} defaultValue={30} className="form-control" required />
      </div>
      <button type="submit" className="btn btn--block" disabled={pending}>
        {pending ? "Granting…" : "Grant access"}
      </button>
      {state && (
        <p className={`alert ${state.ok ? "alert--success" : "alert--error"}`} role={state.ok ? "status" : "alert"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
