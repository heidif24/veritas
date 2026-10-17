"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";

export default function PricingPage() {
  const { t } = useLocale();

  const items = [
    "Student writing, submission, and process monitoring",
    "Instructor assignment and review workflows",
    "Cryptographic seals and verification",
    "Institutional branding and tenant controls",
    "Students covered at no individual cost",
    "Priority onboarding and support",
  ];

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-14 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">
          {t("nav.pricing")}
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-3xl md:text-4xl">
          Licensed exclusively to universities
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--muted)]">
          Veritas is sold only to universities and academic institutions. Your campus licenses the
          platform, customizes branding and policy, and provisions students and instructors.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl border border-[var(--emerald)]/25 bg-[var(--emerald-soft)] px-5 py-4 text-center">
          <p className="text-sm font-semibold text-[var(--ink)]">Students write free</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Once your university is onboarded, students with an institutional email get unlimited
            free access automatically. No individual or publisher self-serve plans.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14">
        <div className="v-card flex flex-col rounded-2xl border-[var(--emerald)]/40 p-8 shadow-md ring-1 ring-[var(--emerald)]/15">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            University & institution
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display text-3xl text-[var(--ink)]">Custom</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Campus licence with Moodle/LTI-ready workflows, faculty review, branding, and policy
            controls. Codes and access are issued to your institution — you customize for your
            campus.
          </p>
          <ul className="mt-5 flex-1 space-y-2.5 text-sm text-[var(--ink)]">
            {items.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-soft)] text-[10px] font-bold text-[var(--emerald)]">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary mt-6 w-full">
            Contact support to license
          </Link>
          <a
            href="mailto:support@veritas.io"
            className="mt-3 text-center text-sm font-semibold text-[var(--emerald)] hover:underline"
          >
            support@veritas.io
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Individual, tutor, and publisher plans are no longer offered. All access is through a
          university licence.
        </p>
      </section>

      <section className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <h2 className="font-display text-xl text-[var(--ink)]">Ready to bring Veritas to campus?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
            Tell us about your institution. We will issue access codes, help you customize branding
            and policy, and connect Moodle or your LMS where needed.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary">
              Start institutional onboarding
            </Link>
            <a href="mailto:support@veritas.io" className="v-btn v-btn-secondary">
              Email support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
