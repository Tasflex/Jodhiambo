import "server-only";

type Mail = {
  subject: string;
  text: string;
  replyTo?: string;
  to?: string;
};

export class MailNotConfiguredError extends Error {
  constructor() {
    super("Email delivery is not configured (RESEND_API_KEY is missing).");
  }
}

/**
 * Sends an email through Resend's HTTP API. In development without a key, the
 * message is printed to the server console instead. In production without a key
 * it throws, so a form never reports success for a message nobody will receive.
 */
export async function sendMail({ subject, text, replyTo, to }: Mail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = to ?? process.env.MAIL_TO;

  if (!apiKey || !recipient) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[mail:dev] To: ${recipient ?? "(MAIL_TO unset)"}\nSubject: ${subject}\n\n${text}\n`);
      return;
    }
    throw new MailNotConfiguredError();
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "Website <onboarding@resend.dev>",
      to: [recipient],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`Email provider responded ${res.status}: ${await res.text()}`);
  }
}
