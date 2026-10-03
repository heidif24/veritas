"use client";

import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    n: "01",
    title: "Process monitoring",
    body: "Capture how every draft is composed — keystrokes, pastes, focus changes, timing, and revision structure — as a living evidence trail, not a single score.",
    pill: "Living telemetry",
  },
  {
    n: "02",
    title: "Cryptographic seal",
    body: "Lock content and process evidence into a portable .veritas package signed with SHA-256 and Ed25519. Integrity remains verifiable long after submission.",
    pill: "Ed25519 & SHA-256",
  },
  {
    n: "03",
    title: "AI segment analysis",
    body: "Review AI-generated and AI-assisted passages at segment level, alongside human process evidence, so decisions stay specific and defensible.",
    pill: "Segment granularity",
  },
  {
    n: "04",
    title: "Similarity & corpus",
    body: "Compare work against institutional repositories and prior submissions with source matches shown in context — clear, attributable, review-ready.",
    pill: "Attributable context",
  },
  {
    n: "05",
    title: "Proctored sessions",
    body: "Optional session signals for visibility, fullscreen, and focus. Honest browser evidence designed for academic policy — not exaggerated lockdown claims.",
    pill: "Privacy-first signals",
  },
  {
    n: "06",
    title: "Campus & LMS",
    body: "LTI Advantage 1.3 for Canvas and Moodle, multi-tenant institutions, faculty review queues, and free unlimited writing for onboarded students.",
    pill: "Canvas & Moodle LTI",
  },
];

const steps = [
  {
    n: "01",
    title: "Assign",
    body: "Faculty create writing or mixed assessments in Veritas, or launch from Canvas and Moodle with optional proctoring and timers.",
  },
  {
    n: "02",
    title: "Compose",
    body: "Students write while process evidence, AI signals, and similarity checks record quietly in the background.",
  },
  {
    n: "03",
    title: "Review",
    body: "Instructors examine one shared record — process, assistance, similarity, and session events — and treat flags as grounds for conversation.",
  },
  {
    n: "04",
    title: "Seal",
    body: "Export a signed package that binds document and evidence together. Anyone can verify authenticity on the public verify page.",
  },
];

function RotatingSeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <path id="veritas-ring" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8" />
      <g className="spin-slow" style={{ transformOrigin: "100px 100px" }}>
        <text fontSize="10.5" letterSpacing="4.5" fill="currentColor" className="font-mono uppercase font-semibold">
          <textPath href="#veritas-ring">VERITAS · SEALED · ED25519 · SHA-256 · VERIFIED ·</textPath>
        </text>
      </g>
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontSize="48"
        fill="currentColor"
        fontStyle="italic"
        className="font-[family-name:var(--font-display)]"
      >
        V
      </text>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      {/* ── Soft glowing ambient field ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[720px] overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-violet-200/45 via-sky-100/35 to-transparent blur-3xl" />
        <div className="absolute -left-32 top-32 h-[460px] w-[460px] rounded-full bg-gradient-to-tr from-emerald-100/35 via-amber-50/40 to-transparent blur-3xl" />
        <div className="absolute right-1/3 top-72 h-[340px] w-[340px] rounded-full bg-gradient-to-bl from-indigo-100/30 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ── Hero (Pictorial Floating Representation) ── */}
        <section className="relative overflow-hidden px-6 pt-12 pb-20 sm:pt-20 lg:pt-24 lg:pb-32">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1 text-xs font-semibold text-violet-800 shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-600" />
                Academic authorship verification
              </div>

              <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[3.75rem]">
                Authorship you
                <br />
                can{" "}
                <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-600 bg-clip-text font-[family-name:var(--font-display)] font-normal italic text-transparent">
                  prove
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Veritas seals academic writing with verifiable integrity.
                <br className="hidden sm:block" />
                Prove authorship. Build trust. Uphold excellence.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Get started
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Verify document
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200/80 pt-6 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ed25519 & SHA-256 sealed
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  LTI 1.3 Canvas & Moodle
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Client-side process trail
                </span>
              </div>
            </div>

            {/* Pictorial Floating Card Representation */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              {/* Outer soft aura */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-violet-300/30 via-sky-200/30 to-amber-200/30 blur-2xl" />

              {/* Main floating artwork card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-3 shadow-[0_25px_70px_-15px_rgba(30,41,59,0.18)] transition-all duration-300 hover:shadow-[0_30px_80px_-15px_rgba(99,102,241,0.25)]">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src="/veritas-hero-illustration.jpg"
                    alt="Sealed academic document floating among sculptural green and gold ribbons"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Top floating pill */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-md">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                      Integrity verified
                    </span>
                  </div>

                  {/* Bottom floating telemetry chip */}
                  <div className="absolute bottom-4 left-4 right-16 flex items-center justify-between rounded-xl border border-white/80 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        14,290 verified events
                      </span>
                    </div>
                    <span className="rounded bg-violet-100/80 px-2 py-0.5 font-mono text-[10px] font-bold text-violet-800">
                      SHA-256
                    </span>
                  </div>
                </div>

                {/* Overlapping spinning seal */}
                <div className="absolute -bottom-5 -right-5 z-20 flex h-28 w-28 items-center justify-center rounded-full border border-amber-200/80 bg-white p-2 shadow-xl shadow-amber-900/10 sm:h-32 sm:w-32">
                  <RotatingSeal className="h-full w-full text-amber-700/85" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Veritas (Floating Cards) ── */}
        <section className="border-t border-slate-100 bg-slate-50/70 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
                Why Veritas
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Integrity that survives handoff
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
                Most tools judge the finished page. Veritas documents the path that produced it,
                then seals that record so institutions, publishers, and reviewers can trust the
                work after it leaves the author&apos;s hands.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {[
                {
                  t: "Evidence, not labels",
                  d: "Process trails, segment-level AI signals, and similarity matches support fair review — not opaque one-line verdicts.",
                  badge: "Process trails",
                  accent: "from-violet-500/10 to-transparent",
                },
                {
                  t: "Portable verification",
                  d: "Signed packages travel with the document. Anyone can confirm integrity on the public verify page, no account required.",
                  badge: "Zero account needed",
                  accent: "from-sky-500/10 to-transparent",
                },
                {
                  t: "Built for campuses",
                  d: "Multi-tenant institutions, LTI for Canvas and Moodle, faculty queues, and free student writing when your university is onboarded.",
                  badge: "Turnkey LTI 1.3",
                  accent: "from-emerald-500/10 to-transparent",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-950/5"
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${item.accent}`} />
                  <div className="relative z-10">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] font-semibold text-slate-700">
                      {item.badge}
                    </span>
                    <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-violet-900 transition-colors">
                      {item.t}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Capabilities (Grid of Floating Cards) ── */}
        <section className="border-t border-slate-100 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
                Platform
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Everything required for authorship integrity
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Process capture and cryptographic sealing are foundational. AI analysis, similarity,
                proctoring, and LMS integration strengthen the same integrity story — never replace it.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <div
                  key={c.title}
                  className="group relative rounded-2xl border border-slate-200/90 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-950/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-violet-600">{c.n}</span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                      {c.pill}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-violet-900 transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-slate-600">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cryptographic Seal Band ── */}
        <section className="relative overflow-hidden border-t border-slate-900 bg-slate-950 px-6 py-20 text-white lg:py-24">
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[auto_1fr]">
            <div className="flex justify-center">
              <div className="rounded-full border border-amber-500/30 bg-white/5 p-4 backdrop-blur shadow-2xl">
                <RotatingSeal className="h-40 w-40 text-amber-300" />
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
                Cryptographic Attestation
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-normal italic tracking-tight md:text-5xl lg:text-6xl text-white">
                Seal once. Verify anywhere.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                The process trail and the content are locked together. Change a single character and the seal breaks.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
                >
                  Try document verification
                  <span aria-hidden="true">→</span>
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs text-slate-300 backdrop-blur">
                  <span className="text-emerald-400">✓</span> sha256:a3f8…c91e · ed25519 verified
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works (Floating Step Cards) ── */}
        <section className="border-t border-slate-100 bg-slate-50/70 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
                Workflow
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                From assignment to verified submission
              </h2>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <span className="font-mono text-xs font-bold text-violet-600">{s.n}</span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{s.body}</p>
                </div>
              ))}
            </div>

            <blockquote className="mx-auto mt-16 max-w-3xl text-center font-[family-name:var(--font-display)] text-2xl italic leading-relaxed text-slate-700 md:text-3xl">
              “Flags are evidence for review, not automatic verdicts. Students can examine factors,
              engage instructors, and pursue appeals under institutional policy.”
            </blockquote>
          </div>
        </section>

        {/* ── Audiences (Universities, Publishers, Authors) ── */}
        <section className="border-t border-slate-100 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
                Who we serve
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Designed for institutions, publishers, and authors
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {/* Universities */}
              <Link
                href="/universities"
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-950/5"
              >
                <div>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
                    Institutions
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                    Universities
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Multi-tenant campuses, LTI launch into Canvas and Moodle, faculty review workflows,
                    and unlimited free writing for enrolled students.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-violet-600">
                  <span>Explore campus</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>

              {/* Publishers */}
              <Link
                href="/publishers"
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-950/5"
              >
                <div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                    Editorial
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    Publishers
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Editorial queues, sealed submission packages, and verifiable integrity for inbound
                    manuscripts — without relying on screenshots or trust alone.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-sky-600">
                  <span>For publishers</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>

              {/* Authors */}
              <Link
                href="/register"
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5"
              >
                <div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Researchers
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Authors
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Independent writers and researchers can monitor process, seal work, and prove
                    authorship when institutions or journals ask for verifiable integrity.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  <span>Start free</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative overflow-hidden border-t border-slate-100 bg-slate-950 px-6 py-20 text-center text-white md:py-24">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />

          <div className="relative mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Ready to prove authorship?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              Start free today, verify a sealed package, or speak with us about campus deployment.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition hover:bg-slate-100 hover:scale-[1.02]"
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
                href="/pricing"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
