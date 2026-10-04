"use client";

import Image from "next/image";
import Link from "next/link";
import { CryptographicSealSpinner } from "./components/CryptographicSealSpinner";

const pillars = [
  {
    title: "Process, not percentages",
    body: "A silent, privacy-first composition trail — keystrokes, timing, pastes, revisions — so review is grounded in how work was made, not an opaque score.",
    tag: "TELEMETRY",
    accent: "emerald",
  },
  {
    title: "Cryptographic proof",
    body: "Content and evidence lock into a portable .veritas package signed with SHA-256 and Ed25519. Change a character; the seal breaks.",
    tag: "ATTESTATION",
    accent: "sky",
  },
  {
    title: "Fair by design",
    body: "Flags are evidence for conversation, not automatic guilt. Students see factors. Instructors review context. Appeals stay possible.",
    tag: "DUE PROCESS",
    accent: "amber",
  },
];

const capabilities = [
  {
    title: "Living process trail",
    body: "Key events, focus, pastes, and revision structure captured as verifiable telemetry behind every draft.",
    badge: "Process",
    type: "trail",
  },
  {
    title: "Ed25519 + SHA-256 seal",
    body: "Portable packages anyone can verify on the public page — no account required.",
    badge: "Signature",
    type: "crypto",
  },
  {
    title: "Segment-level AI signals",
    body: "Assistance shown where it appears in the text, next to process evidence — never a single black-box number.",
    badge: "Granular",
    type: "segments",
  },
  {
    title: "Similarity with sources",
    body: "Institutional corpus and prior work matches presented in context for attributable review.",
    badge: "Corpus",
    type: "similarity",
  },
  {
    title: "Honest proctoring",
    body: "Visibility and focus signals designed for policy — not exaggerated claims of perfect lockdown.",
    badge: "Signals",
    type: "proctoring",
  },
  {
    title: "Canvas & Moodle LTI",
    body: "Advantage 1.3 launch, multi-tenant campuses, faculty queues, free writing for onboarded students.",
    badge: "LTI 1.3",
    type: "lms",
  },
];

const steps = [
  {
    n: "01",
    title: "Assign",
    body: "Create writing tasks in Veritas or launch from Canvas / Moodle.",
    meta: "LTI 1.3 / Direct",
  },
  {
    n: "02",
    title: "Compose",
    body: "Students write; the process trail records quietly in the background.",
    meta: "Passive Telemetry",
  },
  {
    n: "03",
    title: "Review",
    body: "One shared record: process, AI segments, similarity, session events.",
    meta: "Audit Matrix",
  },
  {
    n: "04",
    title: "Seal",
    body: "Export a signed package. Verify anywhere, forever.",
    meta: "SHA-256 / Ed25519",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090d] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-100 font-sans">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -left-48 -top-32 h-[680px] w-[680px] rounded-full bg-emerald-500/[0.08] blur-[150px]" />
        <div className="absolute right-[-10%] top-24 h-[560px] w-[560px] rounded-full bg-sky-500/[0.07] blur-[160px]" />
        <div className="absolute left-1/3 top-[50%] h-[600px] w-[600px] rounded-full bg-indigo-500/[0.05] blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pt-24 lg:pb-32 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 font-mono text-[11px] text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Cryptographic authorship proof
            </div>

            {/* Main Headline */}
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl lg:leading-[1.06]">
              Stop guessing if AI wrote it.
              <br />
              <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-500 bg-clip-text text-transparent">
                Prove how it was built.
              </span>
            </h1>

            {/* Paragraph */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Veritas records a silent process trail as writing happens, then seals content and
              evidence into a portable cryptographic package. Code has Git. Writing should have proof.
            </p>

            {/* Primary CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-7 text-sm font-semibold text-zinc-950 shadow-[0_0_25px_rgba(255,255,255,0.25)] transition duration-200 hover:bg-zinc-100 hover:shadow-[0_0_35px_rgba(255,255,255,0.35)]"
              >
                <span>Start free</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/verify"
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-zinc-200 backdrop-blur-md transition duration-200 hover:border-emerald-500/40 hover:bg-white/[0.08] hover:text-white"
              >
                <span>Verify a package</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                  .veritas
                </span>
              </Link>
            </div>
          </div>

          {/* PICTORIAL FLOATING HERO SHOWCASE */}
          <div className="mt-16 sm:mt-20">
            <div className="relative mx-auto max-w-5xl">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-sky-500/15 to-indigo-500/20 blur-xl opacity-75" />

              {/* Main Pictorial Frame */}
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0b0e14]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
                {/* Window Bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/70 border border-rose-400/30" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/70 border border-amber-400/30" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/70 border border-emerald-400/30" />
                    <span className="ml-3 font-mono text-xs text-zinc-400">submission.veritas</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    seal.verified · SHA-256
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                  {/* Left Column: Rich Pictorial Artwork with Floating Overlays */}
                  <div className="relative lg:col-span-7 overflow-hidden rounded-xl border border-white/10 bg-black/60 group">
                    <div className="relative aspect-[16/11] w-full overflow-hidden">
                      <Image
                        src="/veritas-hero-illustration.jpg"
                        alt="Veritas Cryptographic Manuscript Attestation"
                        fill
                        priority
                        className="object-cover object-center transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-black/30" />
                    </div>

                    {/* Floating Glass Pill: Verified Seal Status */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-lg border border-white/20 bg-black/70 px-3 py-1.5 backdrop-blur-md shadow-lg">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />
                      <span className="font-mono text-xs font-semibold text-white tracking-wide">
                        AUTHENTICATED MANUSCRIPT
                      </span>
                    </div>

                    {/* Floating Seal Stamp at bottom-right */}
                    <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-[#070a0e]/90 p-2.5 backdrop-blur-md shadow-2xl">
                      <CryptographicSealSpinner
                        state="success"
                        size="sm"
                        hashPreview="sha256:a3f8…c91e"
                      />
                      <div className="pr-1 text-left">
                        <div className="font-mono text-[10px] text-zinc-400">Ed25519 Signed</div>
                        <div className="font-mono text-[11px] font-semibold text-emerald-300">0 False Positives</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: High-Craft Verified Terminal & Telemetry Card */}
                  <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-sm sm:p-6">
                    <div className="space-y-4 font-mono text-[13px] leading-relaxed">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-zinc-400 text-xs uppercase tracking-wider">Verification Audit</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                          <span className="text-emerald-400">✓</span> seal.verified
                        </span>
                      </div>

                      {/* Technical Specs */}
                      <div className="rounded-lg bg-white/[0.03] p-3 border border-white/5 space-y-2">
                        <p className="text-zinc-300">
                          <span className="text-zinc-500">algorithm</span>{" "}
                          <span className="text-sky-300 font-semibold">Ed25519</span>
                          <span className="text-zinc-500"> · hash </span>
                          <span className="text-sky-300 font-semibold">SHA-256</span>
                        </p>
                        <p className="break-all text-zinc-400">
                          <span className="text-zinc-500">digest</span>{" "}
                          <span className="text-emerald-300/90 font-mono">a3f8c91e…7b2d</span>
                        </p>
                      </div>

                      {/* Process Telemetry Matrix */}
                      <div className="rounded-lg bg-white/[0.03] p-3 border border-white/5 space-y-2">
                        <p className="text-zinc-300">
                          <span className="text-zinc-500">process_events</span>{" "}
                          <span className="text-white font-bold">14,290</span>
                          <span className="text-zinc-500"> · composition_span </span>
                          <span className="text-white font-semibold">3h 42m</span>
                        </p>
                        <p className="text-zinc-300">
                          <span className="text-zinc-500">integrity</span>{" "}
                          <span className="text-emerald-400 font-semibold">intact</span>
                          <span className="text-zinc-500"> · public_verify </span>
                          <span className="text-emerald-400 font-semibold">true</span>
                        </p>
                      </div>

                      {/* Micro Keystroke Visualizer Line */}
                      <div className="pt-1">
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                          <span>Typing Cadence Stream</span>
                          <span className="text-emerald-400 font-mono">Human Velocity</span>
                        </div>
                        <div className="flex h-6 items-end gap-1 rounded bg-black/40 px-2 py-1 border border-white/5">
                          {[35, 60, 45, 90, 75, 40, 20, 85, 95, 70, 50, 80, 65, 40, 90, 85, 55, 75, 95, 60].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/40 to-emerald-400 transition-all hover:bg-emerald-300"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Footer Callout */}
                      <div className="flex items-center gap-2.5 border-t border-white/10 pt-4 text-zinc-400">
                        <span className="inline-flex h-6 items-center rounded-md bg-emerald-500/20 px-2.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                          SEALED
                        </span>
                        <span className="text-xs text-zinc-300">
                          Anyone can verify. No account required.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PILLARS / POSITIONING SECTION */}
        <section className="relative border-t border-white/10 bg-black/30 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">
                The end of the guessing game
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Built for proof of human effort — not another detector score
              </h2>
            </div>

            {/* Pictorial Cards Grid */}
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {pillars.map((p, idx) => (
                <div
                  key={p.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  {/* Subtle Top Ambient Gradient */}
                  <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/[0.08] blur-3xl transition-opacity group-hover:opacity-100" />

                  <div>
                    {/* Tag & Icon Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="font-mono text-xs font-semibold tracking-wider text-emerald-400">
                        {p.tag}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">0{idx + 1}</span>
                    </div>

                    {/* Pictorial Diagram Mockup per card */}
                    <div className="my-6 rounded-xl border border-white/10 bg-black/60 p-4">
                      {idx === 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                            <span>Keystroke Rhythm</span>
                            <span className="text-emerald-400">Organic (72 wpm)</span>
                          </div>
                          <div className="flex h-10 items-end gap-1.5">
                            {[40, 70, 20, 85, 90, 60, 30, 95, 75, 80, 50, 65, 85, 45].map((v, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-sm bg-emerald-500/60 hover:bg-emerald-400 transition"
                                style={{ height: `${v}%` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between font-mono text-[10px] text-zinc-500 pt-1">
                            <span>T-0h</span>
                            <span>T+3.7h</span>
                          </div>
                        </div>
                      )}

                      {idx === 1 && (
                        <div className="space-y-2.5 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Cryptographic Seal</span>
                            <span className="text-sky-300">Ed25519 Key</span>
                          </div>
                          <div className="rounded bg-white/5 p-2 border border-white/5 text-[10px] text-zinc-300 break-all">
                            SHA256: 8a3c9b7410f8…92e7
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Tamper-evident payload locked
                          </div>
                        </div>
                      )}

                      {idx === 2 && (
                        <div className="space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Contextual Review</span>
                            <span className="text-amber-400">Open Appeal</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 rounded bg-white/5 p-2 border border-white/5 text-[10px]">
                              <div className="text-zinc-400">Student view</div>
                              <div className="text-emerald-300 font-semibold">100% visible</div>
                            </div>
                            <div className="flex-1 rounded bg-white/5 p-2 border border-white/5 text-[10px]">
                              <div className="text-zinc-400">Faculty view</div>
                              <div className="text-sky-300 font-semibold">Context audit</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-white tracking-tight">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAPABILITIES / PLATFORM SECTION */}
        <section className="relative border-t border-white/10 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">
                Platform
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Everything that strengthens the same integrity story
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Process and seal first. AI, similarity, proctoring, and LMS deepen the record — they never replace it.
              </p>
            </div>

            {/* Pictorial Capabilities Grid */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c, i) => (
                <div
                  key={c.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-[#111620]"
                >
                  <div>
                    {/* Header with pictorial micro-badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {c.badge}
                      </span>
                      <span className="font-mono text-xs text-zinc-600">MOD-0{i + 1}</span>
                    </div>

                    {/* Pictorial Visual Element */}
                    <div className="mb-5 h-24 overflow-hidden rounded-xl border border-white/10 bg-black/50 p-3 flex flex-col justify-center">
                      {c.type === "trail" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                            <span>Focus Events</span>
                            <span className="text-emerald-400">99.4% Focused</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full w-[94%]" />
                          </div>
                          <div className="flex gap-1 text-[9px] font-mono text-zinc-500">
                            <span>Key:down 12.4k</span> · <span>Paste:0</span> · <span>Rev:18</span>
                          </div>
                        </div>
                      )}

                      {c.type === "crypto" && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-sm font-bold">
                            Ed
                          </div>
                          <div className="font-mono text-[10px] space-y-1 truncate">
                            <div className="text-zinc-400">Signed with Curve25519</div>
                            <div className="text-emerald-400 truncate">sha256:d89a7f01…c4e</div>
                          </div>
                        </div>
                      )}

                      {c.type === "segments" && (
                        <div className="space-y-1.5 font-mono text-[10px]">
                          <div className="flex justify-between text-zinc-400">
                            <span>Inline Document Span</span>
                            <span className="text-emerald-300">Direct Attribution</span>
                          </div>
                          <div className="rounded bg-white/5 p-1.5 border border-white/5 text-[9px] text-zinc-300 line-clamp-2">
                            &quot;The experimental methodology demonstrates...&quot;
                          </div>
                        </div>
                      )}

                      {c.type === "similarity" && (
                        <div className="space-y-1.5 font-mono text-[10px]">
                          <div className="flex justify-between text-zinc-400">
                            <span>Corpus Comparison</span>
                            <span className="text-sky-300">Attributable Match</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 rounded-full bg-zinc-800 overflow-hidden">
                              <div className="h-full bg-sky-400 rounded-full w-[14%]" />
                            </div>
                            <span className="text-[10px] text-zinc-400">14% Citations</span>
                          </div>
                        </div>
                      )}

                      {c.type === "proctoring" && (
                        <div className="space-y-1 font-mono text-[10px]">
                          <div className="flex justify-between text-zinc-400">
                            <span>Window Telemetry</span>
                            <span className="text-emerald-400">Policy-Compliant</span>
                          </div>
                          <div className="text-[9px] text-zinc-500">
                            Zero invasive screen captures. Honest focus telemetry only.
                          </div>
                        </div>
                      )}

                      {c.type === "lms" && (
                        <div className="flex items-center justify-around font-mono text-[11px]">
                          <span className="rounded bg-white/5 px-2 py-1 text-zinc-300 border border-white/10">Canvas</span>
                          <span className="text-emerald-400">⇄ LTI 1.3 ⇄</span>
                          <span className="rounded bg-white/5 px-2 py-1 text-zinc-300 border border-white/10">Moodle</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section className="relative border-t border-white/10 bg-black/40 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">
                Workflow
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                From assignment to verified submission
              </h2>
            </div>

            {/* Pictorial Workflow Steps with connecting track */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, idx) => (
                <div
                  key={s.n}
                  className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-lg transition duration-300 hover:border-emerald-500/40 hover:-translate-y-1"
                >
                  <div>
                    {/* Top Step Pill & Meta */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 font-mono text-sm font-bold text-emerald-300 border border-emerald-500/20">
                        {s.n}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                        {s.meta}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.body}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>Phase 0{idx + 1}</span>
                    <span className="text-emerald-400/80">Completed</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Institutional Guarantee Note */}
            <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-lg font-bold">
                  ⚖
                </span>
                <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                  Flags are evidence for review, not verdicts. Students can read every factor, talk to
                  instructors, and appeal under institutional policy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCES SECTION */}
        <section className="relative border-t border-white/10 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">
                Who it's for
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Institutions, publishers, authors
              </h2>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {[
                {
                  href: "/universities",
                  t: "Universities",
                  d: "Multi-tenant campuses, LTI into Canvas and Moodle, faculty review, free student writing when onboarded.",
                  tag: "Campus Edition",
                  color: "emerald",
                },
                {
                  href: "/publishers",
                  t: "Publishers",
                  d: "Editorial queues and sealed packages so inbound work arrives with verifiable provenance — not screenshots.",
                  tag: "Editorial Edition",
                  color: "sky",
                },
                {
                  href: "/register",
                  t: "Authors",
                  d: "Monitor process, seal work, and prove authorship when journals or schools ask for integrity you can show.",
                  tag: "Individual Edition",
                  color: "indigo",
                },
              ].map((a) => (
                <Link
                  key={a.t}
                  href={a.href}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-2xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                        {a.tag}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">→</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {a.t}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{a.d}</p>
                  </div>

                  <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="relative border-t border-white/10 bg-gradient-to-b from-black/40 to-[#07090d] py-24 text-center lg:py-32">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Ready to prove authorship?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
              Start free, verify a sealed package, or explore campus deployment.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-zinc-950 shadow-xl transition duration-200 hover:bg-zinc-200"
              >
                Start free
              </Link>
              <Link
                href="/verify"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 text-sm font-medium text-zinc-200 backdrop-blur-sm transition duration-200 hover:border-white/30 hover:bg-white/[0.08]"
              >
                Verify package
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 text-sm font-medium text-zinc-200 backdrop-blur-sm transition duration-200 hover:border-white/30 hover:bg-white/[0.08]"
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
