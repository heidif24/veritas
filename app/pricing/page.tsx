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
      features: [t("pricing.if1"), t("pricing.if2"), t("pricing.if3"), t("pricing.if4"), t("pricing.if5"), t("pricing.if6")],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-12 text-center md:pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">{t("nav.pricing")}</p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-3xl md:text-4xl">{t("pricing.title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--muted)]">{t("pricing.subtitle")}</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Process monitoring and cryptographic sealing are included on every paid plan — the core of Veritas.
        </p>
      </section>

      {(success || cancelled || error) && (
        <section className="mx-auto max-w-6xl px-6 pb-4">
          {success ? (
            <div className="rounded-2xl border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] px-5 py-4 text-sm text-[var(--emerald-dark)]">
              Payment started successfully{demo ? " (demo mode — add Stripe/PayPal keys for live charges)" : ""}.
              Create or log into your account to use process monitoring and seals.
            </div>
          ) : null}
          {cancelled ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white px-5 py-4 text-sm text-[var(--muted)]">
              Checkout cancelled. You can try again anytime.
            </div>
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-[var(--danger-soft)] px-5 py-4 text-sm text-[var(--danger)]">{error}</div>
          ) : null}
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl border border-[var(--emerald)]/25 bg-[var(--emerald-soft)] px-5 py-4 text-left sm:text-center">
          <p className="text-sm font-semibold text-[var(--ink)]">{t("pricing.studentBanner")}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("pricing.studentfree")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                tier.featured
                  ? "border-[var(--emerald)] bg-[var(--emerald-soft)]/40 shadow-md ring-1 ring-[var(--emerald)]/20"
                  : "v-card"
              }`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{tier.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl text-[var(--ink)]">{tier.price}</span>
                {tier.period ? <span className="text-sm font-medium text-[var(--muted)]">{tier.period}</span> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{tier.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-[var(--ink)]">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-soft)] text-[10px] font-bold text-[var(--emerald)]">
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
                    className="v-btn v-btn-primary w-full disabled:opacity-60"
                  >
                    {busy === `${tier.id}-stripe` ? "Redirecting…" : "Pay with card (Stripe)"}
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => checkout(tier.id, "paypal")}
                    className="v-btn v-btn-secondary w-full disabled:opacity-60"
                  >
                    {busy === `${tier.id}-paypal` ? "Redirecting…" : "Pay with PayPal"}
                  </button>
                  <Link href={tier.href} className="inline-flex w-full items-center justify-center py-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
                    Or create account first →
                  </Link>
                </div>
              ) : (
                <Link href={tier.href} className="v-btn v-btn-primary mt-6 w-full">
                  {tier.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Card payments via Stripe · PayPal supported · Institution plans invoiced separately.
          Live keys: set <code className="rounded bg-white px-1 border border-[var(--line)]">STRIPE_SECRET_KEY</code> and{" "}
          <code className="rounded bg-white px-1 border border-[var(--line)]">PAYPAL_CLIENT_ID</code>.
        </p>
      </section>

      <section className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl text-[var(--ink)]">{t("pricing.salesTitle")}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{t("pricing.salesBody")}</p>
            <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary mt-4">
              {t("pricing.schedule")}
            </Link>
          </div>
          <div>
            <h2 className="font-display text-xl text-[var(--ink)]">{t("pricing.neverTitle")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--muted)]">
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
    <Suspense fallback={<main className="min-h-screen bg-[var(--paper)] p-12 text-center text-[var(--muted)]">Loading pricing…</main>}>
      <PricingInner />
    </Suspense>
  );
}
