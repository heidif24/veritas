import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPlan, type PlanId } from "@/lib/payments/plans";
import { createSubscription, recordPaymentEvent } from "@/lib/payments/store";
import { withSecurityHeaders, clientIp, rateLimit, pruneRateBuckets } from "@/lib/security";

export const runtime = "nodejs";

/**
 * Create a checkout session for Stripe (card) or return PayPal redirect params.
 * Set STRIPE_SECRET_KEY / PAYPAL_* in env for live providers.
 * Without keys, returns a demo checkout URL so marketing flows still work.
 */
export async function POST(request: Request) {
  pruneRateBuckets();
  const ip = clientIp(request);
  const limited = rateLimit(`checkout:${ip}`, 20, 15 * 60 * 1000);
  if (limited) return withSecurityHeaders(limited);

  const body = await request.json().catch(() => ({}));
  const planId = String(body.planId ?? "") as PlanId;
  const provider = String(body.provider ?? "stripe") as "stripe" | "paypal";
  const plan = getPlan(planId);

  if (!plan) {
    return withSecurityHeaders(
      NextResponse.json({ error: "Invalid plan. Use individual or publisher." }, { status: 400 }),
    );
  }

  const user = await getCurrentUser();
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const successUrl = `${origin}/pricing?success=1&plan=${plan.id}`;
  const cancelUrl = `${origin}/pricing?cancelled=1`;

  if (provider === "stripe") {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (secret) {
      try {
        const params = new URLSearchParams();
        params.set("mode", "subscription");
        params.set("success_url", successUrl);
        params.set("cancel_url", cancelUrl);
        params.set("line_items[0][price_data][currency]", "usd");
        params.set("line_items[0][price_data][unit_amount]", String(plan.priceCents));
        params.set("line_items[0][price_data][recurring][interval]", "month");
        params.set("line_items[0][price_data][product_data][name]", `Veritas ${plan.name}`);
        params.set(
          "line_items[0][price_data][product_data][description]",
          plan.highlight,
        );
        params.set("line_items[0][quantity]", "1");
        params.set("metadata[planId]", plan.id);
        if (user?.email) params.set("customer_email", user.email);
        if (user?.id) params.set("client_reference_id", user.id);

        const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });
        const data = (await res.json()) as { id?: string; url?: string; error?: { message: string } };
        if (!res.ok || !data.url) {
          return withSecurityHeaders(
            NextResponse.json(
              { error: data.error?.message || "Stripe checkout failed" },
              { status: 502 },
            ),
          );
        }
        if (user?.id) {
          createSubscription({
            userId: user.id,
            planId: plan.id,
            provider: "stripe",
            providerRef: data.id,
            amountCents: plan.priceCents,
            status: "pending",
          });
        }
        recordPaymentEvent("stripe", "checkout.session.created", { id: data.id, planId: plan.id });
        return withSecurityHeaders(NextResponse.json({ url: data.url, provider: "stripe" }));
      } catch (e) {
        return withSecurityHeaders(
          NextResponse.json(
            { error: e instanceof Error ? e.message : "Stripe error" },
            { status: 502 },
          ),
        );
      }
    }

    // Demo mode — no Stripe key
    const demoRef = `demo_stripe_${plan.id}_${Date.now()}`;
    if (user?.id) {
      createSubscription({
        userId: user.id,
        planId: plan.id,
        provider: "stripe",
        providerRef: demoRef,
        amountCents: plan.priceCents,
        status: "pending",
      });
    }
    return withSecurityHeaders(
      NextResponse.json({
        url: `${successUrl}&demo=1&ref=${demoRef}`,
        provider: "stripe",
        demo: true,
        message:
          "Stripe keys not configured. Set STRIPE_SECRET_KEY for live card payments. Demo success URL returned.",
      }),
    );
  }

  if (provider === "paypal") {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const base =
      process.env.PAYPAL_MODE === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    if (clientId && clientSecret) {
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
          return withSecurityHeaders(
            NextResponse.json({ error: "PayPal auth failed" }, { status: 502 }),
          );
        }

        const orderRes = await fetch(`${base}/v2/checkout/orders`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: plan.priceUsd.toFixed(2),
                },
                description: `Veritas ${plan.name} — monthly`,
                custom_id: plan.id,
              },
            ],
            application_context: {
              return_url: successUrl,
              cancel_url: cancelUrl,
              brand_name: "Veritas",
              user_action: "PAY_NOW",
            },
          }),
        });
        const order = (await orderRes.json()) as {
          id?: string;
          links?: Array<{ rel: string; href: string }>;
        };
        const approve = order.links?.find((l) => l.rel === "approve")?.href;
        if (!approve || !order.id) {
          return withSecurityHeaders(
            NextResponse.json({ error: "PayPal order create failed" }, { status: 502 }),
          );
        }
        if (user?.id) {
          createSubscription({
            userId: user.id,
            planId: plan.id,
            provider: "paypal",
            providerRef: order.id,
            amountCents: plan.priceCents,
            status: "pending",
          });
        }
        recordPaymentEvent("paypal", "order.created", { id: order.id, planId: plan.id });
        return withSecurityHeaders(
          NextResponse.json({ url: approve, orderId: order.id, provider: "paypal" }),
        );
      } catch (e) {
        return withSecurityHeaders(
          NextResponse.json(
            { error: e instanceof Error ? e.message : "PayPal error" },
            { status: 502 },
          ),
        );
      }
    }

    const demoRef = `demo_paypal_${plan.id}_${Date.now()}`;
    if (user?.id) {
      createSubscription({
        userId: user.id,
        planId: plan.id,
        provider: "paypal",
        providerRef: demoRef,
        amountCents: plan.priceCents,
        status: "pending",
      });
    }
    return withSecurityHeaders(
      NextResponse.json({
        url: `${successUrl}&demo=1&ref=${demoRef}`,
        provider: "paypal",
        demo: true,
        message:
          "PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET. Demo success URL returned.",
      }),
    );
  }

  return withSecurityHeaders(
    NextResponse.json({ error: "Unsupported provider. Use stripe or paypal." }, { status: 400 }),
  );
}
