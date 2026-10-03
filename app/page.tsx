"use client";

import Link from "next/link";
import { useLocale } from "./components/locale-provider";
import { LogoMark } from "./components/veritas-logo";

function Gauge({ percent, label, color }: { percent: number; label: string; color: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c * 0.75;
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-[135deg]">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" strokeDasharray={`${c * 0.75} ${c}`} strokeLinecap="round" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12" strokeDasharray={`${c * 0.75} ${c}`} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-900">{percent}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen text-slate-900">
      {/* Hero — premium, clean, inspired by sealed-document design */}
      <section className="relative overflow-hidden border-b border-slate-100">
        {/* Soft purple / blue gradient blobs */}
        <div className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-violet-200/50 via-sky-100/40 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-[380px] w-[380px] rounded-full bg-gradient-to-tr from-cyan-100/40 via-blue-50/30 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left: copy + CTAs */}
            <div className="max-w-xl">
              <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-slate-900 sm:text-6xl md:text-[3.75rem]">
                Authorship you<br className="hidden sm:block" /> can prove
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Veritas seals academic writing with verifiable integrity.
                Prove authorship. Build trust. Uphold excellence.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
                >
                  Get started
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Verify document
                </Link>
              </div>
            </div>

            {/* Right: sealed document card */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                {/* Decorative rings */}
                <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-br from-violet-200/30 via-sky-100/20 to-transparent blur-2xl" />
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border border-violet-200/60" />
                <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full border border-sky-200/50" />

                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_25px_80px_-15px_rgba(99,102,241,0.18)]">
                  {/* Shield icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 shadow-lg shadow-violet-500/25">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>

                  {/* Fake document lines */}
                  <div className="space-y-2.5">
                    <div className="h-2.5 w-full rounded-full bg-slate-100" />
                    <div className="h-2.5 w-[92%] rounded-full bg-slate-100" />
                    <div className="h-2.5 w-[85%] rounded-full bg-slate-100" />
                    <div className="h-2.5 w-[70%] rounded-full bg-slate-100" />
                    <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100" />
                    <div className="h-2.5 w-[88%] rounded-full bg-slate-100" />
                    <div className="h-2.5 w-[60%] rounded-full bg-slate-100" />
                  </div>

                  {/* Signature + Sealed badge */}
                  <div className="mt-8 flex items-end justify-between">
                    <div className="font-[family-name:var(--font-display)] text-2xl italic text-slate-400">
                      A. Rivera
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/80">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Sealed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">The whole platform</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-center font-[family-name:var(--font-display)] text-3xl text-slate-900 md:text-4xl">
            Everything a campus needs for authorship integrity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600">
            Process first. Seal always. Everything else — AI, plagiarism, proctoring, LMS — strengthens the same integrity story.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Process monitoring — primary", d: "Keystrokes, pastes, focus loss, timing, and revision structure — a living composition trail behind every draft. This is the core of Veritas." },
              { t: "Cryptographic seal — primary", d: "SHA-256 + Ed25519 sealed .veritas packages. Lock the process evidence with the document; anyone verifies integrity after handoff." },
              { t: "AI detection & assistance", d: "Segment-level AI scores and assistance levels so review is specific, not a single opaque label." },
              { t: "Plagiarism & corpus", d: "Similarity against institutional corpus and prior submissions, with source matches beside the text." },
              { t: "Proctored assignments", d: "Secure sessions with visibility, fullscreen, and focus events. Honest browser evidence — not false claims of perfect lockdown." },
              { t: "Canvas, Moodle & LTI", d: "LTI Advantage 1.3 launch into Veritas. Faculty create assignments in their LMS; students write with full integrity capture." },
              { t: "Objective questions", d: "Timed quizzes and objective checks alongside writing assignments — one assignment model for mixed assessment." },
              { t: "University multi-tenant", d: "Institutional domains, free student writing when onboarded, faculty review queues, admin analytics, and policy controls." },
              { t: "Fairness & appeals", d: "Flags are evidence for review, not verdicts. Students can read factors, talk to instructors, and file appeals." },
            ].map((card) => (
              <div key={card.t} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                <div className="text-lg font-[family-name:var(--font-display)] font-semibold text-slate-900">{card.t}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cyan-100">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-xl">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">AI Detected</span>
                </div>
                <p className="text-sm text-slate-600">Segment-level signals sit beside the process record — never a single opaque score.</p>
                <div className="mt-2"><Gauge percent={80} label="AI-Generated" color="#ef4444" /></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-slate-900 md:text-5xl">AI segment analysis</h2>
              <p className="mt-4 text-base leading-7 text-slate-800/80">
                Supporting process evidence — not the product. See AI-generated vs assisted vs human at segment level.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-slate-800/80 p-6">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Sealed package</div>
              <div className="mt-4 font-mono text-xs text-slate-300 break-all">sha256:a3f8…c91e · ed25519 verified</div>
              <div className="mt-4 text-sm text-slate-400">Process trail + content locked together.</div>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-white md:text-5xl">Seal once. Verify anywhere.</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                When work is ready, lock a signed package. Content hash and signature travel with the document.
                Anyone can verify on the public verify page — no account required.
              </p>
              <Link href="/verify" className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-cyan-300">Verify a sealed package →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">How it works</p>
          <h2 className="mt-3 text-center font-[family-name:var(--font-display)] text-4xl text-slate-900 md:text-5xl">From assignment to verified submission</h2>
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {[
              { n: "01", t: "Launch or create the assignment", d: "Faculty set writing or objective tasks in Veritas or via Canvas/Moodle LTI. Optional proctoring and timers." },
              { n: "02", t: "Students write with process capture", d: "Composition trail, AI/plagiarism signals, and proctor events record in the background while they draft." },
              { n: "03", t: "Review shared evidence", d: "Instructors see process, AI assistance, similarity, and session events together — flags invite conversation, not automatic guilt." },
              { n: "04", t: "Seal & safeguard", d: "Export a signed .veritas package. Hash and signature hold after handoff; anyone can verify on the public page." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm md:px-6">
                <div className="flex items-start gap-4">
                  <span className="font-[family-name:var(--font-display)] text-2xl text-cyan-600">{s.n}</span>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">{s.t}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{s.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900 md:text-4xl">Ready to trust the process?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">Start free, onboard your campus, or verify a sealed package today.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white hover:bg-slate-800">Start free</Link>
            <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">View pricing</Link>
            <Link href="/login" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Log in</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
