import { NextResponse } from "next/server";
import { activateSubscription, recordPaymentEvent } from "@/lib/payments/store";
import { withSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";

/** Capture a PayPal order after buyer approval. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const orderId = String(body.orderId ?? "");
  if (!orderId) {
    return withSecurityHeaders(NextResponse.json({ error: "orderId required" }, { status: 400 }));
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const base =
    process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret) {
    // Demo capture
    activateSubscription(orderId, "paypal");
    recordPaymentEvent("paypal", "order.captured.demo", { orderId });
    return withSecurityHeaders(NextResponse.json({ status: "COMPLETED", demo: true, orderId }));
  }

  try {
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      return withSecurityHeaders(NextResponse.json({ error: "PayPal auth failed" }, { status: 502 }));
    }

    const capRes = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
    });
    const cap = (await capRes.json()) as { status?: string; id?: string };
    if (cap.status === "COMPLETED" || cap.id) {
      activateSubscription(orderId, "paypal");
    }
    recordPaymentEvent("paypal", "order.captured", cap);
    return withSecurityHeaders(NextResponse.json(cap));
  } catch (e) {
    return withSecurityHeaders(
      NextResponse.json(
        { error: e instanceof Error ? e.message : "Capture failed" },
        { status: 502 },
      ),
    );
  }
}
