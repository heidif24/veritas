"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";

export default function PlatformPage() {
  const { t } = useLocale();

  const pillars = [
    { t: "Process monitoring", d: "Living composition record: key events, deletes, pastes, focus loss, timing, and revision structure." },
    { t: "AI detection & assistance", d: "Segment-level classification — fully human, lightly assisted, moderately assisted, fully AI-generated." },
    { t: "Plagiarism & corpus", d: "Similarity against institutional corpora and prior submissions with source spans." },
    { t: "Proctored sessions", d: "Browser evidence: visibility, blur, fullscreen, copy/paste. Risk scores faculty can interpret." },
    { t: "LMS / LTI Advantage", d: "Canvas, Moodle, and LTI 1.3 launch. Students enter Veritas from the LMS with audit logging." },
    { t: "Assignments & questions", d: "Writing tasks, timed sessions, and objective checks under one integrity model." },
    { t: "Cryptographic seal", d: "SHA-256 content hash + Ed25519 signature. Portable .veritas packages." },
    { t: "Public verification", d: "Anyone uploads a sealed package to /verify — no login required — to confirm integrity." },
    { t: "Roles & multi-tenant", d: "Student, instructor, admin, publisher. Institution domains, entitlements, and policy engine." },
  ];

  const steps = [
    { t: "Assign", d: "Create writing or objective work in Veritas or launch from Canvas/Moodle. Optional proctoring and timers." },
    { t: "Capture", d: "Students draft while process, AI, plagiarism, and session events record in the background." },
    { t: "Review", d: "Faculty see one evidence package: process trail, signals, proctor log — not a single opaque score." },
    { t: "Seal", d: "Export a signed package so authenticity holds for archives, publishers, and external verifiers." },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12 text-center md:pt-14">
        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-700">{t("nav.product")}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Process, proctoring, LMS, AI, plagiarism, and sealed results
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          The full Veritas stack: authorship monitoring, integrity checks, secure sessions, campus integrations,
          and cryptographic verification — built for universities and serious publishers.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.t} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-base font-bold text-slate-900">{p.t}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-center text-2xl font-black md:text-3xl">How work moves through Veritas</h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {steps.map((s, i) => (
              <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-600">Step {i + 1}</div>
                <div className="mt-1 text-lg font-bold text-slate-900">{s.t}</div>
                <p className="mt-2 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 text-center">
        <h2 className="text-2xl font-black md:text-3xl">Ready to try the full stack?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
            Create account
          </Link>
          <Link href="/universities" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            University solutions
          </Link>
          <Link href="/verify" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Verify a package
          </Link>
        </div>
      </section>
    </main>
  );
}
