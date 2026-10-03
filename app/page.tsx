"use client";

import Link from "next/link";
import { CryptographicSealSpinner } from "./components/CryptographicSealSpinner";

const pillars = [
  {
    title: "Process, not percentages",
    body: "A silent, privacy-first composition trail — keystrokes, timing, pastes, revisions — so review is grounded in how work was made, not an opaque score.",
  },
  {
    title: "Cryptographic proof",
    body: "Content and evidence lock into a portable .veritas package signed with SHA-256 and Ed25519. Change a character; the seal breaks.",
  },
  {
    title: "Fair by design",
    body: "Flags are evidence for conversation, not automatic guilt. Students see factors. Instructors review context. Appeals stay possible.",
  },
];

const capabilities = [
  { title: "Living process trail", body: "Key events, focus, pastes, and revision structure captured as verifiable telemetry behind every draft." },
  { title: "Ed25519 + SHA-256 seal", body: "Portable packages anyone can verify on the public page — no account required." },
  { title: "Segment-level AI signals", body: "Assistance shown where it appears in the text, next to process evidence — never a single black-box number." },
  { title: "Similarity with sources", body: "Institutional corpus and prior work matches presented in context for attributable review." },
  { title: "Honest proctoring", body: "Visibility and focus signals designed for policy — not exaggerated claims of perfect lockdown." },
  { title: "Canvas & Moodle LTI", body: "Advantage 1.3 launch, multi-tenant campuses, faculty queues, free writing for onboarded students." },
];

const steps = [
  { n: "01", title: "Assign", body: "Create writing tasks in Veritas or launch from Canvas / Moodle." },
  { n: "02", title: "Compose", body: "Students write; the process trail records quietly in the background." },
  { n: "03", title: "Review", body: "One shared record: process, AI segments, similarity, session events." },
  { n: "04", title: "Seal", body: "Export a signed package. Verify anywhere, forever." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-sky-500/[0.06] blur-[120px]" />
      </div>

      <div className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24 lg:pb-32 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Cryptographic authorship proof
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              Stop guessing if AI wrote it.
              <br />
              <span className="text-zinc-400">Prove how it was built.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Veritas records a silent process trail as writing happens, then seals content and
              evidence into a portable cryptographic package. Code has Git. Writing should have proof.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Start free
              </Link>
              <Link
                href="/verify"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-6 text-sm font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                Verify a package
                <span className="font-mono text-xs text-zinc-500">.veritas</span>
              </Link>
            </div>
          </div>

          {/* Living seal + package terminal */}
          <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-10 sm:gap-12">
            <CryptographicSealSpinner
              state="success"
              size="lg"
              hashPreview="sha256:a3f8…c91e"
            />

            <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/50">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="ml-3 font-mono text-[11px] text-zinc-500">submission.veritas</span>
              </div>
              <div className="space-y-3 p-5 font-mono text-[13px] leading-relaxed sm:p-6 sm:text-sm">
                <p className="text-zinc-500">
                  <span className="text-emerald-400">✓</span> seal.verified
                </p>
                <p className="text-zinc-400">
                  <span className="text-zinc-600">algorithm</span>{" "}
                  <span className="text-sky-300">Ed25519</span>
                  <span className="text-zinc-600"> · hash </span>
                  <span className="text-sky-300">SHA-256</span>
                </p>
                <p className="break-all text-zinc-500">
                  <span className="text-zinc-600">digest</span> a3f8c91e…7b2d
                </p>
                <p className="text-zinc-400">
                  <span className="text-zinc-600">process_events</span>{" "}
                  <span className="text-white">14,290</span>
                  <span className="text-zinc-600"> · composition_span </span>
                  <span className="text-white">3h 42m</span>
                </p>
                <p className="text-zinc-400">
                  <span className="text-zinc-600">integrity</span>{" "}
                  <span className="text-emerald-400">intact</span>
                  <span className="text-zinc-600"> · public_verify </span>
                  <span className="text-emerald-400">true</span>
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4 text-zinc-500">
                  <span className="inline-flex h-5 items-center rounded bg-emerald-500/15 px-2 text-[11px] font-medium text-emerald-400">
                    SEALED
                  </span>
                  <span className="text-[11px]">Anyone can verify. No account required.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              The end of the guessing game
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built for proof of human effort — not another detector score
            </h2>
            <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {pillars.map((p) => (
                <div key={p.title} className="bg-[#0a0a0a] p-8">
                  <h3 className="text-base font-medium text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Platform</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Everything that strengthens the same integrity story
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">
                Process and seal first. AI, similarity, proctoring, and LMS deepen the record — they never replace it.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-emerald-500/30 hover:bg-white/[0.04]"
                >
                  <h3 className="text-sm font-medium text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              From assignment to verified submission
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n} className="border-t border-white/15 pt-6">
                  <span className="font-mono text-xs text-emerald-400">{s.n}</span>
                  <h3 className="mt-3 text-lg font-medium text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{s.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-14 max-w-2xl text-sm leading-7 text-zinc-500">
              Flags are evidence for review, not verdicts. Students can read every factor, talk to
              instructors, and appeal under institutional policy.
            </p>
          </div>
        </section>

        {/* Audiences */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Who it's for</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Institutions, publishers, authors
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  href: "/universities",
                  t: "Universities",
                  d: "Multi-tenant campuses, LTI into Canvas and Moodle, faculty review, free student writing when onboarded.",
                },
                {
                  href: "/publishers",
                  t: "Publishers",
                  d: "Editorial queues and sealed packages so inbound work arrives with verifiable provenance — not screenshots.",
                },
                {
                  href: "/register",
                  t: "Authors",
                  d: "Monitor process, seal work, and prove authorship when journals or schools ask for integrity you can show.",
                },
              ].map((a) => (
                <Link
                  key={a.t}
                  href={a.href}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <h3 className="text-base font-medium text-white group-hover:text-emerald-300">{a.t}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{a.d}</p>
                  <span className="mt-5 inline-block text-sm text-zinc-500 group-hover:text-emerald-400">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center lg:py-24">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to prove authorship?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">
              Start free, verify a sealed package, or explore campus deployment.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Start free
              </Link>
              <Link
                href="/verify"
                className="inline-flex h-11 items-center rounded-lg border border-white/15 px-6 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06]"
              >
                Verify package
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-lg border border-white/15 px-6 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06]"
              >
                Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
