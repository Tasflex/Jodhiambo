import { useId } from "react";

type FieldProps = {
  label: string;
  /** Key used to look up this field's message in `errors` (e.g. "customer.email"). */
  name: string;
  /** The input's form name, if different from `name`. */
  inputName?: string;
  errors: Record<string, string>;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  placeholder?: string;
};

/** Labelled input with an accessible inline error message. */
export function Field({ label, name, inputName, errors, type = "text", multiline, autoComplete, placeholder }: FieldProps) {
  const id = useId();
  const error = errors[name];
  const shared = {
    id,
    name: inputName ?? name,
    className: "form-control",
    required: true,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {multiline ? <textarea {...shared} /> : <input {...shared} type={type} autoComplete={autoComplete} />}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
