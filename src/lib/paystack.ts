import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { requireEnv } from "@/lib/env";

/**
 * Minimal Paystack REST client. Docs: https://paystack.com/docs/api/transaction/
 * Amounts are sent in the currency's subunit (KES cents), so KES 1,500 = 150000.
 */

const API = "https://api.paystack.co";
const secretKey = () => requireEnv("PAYSTACK_SECRET_KEY", process.env.PAYSTACK_SECRET_KEY);

type PaystackResponse<T> = { status: boolean; message: string; data: T };

async function paystack<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as PaystackResponse<T> | null;
  if (!res.ok || !body?.status) {
    throw new Error(`Paystack ${path} failed (${res.status}): ${body?.message ?? "no response body"}`);
  }
  return body.data;
}

export async function initializeTransaction(params: {
  email: string;
  amountKes: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{ authorization_url: string; reference: string }> {
  return paystack("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKes * 100,
      currency: "KES",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });
}

export type VerifiedTransaction = {
  status: "success" | "failed" | "abandoned" | "ongoing" | "pending" | "reversed" | string;
  reference: string;
  amount: number; // subunit
  currency: string;
};

export async function verifyTransaction(reference: string): Promise<VerifiedTransaction> {
  return paystack(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/** Checks the x-paystack-signature header (HMAC-SHA512 of the raw body with the secret key). */
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
