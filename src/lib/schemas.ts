import { z } from "zod";

/** Shared between the browser forms and the API routes so both validate identically. */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address").max(200),
  subject: z.string().trim().min(2, "Please enter a subject").max(150),
  message: z.string().trim().min(10, "Your message should be at least 10 characters").max(5000),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const checkoutSchema = z.object({
  items: z.array(z.string().min(1).max(120)).min(1).max(50),
});

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address").max(200),
});

/** Turns a zod error into `{ field: message }` keyed by the dotted field path. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
