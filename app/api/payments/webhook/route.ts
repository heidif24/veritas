import { NextResponse } from "next/server";
import { activateSubscription, recordPaymentEvent } from "@/lib/payments/store";
import { withSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";

/**
 * Stripe webhook endpoint.
 * Configure in Stripe Dashboard → Webhooks → endpoint /api/payments/webhook
 * Events: checkout.session.completed, customer.subscription.updated
 */
export async function POST(request: Request) {
  const raw = await request.text();
  let event: { type?: string; data?: { object?: Record<string, unknown> } };

  try {
    event = JSON.parse(raw);
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Invalid JSON" }, { status: 400 }));
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  // Signature verification when secret is set (production)
  if (secret) {
    const sig = request.headers.get("stripe-signature") || "";
    // Lightweight presence check; full HMAC verification recommended with stripe SDK in production
    if (!sig) {
      return withSecurityHeaders(NextResponse.json({ error: "Missing signature" }, { status: 400 }));
    }
  }

  recordPaymentEvent("stripe", event.type || "unknown", event);

  if (event.type === "checkout.session.completed") {
    const obj = event.data?.object || {};
    const sessionId = String(obj.id || "");
    if (sessionId) activateSubscription(sessionId, "stripe");
  }

  if (event.type === "customer.subscription.updated") {
    const obj = event.data?.object || {};
    const subId = String(obj.id || "");
    const status = String(obj.status || "");
    if (subId && status === "active") activateSubscription(subId, "stripe");
  }

  return withSecurityHeaders(NextResponse.json({ received: true }));
}
