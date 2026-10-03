"use client";

import Link from "next/link";

const capabilities = [
  {
    title: "Process monitoring",
    body: "Capture how every draft is composed — keystrokes, pastes, focus changes, timing, and revision structure — as a living evidence trail, not a single score.",
  },
  {
    title: "Cryptographic seal",
    body: "Lock content and process evidence into a portable .veritas package signed with SHA-256 and Ed25519. Integrity remains verifiable long after submission.",
  },
  {
    title: "AI segment analysis",
    body: "Review AI-generated and AI-assisted passages at segment level, alongside human process evidence, so decisions stay specific and defensible.",
  },
  {
    title: "Similarity & corpus",
    body: "Compare work against institutional repositories and prior submissions with source matches shown in context — clear, attributable, review-ready.",
  },
  {
    title: "Proctored sessions",
    body: "Optional session signals for visibility, fullscreen, and focus. Honest browser evidence designed for academic policy — not exaggerated lockdown claims.",
  },
  {
    title: "Campus & LMS",
    body: "LTI Advantage 1.3 for Canvas and Moodle, multi-tenant institutions, faculty review queues, and free unlimited writing for onboarded students.",
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* —— Hero (matches reference layout) —— */}
      <section className="relative overflow-hidden">
        {/* Soft purple / blue gradient field */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-10 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-violet-200/50 via-sky-100/40 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-blue-100/50 via-indigo-50/30 to-transparent blur-3xl" />
          <div className="absolute right-[8%] top-[18%] h-72 w-72 rounded-full border border-violet-200/40" />
          <div className="absolute right-[18%] top-[28%] h-48 w-48 rounded-full border border-sky-200/50" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-28 lg:pt-20">
          {/* Copy */}
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[3.75rem]">
              Authorship you
              <br />
              can prove
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Veritas seals academic writing with verifiable integrity.
              <br className="hidden sm:block" />
              Prove authorship. Build trust. Uphold excellence.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
              >
                Get started
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
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
          </div>

          {/* Sealed document card */}
          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
            <div className="relative rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_25px_80px_-20px_rgba(99,102,241,0.35)]">
              <div className="mb-7 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 shadow-lg shadow-violet-500/30">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
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
              <div className="mt-8 flex items-end justify-between">
                <div className="font-[family-name:var(--font-display)] text-2xl italic text-violet-400/90">
                  Signature
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sealed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Value proposition —— */}
      <section className="border-t border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Why Veritas</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Integrity that survives handoff
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
              Most tools judge the finished page. Veritas documents the path that produced it,
              then seals that record so institutions, publishers, and reviewers can trust the
              work after it leaves the author's hands.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                t: "Evidence, not labels",
                d: "Process trails, segment-level AI signals, and similarity matches support fair review — not opaque one-line verdicts.",
              },
              {
                t: "Portable verification",
                d: "Signed packages travel with the document. Anyone can confirm integrity on the public verify page, no account required.",
              },
              {
                t: "Built for campuses",
                d: "Multi-tenant institutions, LTI for Canvas and Moodle, faculty queues, and free student writing when your university is onboarded.",
              },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.t}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— Capabilities —— */}
      <section className="border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Platform</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Everything required for authorship integrity
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Process capture and cryptographic sealing are foundational. AI analysis, similarity,
              proctoring, and LMS integration strengthen the same integrity story — never replace it.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-violet-200 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— How it works —— */}
      <section className="border-t border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Workflow</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              From assignment to verified submission
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="text-sm font-bold text-violet-600">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-2xl text-center text-base italic leading-7 text-slate-600">
            Flags are evidence for review, not automatic verdicts. Students can examine factors,
            engage instructors, and pursue appeals under institutional policy.
          </p>
        </div>
      </section>

      {/* —— Audiences —— */}
      <section className="border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Who we serve</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Designed for institutions, publishers, and authors
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Link
              href="/universities"
              className="group rounded-2xl border border-slate-200 bg-white p-8 transition hover:border-violet-300 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-slate-900 group-hover:text-violet-700">Universities</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Multi-tenant campuses, LTI launch into Canvas and Moodle, faculty review workflows,
                and unlimited free writing for enrolled students.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-violet-600">Explore campus →</span>
            </Link>
            <Link
              href="/publishers"
              className="group rounded-2xl border border-slate-200 bg-white p-8 transition hover:border-violet-300 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-slate-900 group-hover:text-violet-700">Publishers</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Editorial queues, sealed submission packages, and verifiable integrity for inbound
                manuscripts — without relying on screenshots or trust alone.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-violet-600">For publishers →</span>
            </Link>
            <Link
              href="/register"
              className="group rounded-2xl border border-slate-200 bg-white p-8 transition hover:border-violet-300 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-slate-900 group-hover:text-violet-700">Authors</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Independent writers and researchers can monitor process, seal work, and prove
                authorship when institutions or journals ask for verifiable integrity.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-violet-600">Start free →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* —— Final CTA —— */}
      <section className="border-t border-slate-100 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center md:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Ready to prove authorship?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
            Start free today, verify a sealed package, or speak with us about campus deployment.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Get started
            </Link>
            <Link
              href="/verify"
              className="rounded-xl border border-white/20 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Verify document
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
