"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-4 py-14 text-[var(--ink)] md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">
          Universities only
        </p>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Veritas is licensed to universities
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
          There is no individual, tutor, or publisher self-serve signup. Your university licenses
          Veritas, customizes it for campus, and provisions students and instructors.
        </p>

        <div className="mt-10 rounded-2xl border border-[var(--line)] bg-white p-8 text-left shadow-sm">
          <h2 className="font-display text-xl text-[var(--ink)]">For university administrators</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Contact support to purchase access codes, set up your tenant, branding, and Moodle
            integration. Students at onboarded institutions write free.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary">
              Institutional onboarding
            </Link>
            <a href="mailto:support@veritas.io" className="v-btn v-btn-secondary">
              support@veritas.io
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-8 text-left shadow-sm">
          <h2 className="font-display text-xl text-[var(--ink)]">Already have campus access?</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            If your university is onboarded, sign in with your institutional account. Student and
            instructor accounts are issued by your institution.
          </p>
          <Link href="/login" className="v-btn v-btn-secondary mt-6">
            Sign in
          </Link>
        </div>

        <p className="mt-10 text-sm text-[var(--muted)]">
          Questions?{" "}
          <a href="mailto:support@veritas.io" className="font-semibold text-[var(--emerald)] hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}
