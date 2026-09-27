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
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.14),_transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-800 shadow-sm">
              <span>Process monitoring</span><span className="text-cyan-300">·</span>
              <span>Cryptographic seal</span><span className="text-cyan-300">·</span>
              <span>AI & plagiarism</span><span className="text-cyan-300">·</span>
              <span>Proctor · LMS</span>
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Trust the process. Safeguard the result.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Process monitoring and cryptographic sealing are the core of Veritas — a living composition trail
              locked into a portable, verifiable package. AI detection, plagiarism, proctored assignments,
              Canvas & Moodle LTI, and fairness tools strengthen that foundation for universities and publishers.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800">Start free</Link>
              <Link href="/universities" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">For universities</Link>
              <Link href="/verify" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">Verify a sealed package</Link>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.1)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              {["Process record", "Seal ready", "AI signals", "Plagiarism", "Proctor events"].map((chip) => (
                <span key={chip} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">{chip}</span>
              ))}
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Composition timeline</p>
                <div className="mt-4 space-y-3">
                  {[
                    { t: "Sources & citations", m: "3 references linked", c: "bg-cyan-500" },
                    { t: "Draft revisions", m: "12 sessions", c: "bg-sky-500" },
                    { t: "Similarity pass", m: "Low overlap", c: "bg-violet-500" },
                    { t: "Proctor clean", m: "No tab switches", c: "bg-violet-500" },
                    { t: "Ready to seal", m: "Hash locked", c: "bg-emerald-500" },
                  ].map((row, i) => (
                    <div key={row.t} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${row.c}`}>{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">{row.t}</div>
                        <div className="text-xs text-slate-500">{row.m}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-b from-slate-50 to-cyan-50/50 p-5 ring-1 ring-slate-100">
                <div className="mb-2 flex items-center gap-2">
                  <LogoMark size={32} />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Authorship report</div>
                    <div className="text-sm font-bold text-slate-900">Process intact</div>
                  </div>
                </div>
                <Gauge percent={94} label="Human process" color="#0ea5e9" />
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold">
                  <div className="rounded-lg bg-white py-2 ring-1 ring-slate-100"><div className="text-cyan-600">94%</div><div className="text-slate-500">Process</div></div>
                  <div className="rounded-lg bg-white py-2 ring-1 ring-slate-100"><div className="text-violet-600">4%</div><div className="text-slate-500">Similar</div></div>
                  <div className="rounded-lg bg-white py-2 ring-1 ring-slate-100"><div className="text-violet-600">2%</div><div className="text-slate-500">AI cue</div></div>
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
