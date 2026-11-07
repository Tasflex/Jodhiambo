import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

type Mail = {
  subject: string;
  text: string;
  replyTo?: string;
  to?: string;
};

export class MailNotConfiguredError extends Error {
  constructor() {
    super("Email delivery is not configured (set SMTP_HOST or RESEND_API_KEY).");
  }
}

let smtp: Transporter | null = null;

function smtpTransport(): Transporter | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  if (!smtp) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    smtp = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = TLS from the start; 587 = STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return smtp;
}

const fromAddress = () => process.env.MAIL_FROM ?? "Jodhiambo <noreply@jodhiambo.co.ke>";

/**
 * Sends an email via SMTP (preferred; e.g. the cPanel mailbox) or Resend's HTTP API.
 * In development with neither configured, the message is printed to the console.
 * In production it throws instead, so a form never reports success for a message
 * nobody will receive.
 */
export async function sendMail({ subject, text, replyTo, to }: Mail): Promise<void> {
  const recipient = to ?? process.env.MAIL_TO;
  if (!recipient) throw new MailNotConfiguredError();

  const transport = smtpTransport();
  if (transport) {
    await transport.sendMail({ from: fromAddress(), to: recipient, subject, text, replyTo });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromAddress(),
        to: [recipient],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) throw new Error(`Email provider responded ${res.status}: ${await res.text()}`);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`\n[mail:dev] To: ${recipient}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }
  throw new MailNotConfiguredError();
}
