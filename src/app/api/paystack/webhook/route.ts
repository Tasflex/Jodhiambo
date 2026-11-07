import { NextResponse } from "next/server";
import { fulfilOrder } from "@/lib/orders";
import { isValidWebhookSignature } from "@/lib/paystack";

/**
 * Paystack webhook. Set this URL in the Paystack dashboard:
 *   https://<your-domain>/api/paystack/webhook
 * This grants access even if the customer closes the tab before being redirected back.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (!isValidWebhookSignature(raw, request.headers.get("x-paystack-signature"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(raw) as { event?: string; data?: { reference?: string } };

  if (event.event === "charge.success" && event.data?.reference) {
    try {
      await fulfilOrder(event.data.reference);
    } catch (err) {
      console.error("[webhook] fulfilment failed", err);
      return new NextResponse("Retry later", { status: 500 }); // Paystack retries non-2xx responses
    }
  }

  return NextResponse.json({ received: true });
}
