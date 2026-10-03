"use client";

import Link from "next/link";

const features = [
  ["01", "Process monitoring", "Keystrokes, pastes, focus loss, timing and revision structure — a living composition trail behind every draft."],
  ["02", "Cryptographic seal", "SHA-256 + Ed25519 sealed .veritas packages. Anyone can verify integrity after handoff."],
  ["03", "AI segment analysis", "Segment-level signals so review is specific, never a single opaque label."],
  ["04", "Similarity", "Matches against institutional corpus and prior submissions, sources beside the text."],
  ["05", "Proctored sessions", "Visibility, fullscreen and focus events. Honest browser evidence, not false lockdown claims."],
  ["06", "LMS & campus", "LTI 1.3 for Canvas and Moodle, institutional domains, review queues and analytics."],
];

const steps = [
  ["Assign", "Faculty set writing or objective tasks in Veritas or through their LMS."],
  ["Write", "Students draft while the composition trail records quietly in the background."],
  ["Review", "Process, AI assistance and similarity sit together — flags invite conversation."],
  ["Seal", "Export a signed .veritas package that anyone can verify, anywhere."],
];

const plans = [
  ["Individual", "$15", "/month", "Process monitoring and cryptographic seals for independent writers.", "/register"],
  ["Publisher", "$40", "/month", "Everything in Individual, plus editorial queues for submissions.", "/pricing"],
  ["Institution", "Custom", "", "Campus LTI, proctoring, and free unlimited writing for students.", "/universities"],
];

function SealMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <path id="seal-ring" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <g className="spin-slow" style={{ transformOrigin: "100px 100px" }}>
        <text fontSize="11" letterSpacing="4" fill="currentColor" fontFamily="ui-monospace, monospace">
          <textPath href="#seal-ring">VERITAS · SEALED · ED25519 · SHA-256 · VERIFIED ·</textPath>
        </text>
      </g>
      <text
        x="100"
        y="116"
        textAnchor="middle"
        fontSize="48"
        fill="currentColor"
        fontFamily="var(--font-display), Georgia, serif"
        fontStyle="italic"
      >
        V
      </text>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.975_0.012_85)] text-[oklch(0.22_0.03_165)]">
      {/* Hero */}
      <section className="paper-grain relative overflow-hidden border-b border-[oklch(0.88_0.02_85)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-14 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-28">
          <div className="rise text-center lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[oklch(0.88_0.02_85)] bg-white px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wide text-[oklch(0.48_0.025_160)] sm:mb-6 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.12_82)]" />
              Academic authorship verification
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
              Proof of{" "}
              <em className="not-italic text-[oklch(0.36_0.075_165)]">authorship</em>,
              <br />
              sealed in ink.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[oklch(0.48_0.025_160)] sm:mt-8 sm:text-lg lg:mx-0">
              Veritas records how writing is made, scores authorship in real time, and seals every
              submission with a signature anyone can verify.
            </p>
            <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center lg:mx-0 lg:justify-start">
              <Link
                href="/verify"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[oklch(0.36_0.075_165)] px-7 text-sm font-semibold text-[oklch(0.975_0.012_85)] shadow-lg shadow-[oklch(0.36_0.075_165)]/25 transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Verify a document
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[oklch(0.88_0.02_85)] bg-white px-7 text-sm font-semibold transition hover:bg-[oklch(0.94_0.018_85)]"
              >
                Start writing free
              </Link>
            </div>
          </div>

          <div
            className="rise relative mx-auto w-[88%] max-w-[24rem] sm:w-full sm:max-w-[28rem]"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-[oklch(0.88_0.02_85)] bg-white p-8 shadow-2xl shadow-[oklch(0.22_0.03_165)]/10">
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[oklch(0.88_0.02_85)] bg-[oklch(0.975_0.012_85)]/95 px-3 py-1.5 font-mono text-[0.65rem] uppercase text-[oklch(0.36_0.075_165)] shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.36_0.075_165)]" />
                Integrity verified
              </div>
              <div className="mb-6 mt-10 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[oklch(0.36_0.075_165)] text-white shadow-lg shadow-[oklch(0.36_0.075_165)]/30">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="h-2.5 w-full rounded-full bg-[oklch(0.94_0.018_85)]" />
                <div className="h-2.5 w-[92%] rounded-full bg-[oklch(0.94_0.018_85)]" />
                <div className="h-2.5 w-[85%] rounded-full bg-[oklch(0.94_0.018_85)]" />
                <div className="h-2.5 w-[70%] rounded-full bg-[oklch(0.94_0.018_85)]" />
                <div className="mt-4 h-2.5 w-full rounded-full bg-[oklch(0.94_0.018_85)]" />
                <div className="h-2.5 w-[88%] rounded-full bg-[oklch(0.94_0.018_85)]" />
                <div className="h-2.5 w-[60%] rounded-full bg-[oklch(0.94_0.018_85)]" />
              </div>
              <div className="mt-8 flex items-end justify-between">
                <div className="font-[family-name:var(--font-display)] text-2xl italic text-[oklch(0.48_0.025_160)]">
                  A. Rivera
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.36_0.075_165)]/10 px-3 py-1.5 text-xs font-bold text-[oklch(0.36_0.075_165)] ring-1 ring-[oklch(0.36_0.075_165)]/25">
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
            <SealMark className="absolute -bottom-6 -right-3 h-24 w-24 rounded-full bg-[oklch(0.975_0.012_85)] p-1 text-[oklch(0.74_0.12_82)] sm:-bottom-8 sm:-right-4 sm:h-28 sm:w-28" />
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-tight md:text-5xl lg:text-6xl">
            The whole platform,{" "}
            <em className="text-[oklch(0.36_0.075_165)]">in one record.</em>
          </h2>
          <p className="max-w-sm text-[oklch(0.48_0.025_160)]">
            Process capture and sealing come first. Everything else supports a fair, evidence-based review.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[oklch(0.88_0.02_85)] bg-[oklch(0.88_0.02_85)] md:grid-cols-2 lg:grid-cols-3">
          {features.map(([n, t, d]) => (
            <div
              key={n}
              className="group bg-white p-8 transition-colors hover:bg-[oklch(0.94_0.018_85)] md:p-10"
            >
              <span className="font-mono text-xs text-[oklch(0.74_0.12_82)]">{n}</span>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl md:text-3xl">{t}</h3>
              <p className="mt-3 leading-relaxed text-[oklch(0.48_0.025_160)]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-[oklch(0.88_0.02_85)] bg-[oklch(0.94_0.018_85)]/60">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <h2 className="mb-12 font-[family-name:var(--font-display)] text-4xl md:mb-16 md:text-5xl lg:text-6xl">
            From assignment to{" "}
            <em className="text-[oklch(0.36_0.075_165)]">verified.</em>
          </h2>
          <ol className="grid gap-10 md:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="border-t-2 border-[oklch(0.22_0.03_165)] pt-6">
                <span className="font-[family-name:var(--font-display)] text-5xl italic text-[oklch(0.74_0.12_82)] md:text-6xl">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{t}</h3>
                <p className="mt-2 leading-relaxed text-[oklch(0.48_0.025_160)]">{d}</p>
              </li>
            ))}
          </ol>
          <blockquote className="mx-auto mt-20 max-w-3xl text-center font-[family-name:var(--font-display)] text-2xl italic leading-snug md:mt-24 md:text-3xl lg:text-4xl">
            “Flags are evidence for review, not verdicts. Students can read every factor, talk to
            instructors, and appeal.”
          </blockquote>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-[oklch(0.88_0.02_85)]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl">
            Simple pricing.
          </h2>
          <p className="mb-12 text-[oklch(0.48_0.025_160)] md:mb-14">
            Students at onboarded universities write free, without limits.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map(([n, p, per, d, href], i) => (
              <div
                key={n}
                className={`flex flex-col rounded-2xl border p-8 md:p-10 ${
                  i === 1
                    ? "border-[oklch(0.36_0.075_165)] bg-[oklch(0.36_0.075_165)] text-[oklch(0.975_0.012_85)] shadow-2xl shadow-[oklch(0.36_0.075_165)]/25"
                    : "border-[oklch(0.88_0.02_85)] bg-white"
                }`}
              >
                <h3 className="font-mono text-xs uppercase tracking-widest opacity-70">{n}</h3>
                <div className="mt-6 font-[family-name:var(--font-display)] text-5xl md:text-6xl">
                  {p}
                  <span className="text-lg opacity-60">{per}</span>
                </div>
                <p className="mt-4 flex-1 leading-relaxed opacity-80">{d}</p>
                <Link
                  href={href as string}
                  className={`mt-10 rounded-full px-6 py-3 text-center text-sm font-medium transition hover:opacity-90 ${
                    i === 1
                      ? "bg-[oklch(0.74_0.12_82)] text-[oklch(0.22_0.03_165)]"
                      : "bg-[oklch(0.22_0.03_165)] text-[oklch(0.975_0.012_85)]"
                  }`}
                >
                  {p === "Custom" ? "Talk to us" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[oklch(0.88_0.02_85)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center md:py-20">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
            Ready to trust the process?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[oklch(0.48_0.025_160)]">
            Start free, onboard your campus, or verify a sealed package today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-[oklch(0.36_0.075_165)] px-7 py-3.5 text-sm font-semibold text-[oklch(0.975_0.012_85)] hover:opacity-95"
            >
              Start free
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-[oklch(0.88_0.02_85)] bg-[oklch(0.975_0.012_85)] px-7 py-3.5 text-sm font-semibold hover:bg-[oklch(0.94_0.018_85)]"
            >
              View pricing
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[oklch(0.88_0.02_85)] bg-[oklch(0.975_0.012_85)] px-7 py-3.5 text-sm font-semibold hover:bg-[oklch(0.94_0.018_85)]"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
