"use client";

import Link from "next/link";
import { useState } from "react";

const capabilities = [
  {
    badge: "Continuous Telemetry",
    title: "Process & Composition Rhythm",
    body: "Captures how every draft is composed — keystrokes, pastes, focus changes, timing, and revision structure — as a living evidence trail, not a single score.",
    stat: "Full revision timeline",
  },
  {
    badge: "Cryptographic Proof",
    title: "Ed25519 & SHA-256 Sealing",
    body: "Locks content and process evidence into a portable .veritas package signed with SHA-256 and Ed25519. Integrity stays verifiable long after submission.",
    stat: "Verifiable offline",
  },
  {
    badge: "Segment Analysis",
    title: "AI Segment Analysis",
    body: "Reviews AI-generated and AI-assisted passages at segment level, alongside human process evidence, so decisions stay specific and defensible.",
    stat: "Defensible decisions",
  },
  {
    badge: "Contextual Comparison",
    title: "Similarity & Corpus Matching",
    body: "Compares work against institutional repositories and prior submissions, with source matches shown in context — clear, attributable, review-ready.",
    stat: "Review-ready output",
  },
  {
    badge: "Session Signals",
    title: "Honest Proctored Sessions",
    body: "Optional session signals for visibility, fullscreen, and focus. Honest browser evidence designed for academic policy — not exaggerated lockdown claims.",
    stat: "Privacy-first design",
  },
  {
    badge: "Campus Integration",
    title: "LTI Advantage 1.3 & LMS",
    body: "Drop-in support for Canvas and Moodle, multi-tenant institutions, faculty review queues, and free unlimited writing for onboarded students.",
    stat: "Canvas & Moodle ready",
  },
];

const workflowSteps = [
  {
    step: "01",
    role: "Faculty",
    title: "Assign",
    description: "Faculty create writing or mixed assessments in Veritas, or launch from Canvas and Moodle with optional proctoring and timers.",
  },
  {
    step: "02",
    role: "Students",
    title: "Compose",
    description: "Students write while process evidence, AI signals, and similarity checks record quietly in the background.",
  },
  {
    step: "03",
    role: "Reviewers",
    title: "Review",
    description: "Instructors examine one shared record — process, assistance, similarity, and session events — and treat flags as grounds for conversation.",
  },
  {
    step: "04",
    role: "Anyone",
    title: "Seal & Verify",
    description: "Export a signed package that binds document and evidence together. Anyone can verify authenticity on the public verify page.",
  },
];

const comparisonRows = [
  {
    feature: "Evaluation methodology",
    veritas: "Chronological process telemetry plus cryptographic proof of composition",
    traditional: "Opaque AI-detector percentages based on a static text snapshot",
  },
  {
    feature: "False positive defense",
    veritas: "A complete revision timeline shows how the work was actually written",
    traditional: "No recourse — non-native English and skilled writers get flagged",
  },
  {
    feature: "Verification portability",
    veritas: "A standalone sealed .veritas bundle anyone can verify, no account needed",
    traditional: "Locked behind vendor dashboards and subscription databases",
  },
  {
    feature: "Student privacy & dignity",
    veritas: "Browser signals with zero biometric intrusion or surveillance spyware",
    traditional: "Camera scanning, invasive lockdown browsers, undisclosed data harvesting",
  },
];

const audiences = {
  universities: {
    chip: "Higher Education",
    heading: "Campus-wide integrity with seamless LMS integration",
    intro:
      "Deploy across departments in minutes. Faculty create assignments with preset AI-tolerance thresholds and launch through Canvas and Moodle. Students compose without surveillance anxiety, and deans uphold integrity backed by evidence rather than probabilities.",
    bullets: [
      "LTI Advantage 1.3 certified for Canvas, Moodle, Blackboard, and D2L Brightspace",
      "Multi-tenant faculty review queues with role-based access control",
      "Unlimited free writing licenses for every enrolled student",
    ],
    cta: { href: "/universities", label: "Explore campus deployment" },
    panel: [
      { k: "LTI launch", v: "Canvas Course 8492 · Assignment #3" },
      { k: "Privacy", v: "FERPA & GDPR aligned · zero data sale" },
      { k: "Sign-on", v: "SAML 2.0 · Okta · Azure AD" },
    ],
  },
  publishers: {
    chip: "Journals & Editorial Desks",
    heading: "Inbound manuscript verification at scale",
    intro:
      "Screen ghostwritten and AI-generated submissions before peer review begins. Ask authors to supply a cryptographically sealed .veritas package that demonstrates genuine writing cadence and original synthesis — without relying on screenshots or trust alone.",
    bullets: [
      "Verification intake alongside Editorial Manager and ScholarOne workflows",
      "Granular segment inspection that separates tool use from ghostwriting",
      "Defensible audit reports for review boards and editors-in-chief",
    ],
    cta: { href: "/publishers", label: "Solutions for publishers" },
    panel: [
      { k: "Intake", v: "Signed .veritas manuscript package" },
      { k: "Integrity", v: "Signature valid · no post-seal edits" },
      { k: "Review", v: "Segment-level composition audit attached" },
    ],
  },
  authors: {
    chip: "Writers & Researchers",
    heading: "Protect your name. Own your work.",
    intro:
      "Never fall victim to a false AI accusation again. Write in Veritas and export a portable proof card showing every paragraph came from your mind and fingers — verifiable by any institution or journal on request.",
    bullets: [
      "Free writing workspace with continuous local telemetry capture",
      "Public verification links you can share on CVs and manuscripts",
      "Your words stay yours — never scraped, sold, or used for training",
    ],
    cta: { href: "/register", label: "Start writing free" },
    panel: [
      { k: "Proof card", v: "Shareable public verify link" },
      { k: "Draft history", v: "Revisions captured across every session" },
      { k: "Status", v: "Authorship proven, dispute closed" },
    ],
  },
} as const;

type AudienceKey = keyof typeof audiences;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export default function Home() {
  const [activeAudience, setActiveAudience] = useState<AudienceKey>("universities");
  const audience = audiences[activeAudience];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      {/* ── Ambient background field ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[640px] overflow-hidden">
        <div className="absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-violet-200/50 via-sky-100/40 to-transparent blur-3xl" />
        <div className="absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-emerald-100/40 via-slate-100/40 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ═══════════ Hero ═══════════ */}
        <section className="relative overflow-hidden px-6 pt-14 pb-20 sm:pt-20 lg:pt-24 lg:pb-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-violet-200/70 bg-violet-50/80 px-4 py-1.5 text-xs font-semibold text-violet-800 shadow-sm backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-violet-600" />
                The standard for verifiable academic integrity
              </div>

              <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-[3.75rem]">
                Authorship you
                <br />
                can{" "}
                <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-600 bg-clip-text font-[family-name:var(--font-display)] font-normal italic text-transparent">
                  prove.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Veritas seals academic writing with verifiable integrity. Prove authorship,
                build trust, and uphold excellence — with evidence, not probabilities.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Get started
                  <ArrowIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <DocIcon className="h-4 w-4 text-slate-500" />
                  Verify document
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-200/80 pt-7 text-xs font-medium text-slate-500">
                {["Zero false-positive accusations", "Canvas & Moodle LTI 1.3", "Offline cryptographic proof"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-emerald-600" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Sealed document mock */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
              <div className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-r from-violet-300/40 via-sky-300/30 to-emerald-300/30 blur-xl" />
              <div className="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_25px_80px_-20px_rgba(99,102,241,0.35)]">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 shadow-lg shadow-violet-500/30">
                    <ShieldCheckIcon className="h-7 w-7 text-white" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="h-2.5 w-full rounded-full bg-slate-100" />
                  <div className="h-2.5 w-[92%] rounded-full bg-slate-100" />
                  <div className="h-2.5 w-[78%] rounded-full bg-slate-100" />
                  <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100" />
                  <div className="h-2.5 w-[88%] rounded-full bg-slate-100" />
                  <div className="h-2.5 w-[55%] rounded-full bg-slate-100" />
                </div>

                <div className="mt-7 flex items-end justify-between">
                  <div className="font-[family-name:var(--font-display)] text-2xl italic text-violet-400/90">
                    Signature
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
                    <CheckIcon className="h-3.5 w-3.5" />
                    Sealed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ Evidence vs probability ═══════════ */}
        <section className="border-t border-slate-100 bg-slate-50/70 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-700">
                Why Veritas
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Detectors guess. Veritas documents the path.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
                Most tools judge the finished page. Veritas records how it was written, then
                seals that record so institutions, publishers, and reviewers can trust the work
                after it leaves the author&apos;s hands.
              </p>
            </div>

            <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
                <div className="p-6 sm:p-7">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Dimension
                  </span>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Process evidence vs. static statistical scoring.
                  </p>
                </div>
                <div className="border-violet-100 bg-violet-50/40 p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-violet-600" />
                    <span className="text-base font-semibold text-violet-950">Veritas</span>
                  </div>
                  <span className="mt-1 block text-xs text-violet-700">
                    Living evidence & cryptographic proof
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-slate-700">Legacy detectors</span>
                  </div>
                  <span className="mt-1 block text-xs text-slate-400">
                    Opaque statistical scoring
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {comparisonRows.map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-1 divide-y divide-slate-100 transition-colors hover:bg-slate-50/60 md:grid-cols-3 md:divide-x md:divide-y-0"
                  >
                    <div className="flex items-center p-6 text-sm font-semibold text-slate-900 sm:px-7">
                      {row.feature}
                    </div>
                    <div className="flex items-start gap-2 bg-violet-50/20 p-6 text-sm leading-6 text-slate-800 sm:px-7">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {row.veritas}
                    </div>
                    <div className="flex items-start gap-2 p-6 text-sm leading-6 text-slate-500 sm:px-7">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
                      {row.traditional}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ Capabilities ═══════════ */}
        <section className="border-t border-slate-100 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-700">
                Platform
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Everything required for authorship integrity
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Process capture and cryptographic sealing are foundational. AI analysis,
                similarity, proctoring, and LMS integration strengthen the same integrity
                story — never replace it.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <div
                  key={c.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-950/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600">
                      {c.badge}
                    </span>
                    <span className="text-[11px] font-bold text-violet-600">{c.stat}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 transition group-hover:text-violet-900">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ Workflow ═══════════ */}
        <section className="border-t border-slate-100 bg-slate-50/70 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-700">
                Workflow
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                From assignment to verified submission
              </h2>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-md"
                >
                  <span className="text-sm font-bold text-violet-600">{s.step}</span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{s.description}</p>
                  <span className="mt-4 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {s.role}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-6 text-center">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <CheckIcon className="h-4 w-4" />
                Fair review guarantee
              </span>
              <p className="mt-2 text-sm font-medium leading-6 text-emerald-950">
                Flags are evidence for review, not automatic verdicts. Students can examine the
                factors, engage instructors, and pursue appeals under institutional policy.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ Audiences ═══════════ */}
        <section className="border-t border-slate-100 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-700">
                  Who we serve
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Designed for institutions, publishers, and authors
                </h2>
              </div>

              <div
                role="tablist"
                aria-label="Audience selector"
                className="flex items-center gap-1 rounded-xl bg-slate-100 p-1.5"
              >
                {(
                  [
                    ["universities", "Universities"],
                    ["publishers", "Publishers"],
                    ["authors", "Authors"],
                  ] as [AudienceKey, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={activeAudience === id}
                    onClick={() => setActiveAudience(id)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      activeAudience === id
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-950/5 sm:p-12 lg:grid-cols-2">
              <div key={activeAudience}>
                <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
                  {audience.chip}
                </span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  {audience.heading}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{audience.intro}</p>

                <ul className="mt-6 space-y-3">
                  {audience.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                      {b}
                    </li>
                  ))}
                </ul>

                <Link
                  href={audience.cta.href}
                  className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800"
                >
                  {audience.cta.label}
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Snapshot
                </div>
                {audience.panel.map((row) => (
                  <div
                    key={row.k}
                    className="rounded-lg border border-slate-200 bg-white p-3.5 font-mono text-xs text-slate-700"
                  >
                    <span className="font-bold text-violet-700">{row.k}:</span> {row.v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ Final CTA ═══════════ */}
        <section className="relative overflow-hidden border-t border-slate-100 bg-slate-950 px-6 py-16 text-white md:py-24">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/30 blur-[120px]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Ready to prove authorship?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Start free today, verify a sealed package, or talk with us about campus
              deployment.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition hover:scale-[1.02] hover:bg-slate-100"
              >
                Get started
              </Link>
              <Link
                href="/verify"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Verify document
              </Link>
              <Link
                href="/universities"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Request campus pilot
              </Link>
            </div>

            <div className="mt-11 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
              <span>No credit card required</span>
              <span className="text-slate-600">•</span>
              <span>Student privacy first</span>
              <span className="text-slate-600">•</span>
              <span>Ed25519 cryptographic standard</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
