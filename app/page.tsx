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

function CampusArt() {
  return (
    <svg viewBox="0 0 640 360" className="h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" /><stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" /><stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      <rect width="640" height="360" rx="24" fill="url(#sky)" />
      <ellipse cx="320" cy="300" rx="380" ry="90" fill="url(#hill)" opacity="0.9" />
      <path d="M0 220 Q160 160 320 200 T640 180 L640 360 L0 360 Z" fill="#22c55e" opacity="0.35" />
      <rect x="80" y="150" width="120" height="90" rx="4" fill="#f8fafc" stroke="#94a3b8" />
      <rect x="90" y="160" width="28" height="24" fill="#7dd3fc" />
      <rect x="128" y="160" width="28" height="24" fill="#7dd3fc" />
      <rect x="166" y="160" width="28" height="24" fill="#7dd3fc" />
      <path d="M70 150 L140 100 L210 150 Z" fill="#0ea5e9" />
      <rect x="420" y="140" width="100" height="100" rx="4" fill="#f1f5f9" stroke="#64748b" />
      <rect x="435" y="155" width="30" height="22" fill="#a5f3fc" />
      <rect x="475" y="155" width="30" height="22" fill="#a5f3fc" />
      <circle cx="160" cy="95" r="28" fill="#fef08a" opacity="0.7" />
      <circle cx="280" cy="200" r="36" fill="#4ade80" />
      <circle cx="340" cy="190" r="42" fill="#22c55e" />
      <circle cx="400" cy="205" r="30" fill="#86efac" />
      <rect x="275" y="220" width="10" height="40" fill="#854d0e" />
      <rect x="335" y="215" width="12" height="45" fill="#854d0e" />
      <rect x="250" y="280" width="120" height="10" rx="2" fill="#334155" />
      <rect x="255" y="290" width="8" height="20" fill="#334155" />
      <rect x="357" y="290" width="8" height="20" fill="#334155" />
      <circle cx="290" cy="260" r="12" fill="#fcd34d" />
      <rect x="278" y="270" width="24" height="28" rx="6" fill="#0ea5e9" />
      <circle cx="330" cy="258" r="12" fill="#fdba74" />
      <rect x="318" y="268" width="24" height="28" rx="6" fill="#6366f1" />
      <path d="M300 285 L320 278 L340 285 L320 292 Z" fill="#fff" stroke="#94a3b8" />
    </svg>
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
              <span>AI & plagiarism</span><span className="text-cyan-300">·</span>
              <span>Proctored sessions</span><span className="text-cyan-300">·</span>
              <span>LMS · Seal</span>
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Trust the process. Safeguard the result.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Veritas is the academic integrity platform that records how work is written, detects AI and plagiarism,
              runs proctored assignments and objective checks, connects to Canvas and Moodle via LTI, and seals
              submissions so universities can verify authenticity end to end.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800">Start free</Link>
              <Link href="/universities" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">For universities</Link>
              <Link href="/verify" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">Verify a sealed package</Link>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.1)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              {["Process record", "AI signals", "Plagiarism", "Proctor events", "Seal ready"].map((chip) => (
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
                    { t: "Proctor clean", m: "No tab switches", c: "bg-amber-500" },
                    { t: "Ready to seal", m: "Hash locked", c: "bg-emerald-500" },
                  ].map((row, i) => (
                    <div key={row.t} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${row.c}`}>{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">{row.t}</div>
                        <div className="text-xs text-slate-500">{row.m}</div>
                      </div>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 sm:w-24">
                        <div className={`h-full ${row.c}`} style={{ width: `${70 + i * 6}%` }} />
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
                  <div className="rounded-lg bg-white py-2 ring-1 ring-slate-100"><div className="text-amber-600">2%</div><div className="text-slate-500">AI cue</div></div>
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
            Not just an AI detector. Process monitoring, proctored writing, LMS integration, plagiarism,
            objective questions, cryptographic sealing, and public verification — in one stack.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Process monitoring", d: "Keystrokes, pastes, focus loss, timing, and revision structure — a living composition trail behind every draft." },
              { t: "AI detection & assistance", d: "Segment-level AI scores and assistance levels so review is specific, not a single opaque label." },
              { t: "Plagiarism & corpus", d: "Similarity against institutional corpus and prior submissions, with source matches beside the text." },
              { t: "Proctored assignments", d: "Secure sessions with visibility, fullscreen, and focus events. Honest browser evidence — not false claims of perfect lockdown." },
              { t: "Canvas, Moodle & LTI", d: "LTI Advantage 1.3 launch into Veritas. Faculty create assignments in their LMS; students write with full integrity capture." },
              { t: "Authentication & seal", d: "SHA-256 + Ed25519 sealed .veritas packages. Anyone can verify integrity after handoff on the public verify page." },
              { t: "Objective questions", d: "Timed quizzes and objective checks alongside writing assignments — one assignment model for mixed assessment." },
              { t: "University multi-tenant", d: "Institutional domains, free student writing when onboarded, faculty review queues, admin analytics, and policy controls." },
              { t: "Fairness & appeals", d: "Flags are evidence for review, not verdicts. Students can read factors, talk to instructors, and file appeals." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                <div className="text-lg font-[family-name:var(--font-display)] font-semibold text-slate-900">{c.t}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber-300">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-xl">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                  </span>
                  <span className="text-base font-bold text-slate-900">AI Detected</span>
                </div>
                <p className="text-sm text-slate-600">We believe this document is mainly AI-generated, with some AI-assisted and human written content</p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Breakdown</span><span className="rounded-full bg-slate-100 px-2 py-0.5">Veritas</span>
                </div>
                <div className="mt-2"><Gauge percent={80} label="AI-Generated" color="#ef4444" /></div>
                <div className="mt-3 flex flex-wrap justify-center gap-3 text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1 text-rose-600"><span className="h-2 w-2 rounded-full bg-rose-500" /> 80.2% AI</span>
                  <span className="inline-flex items-center gap-1 text-amber-600"><span className="h-2 w-2 rounded-full bg-amber-400" /> 15.8% Assisted</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> 4% Human</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-slate-900 md:text-5xl">AI segment analysis</h2>
              <p className="mt-4 text-base leading-7 text-slate-800/80">
                Not a single score. See how much of the document is AI-generated vs assisted vs human — at segment level —
                next to the process record so review stays fair and specific.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-fuchsia-200">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative min-h-[280px]">
              <div className="absolute -right-2 top-4 z-10 w-[90%] max-w-sm rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Segment result</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">High confidence</span>
                </div>
                <div className="flex justify-center py-2">
                  <div className="relative h-28 w-28">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-[135deg]">
                      <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeDasharray="226 301" strokeLinecap="round" />
                      <circle cx="60" cy="60" r="48" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray="120 301" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-center text-sm font-bold text-amber-700">Moderately<br />AI Assisted</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-600">The segment is moderately edited by AI.</p>
              </div>
              <div className="mt-20 space-y-3 opacity-70">
                <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
                  <div className="text-xs font-semibold text-amber-700">Lightly AI Assisted</div>
                  <div className="text-[11px] text-slate-500">Light edits detected.</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-slate-900 md:text-5xl">AI assistance levels</h2>
              <p className="mt-4 text-base leading-7 text-slate-800/80">
                Distinguish fully human, lightly assisted, moderately assisted, and fully AI-generated writing.
                Process monitoring sits beside these labels so faculty can have evidence-based conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-800">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="rounded-[28px] bg-stone-700/80 p-5 ring-1 ring-white/10">
                <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600 shadow-lg">
                  <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-cyan-900">The challenge for instructors isn't simply about banning technology</span>{" "}
                  but rather about reimagining assessment in an age of AI assistance.
                  <div className="mt-2 text-[11px] text-slate-400">Source match ↗</div>
                </div>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Source</div>
                  <div className="mt-1 text-sm font-bold text-slate-900">Institutional corpus</div>
                  <div className="mt-1 truncate text-xs text-cyan-700">Prior submissions · library references</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-white md:text-5xl">Plagiarism + AI in one pass</h2>
              <p className="mt-4 text-base leading-7 text-stone-300">
                Check plagiarism and AI together. Matches against your institutional corpus and prior work appear
                beside process evidence — so integrity is one conversation, not three tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proctored writing</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl">Secure sessions with honest browser evidence</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Turn on proctoring for high-stakes assignments. Veritas records visibility changes, focus loss,
                fullscreen exits, and paste events. We do not claim to block second devices — we give faculty
                a clear event log they can defend.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Visibility & blur timeline</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Fullscreen session option</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Copy/paste and focus risk scores</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Works with timed writing & objective questions</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">LMS & authentication</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl">Canvas, Moodle, and LTI Advantage</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Launch Veritas from your LMS with LTI 1.3. Students authenticate through the campus platform;
                faculty create assignments and review evidence without leaving their workflow. Multi-tenant
                institutions get domain-based free student access once onboarded.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Canvas", "Moodle", "Brightspace", "LTI 1.3", "SSO-ready"].map((x) => (
                  <span key={x} className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200">{x}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-teal-950">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex justify-center">
              <div className="rounded-[28px] bg-white/10 p-10 ring-1 ring-white/15 backdrop-blur">
                <LogoMark size={100} />
                <div className="mt-4 text-center">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Sealed package</div>
                  <div className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white">.veritas export</div>
                  <div className="mt-2 text-xs text-teal-200">SHA-256 · Ed25519</div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">Authentication & verification</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-white md:text-5xl">Seal once. Verify anywhere.</h2>
              <p className="mt-4 text-base leading-7 text-teal-100/80">
                When work is ready, lock a signed package. Content hash and signature travel with the document.
                External reviewers, publishers, and employers upload the file to the public verify page —
                no account required — and confirm the submission was not altered after sealing.
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

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mb-8 flex flex-wrap gap-2">
            <Link href="/universities" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-100">AI Detector for Education</Link>
            <Link href="/publishers" className="rounded-2xl border border-transparent bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600">For publishers & enterprise</Link>
          </div>
          <div className="overflow-hidden rounded-[28px] shadow-lg ring-1 ring-slate-200"><CampusArt /></div>
          <h2 className="mt-10 font-[family-name:var(--font-display)] text-3xl text-slate-900 md:text-4xl">For teachers & campuses</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Onboard your institution once. Students with your domain write free. Faculty create assignments,
            invite by email, run timed or proctored sessions, review evidence packages, and seal outcomes.
            Admins get analytics, policy controls, and audit trails.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/universities" className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">Explore education →</Link>
            <Link href="/onboarding?intent=institution" className="inline-flex rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Discuss institutional pricing</Link>
          </div>
        </div>
      </section>

      <section className="bg-teal-950">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <span className="inline-block rounded bg-cyan-400/20 px-2.5 py-1 text-xs font-bold text-cyan-300">Why Veritas</span>
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-tight text-white md:text-5xl">How is Veritas different?</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-teal-100/80">
            Detectors stop at a label. Veritas records process, runs proctored sessions, checks plagiarism and AI,
            integrates with your LMS, then seals the outcome — so institutions can trust how work was done and
            protect what was submitted.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Process is the missing layer", d: "Living composition trail — the evidence almost no AI detector captures." },
              { t: "Proctoring with honesty", d: "Browser session evidence faculty can defend. No false promises of total lockdown." },
              { t: "LMS-native", d: "LTI Advantage for Canvas, Moodle, and more. Launch from the gradebook workflow." },
              { t: "AI + plagiarism together", d: "Segment assistance levels and source matches in one report." },
              { t: "Cryptographic seal", d: "SHA-256 and Ed25519 packages verifiable by anyone after handoff." },
              { t: "Fairness by design", d: "Flags invite conversation. Appeals and methodology are public-facing." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-lg font-[family-name:var(--font-display)] text-white">{c.t}</div>
                <p className="mt-2 text-sm leading-6 text-teal-100/70">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4">
          {[["430+", "Institutions & teams"], ["2.4M+", "Documents processed"], ["99.97%", "Seal verification accuracy"], ["2.1s", "Average verify time"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-black text-slate-900 md:text-4xl">{v}</div>
              <div className="mt-1 text-sm text-slate-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-[28px] bg-slate-900 px-8 py-14 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,211,238,0.3),_transparent_50%)]" />
          <h2 className="relative font-[family-name:var(--font-display)] text-3xl text-white md:text-5xl">
            Bring process, proctoring, and sealed trust to your campus
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-slate-300">
            Start free as an individual, or onboard your university for domain-wide student access,
            LMS launch, and faculty review tools.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 hover:bg-cyan-50">Create an account</Link>
            <Link href="/universities" className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10">University solutions</Link>
            <Link href="/pricing" className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10">Pricing</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
