"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useLocale } from "@/app/components/locale-provider";

type PaidPlanId = "individual" | "publisher";

function PricingInner() {
  const { t } = useLocale();
  const search = useSearchParams();
  const success = search.get("success");
  const cancelled = search.get("cancelled");
  const demo = search.get("demo");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(planId: PaidPlanId, provider: "stripe" | "paypal") {
    setBusy(`${planId}-${provider}`);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, provider }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        setBusy(null);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Network error starting checkout");
    }
    setBusy(null);
  }

  const tiers = [
    {
      id: "individual" as const,
      name: t("pricing.individual"),
      price: "$15",
      period: t("pricing.perMonth"),
      blurb: t("pricing.individual.blurb"),
      cta: t("pricing.start"),
      href: "/register?plan=individual",
      featured: false,
      paid: true as const,
      features: [t("pricing.f1"), t("pricing.f2"), t("pricing.f3"), t("pricing.f4"), t("pricing.f5")],
    },
    {
      id: "publisher" as const,
      name: t("pricing.publisher"),
      price: "$40",
      period: t("pricing.perMonth"),
      blurb: t("pricing.publisher.blurb"),
      cta: t("pricing.publisher.cta"),
      href: "/register?plan=publisher",
      featured: true,
      paid: true as const,
      features: [t("pricing.pf1"), t("pricing.pf2"), t("pricing.pf3"), t("pricing.pf4"), t("pricing.pf5")],
    },
    {
      id: "institution" as const,
      name: t("pricing.institution"),
      price: t("pricing.custom"),
      period: "",
      blurb: t("pricing.institution.blurb"),
      cta: t("pricing.contact"),
      href: "/onboarding?intent=institution",
      featured: false,
      paid: false as const,
      features: [
        t("pricing.if1"),
        t("pricing.if2"),
        t("pricing.if3"),
        t("pricing.if4"),
        t("pricing.if5"),
        t("pricing.if6"),
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-12 text-center md:pt-14">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">{t("nav.pricing")}</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-tight md:text-4xl">{t("pricing.title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">{t("pricing.subtitle")}</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
          Process monitoring and cryptographic sealing are included on every paid plan — the core of Veritas.
        </p>
      </section>

      {(success || cancelled || error) && (
        <section className="mx-auto max-w-6xl px-6 pb-4">
          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
              Payment started successfully{demo ? " (demo mode — add Stripe/PayPal keys for live charges)" : ""}.
              Create or log into your account to use process monitoring and seals.
            </div>
          ) : null}
          {cancelled ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
              Checkout cancelled. You can try again anytime.
            </div>
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">{error}</div>
          ) : null}
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-violet-50 px-5 py-4 text-left sm:text-center">
          <p className="text-sm font-semibold text-slate-900">{t("pricing.studentBanner")}</p>
          <p className="mt-1 text-sm text-slate-600">{t("pricing.studentfree")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-6 shadow-sm ${
                tier.featured
                  ? "border-violet-300 bg-violet-50/40 ring-1 ring-violet-200"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{tier.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-slate-900">{tier.price}</span>
                {tier.period ? <span className="text-sm font-medium text-slate-500">{tier.period}</span> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{tier.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-slate-700">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {tier.paid ? (
                <div className="mt-6 space-y-2">
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => checkout(tier.id, "stripe")}
                    className={`inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
                      tier.featured
                        ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-500/20 hover:opacity-95"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {busy === `${tier.id}-stripe` ? "Redirecting…" : "Pay with card (Stripe)"}
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => checkout(tier.id, "paypal")}
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {busy === `${tier.id}-paypal` ? "Redirecting…" : "Pay with PayPal"}
                  </button>
                  <Link
                    href={tier.href}
                    className="inline-flex w-full items-center justify-center rounded-full px-5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Or create account first →
                  </Link>
                </div>
              ) : (
                <Link
                  href={tier.href}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Card payments via Stripe · PayPal supported · Institution plans invoiced separately.
          Live keys: set <code className="rounded bg-slate-100 px-1">STRIPE_SECRET_KEY</code> and{" "}
          <code className="rounded bg-slate-100 px-1">PAYPAL_CLIENT_ID</code> /{" "}
          <code className="rounded bg-slate-100 px-1">PAYPAL_CLIENT_SECRET</code>.
        </p>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-black text-slate-900">{t("pricing.salesTitle")}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{t("pricing.salesBody")}</p>
            <Link
              href="/onboarding?intent=institution"
              className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
            >
              {t("pricing.schedule")}
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">{t("pricing.neverTitle")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>· {t("pricing.never1")}</li>
              <li>· {t("pricing.never2")}</li>
              <li>· {t("pricing.never3")}</li>
              <li>· {t("pricing.never4")}</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white p-12 text-center text-slate-500">Loading pricing…</main>}>
      <PricingInner />
    </Suspense>
  );
}
