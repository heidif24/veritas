"use client";

import Link from "next/link";
import { useLocale } from "./components/locale-provider";
import { LogoMark } from "./components/veritas-logo";

export default function Home() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen text-slate-900">
      {/* —— Hero —— */}
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.12),_transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-12 md:pb-16 md:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-800 shadow-sm backdrop-blur">
              {t("home.badge")}
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              {t("home.hero")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
              {t("home.sub")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
              >
                {t("home.cta.start")}
              </Link>
              <Link
                href="/verify"
                className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                {t("home.cta.verify")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                AI & plagiarism checks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                Composition evidence
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Sealed verification
              </span>
            </div>
          </div>

          {/* Product preview card — picture-like design */}
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="ml-3 text-xs font-medium text-slate-400">Integrity Studio · live preview</span>
              </div>
              <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3 p-6 md:p-8">
                  <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                  <div className="h-3 w-full rounded-full bg-slate-100" />
                  <div className="h-3 w-11/12 rounded-full bg-slate-100" />
                  <div className="h-3 w-4/5 rounded-full bg-cyan-100" />
                  <div className="h-3 w-full rounded-full bg-slate-100" />
                  <div className="h-3 w-3/4 rounded-full bg-violet-100" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                  <p className="pt-2 text-xs leading-5 text-slate-400">
                    Highlighted segments show AI-assisted phrasing, similarity matches, and human composition signals — in one pass.
                  </p>
                </div>
                <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50 to-cyan-50/40 p-6 md:border-l md:border-t-0 md:p-8">
                  <div className="mb-4 flex items-center gap-2">
                    <LogoMark size={36} />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Report</div>
                      <div className="text-sm font-bold text-slate-900">Authorship clear</div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      ["Human composition", "94%", "bg-emerald-500"],
                      ["AI assistance", "4%", "bg-amber-400"],
                      ["Similarity", "2%", "bg-slate-400"],
                    ].map(([label, pct, bar]) => (
                      <div key={label as string}>
                        <div className="mb-1 flex justify-between text-xs font-medium text-slate-600">
                          <span>{label}</span>
                          <span className="font-bold text-slate-900">{pct}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full rounded-full ${bar}`} style={{ width: pct as string }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-800">
                    Ready to seal & export
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Product: Detect AI & plagiarism (+ Veritas seal) —— */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Our product</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Detect AI, plagiarism — and prove authorship
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            One workspace for originality, similarity, composition evidence, and sealed packages that stay verifiable offline — for schools, publishers, and enterprises.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "AI segment analysis",
              body: "See not only whether a document looks AI-written, but which passages and how much — so review stays fair and specific.",
              accent: "from-cyan-500 to-sky-600",
            },
            {
              title: "Plagiarism & similarity",
              body: "Surface matches and overlapping language alongside AI signals, so integrity review is complete in a single pass.",
              accent: "from-violet-500 to-indigo-600",
            },
            {
              title: "Authorship seal",
              body: "Export a signed Veritas package with composition history — portable proof for faculty, editors, and external reviewers.",
              accent: "from-teal-500 to-emerald-600",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`mb-5 h-10 w-10 rounded-2xl bg-gradient-to-br ${card.accent} opacity-90 shadow-md`} />
              <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* —— Numbered story —— */}
      <section className="border-y border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Why Veritas</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Trust needs more than a score
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                title: t("home.v1.title"),
                body: t("home.v1.body"),
              },
              {
                n: "02",
                title: t("home.v2.title"),
                body: t("home.v2.body"),
              },
              {
                n: "03",
                title: t("home.v3.title"),
                body: t("home.v3.body"),
              },
            ].map((item) => (
              <div key={item.n} className="relative">
                <div className="text-5xl font-black tabular-nums text-cyan-200/90">{item.n}</div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— How it works —— */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">How it works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            From draft to verified submission
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Draft", d: "Write in a focused editor with sources, structure, and a living composition record." },
            { n: "02", t: "Check", d: "Run AI, similarity, and authorship signals before you submit — with segment-level clarity." },
            { n: "03", t: "Review", d: "Faculty and teams share the same evidence, not a black-box score." },
            { n: "04", t: "Seal", d: "Export a signed package that stays verifiable offline for any reviewer." },
          ].map((step) => (
            <div key={step.n} className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
                {step.n} · {step.t}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* —— Enterprise & schools —— */}
      <section className="border-y border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Solutions</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Built for schools and enterprise
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Protect authenticity across classrooms, campuses, and professional teams — with roles, policy, and audit trails that fit real workflows.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="h-2 bg-gradient-to-r from-cyan-500 to-sky-600" />
              <div className="p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Education</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">Universities & schools</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Student writing free at onboarded institutions. Faculty review with clear evidence. LMS-ready workflows for Canvas, Moodle, and Blackboard.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="text-cyan-600">✓</span> Unlimited student compositions once onboarded</li>
                  <li className="flex gap-2"><span className="text-cyan-600">✓</span> Assignment & review workflows</li>
                  <li className="flex gap-2"><span className="text-cyan-600">✓</span> Institutional policy and audit trails</li>
                </ul>
                <Link
                  href="/universities"
                  className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Explore education →
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="h-2 bg-gradient-to-r from-violet-500 to-indigo-600" />
              <div className="p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Enterprise</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">Publishers & teams</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Editorial queues, trust badges, and sealed packages for high-volume review desks that need authenticity without slowing publication.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="text-violet-600">✓</span> Pitch & manuscript review queues</li>
                  <li className="flex gap-2"><span className="text-violet-600">✓</span> Team seats and priority support</li>
                  <li className="flex gap-2"><span className="text-violet-600">✓</span> API-ready verification for platforms</li>
                </ul>
                <Link
                  href="/publishers"
                  className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Explore enterprise →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Stats —— */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {[
            ["430+", t("home.stat.institutions")],
            ["2.4M+", t("home.stat.documents")],
            ["99.97%", t("home.stat.accuracy")],
            ["2.1s", t("home.stat.speed")],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-slate-900 md:text-4xl">{value}</div>
              <div className="mt-1.5 text-sm font-medium text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* —— Roles —— */}
      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">{t("home.who.label")}</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">{t("home.who.title")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t("home.role.students"), href: "/student", detail: t("home.role.students.detail") },
              { label: t("home.role.faculty"), href: "/instructor/courses", detail: t("home.role.faculty.detail") },
              { label: t("home.role.institutions"), href: "/universities", detail: t("home.role.institutions.detail") },
              { label: t("home.role.publishers"), href: "/publisher/pitches", detail: t("home.role.publishers.detail") },
            ].map((role) => (
              <Link
                key={role.href}
                href={role.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
              >
                <div className="text-sm font-bold text-slate-900">{role.label}</div>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{role.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* —— Final CTA —— */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900 px-8 py-12 text-center shadow-xl md:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,211,238,0.25),_transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl font-black text-white md:text-4xl">{t("home.cta.title")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-300">{t("home.cta.body")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-cyan-50"
              >
                {t("home.cta.account")}
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/25 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t("home.cta.pricing")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
