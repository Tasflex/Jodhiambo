import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { contactSchema, fieldErrors } from "@/lib/schemas";

/** Replaces the old process_form.php handler. Always responds with JSON. */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    // A filled honeypot means a bot: pretend success so it doesn't retry.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return NextResponse.json({ ok: true, message: "Thank you! Your message has been sent." });
    }
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await sendMail({
      subject: `Website enquiry: ${subject}`,
      replyTo: email,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
  } catch (err) {
    console.error("[contact] failed to send", err);
    return NextResponse.json(
      { ok: false, message: "Sorry, your message could not be sent. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: "Thank you! Your message has been sent." });
}
