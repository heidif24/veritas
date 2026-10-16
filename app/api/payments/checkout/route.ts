import { NextResponse } from "next/server";
import { getPlan, type PlanId } from "@/lib/payments/plans";
import { withSecurityHeaders, clientIp, rateLimit, pruneRateBuckets } from "@/lib/security";

export const runtime = "nodejs";

/**
 * Self-serve card/PayPal checkout is retired.
 * Veritas is licensed to universities only — redirect callers to institutional onboarding.
 */
export async function POST(request: Request) {
  pruneRateBuckets();
  const ip = clientIp(request);
  const limited = rateLimit(`checkout:${ip}`, 20, 15 * 60 * 1000);
  if (limited) return withSecurityHeaders(limited);

  const body = await request.json().catch(() => ({}));
  const planId = String(body.planId ?? "") as PlanId;
  const plan = getPlan(planId);

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const onboarding = `${origin}/onboarding?intent=institution`;

  if (!plan) {
    return withSecurityHeaders(
      NextResponse.json(
        {
          error:
            "Self-serve plans are no longer available. Contact support to license Veritas for your university.",
          url: onboarding,
        },
        { status: 400 },
      ),
    );
  }

  return withSecurityHeaders(
    NextResponse.json({
      url: onboarding,
      provider: "sales",
      message: "University licences are arranged with support. Redirecting to institutional onboarding.",
    }),
  );
}
