"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-14 text-slate-900 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Universities only</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
          Veritas is licensed to universities
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          There is no individual, tutor, or publisher self-serve signup. Your university licenses
          Veritas, customizes it for campus, and provisions students and instructors.
        </p>

        <div className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-8 text-left shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">For university administrators</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Contact support to purchase access codes, set up your tenant, branding, and Moodle
            integration. Students at onboarded institutions write free.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/onboarding?intent=institution"
              className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Institutional onboarding
            </Link>
            <a
              href="mailto:support@veritas.io"
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              support@veritas.io
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-8 text-left shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Already have campus access?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            If your university is onboarded, sign in with your institutional account. Student and
            instructor accounts are issued by your institution.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-10 text-sm text-slate-600">
          Questions?{" "}
          <a href="mailto:support@veritas.io" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}
