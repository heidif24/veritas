"use client";

import Link from "next/link";
import { useLocale } from "./components/locale-provider";
import { metrics } from "./data";

const steps = [
  {
    n: "01",
    title: "The university licenses Veritas",
    body: "Access is sold to the institution, not to individuals. Support issues codes and stands up the campus tenant.",
  },
  {
    n: "02",
    title: "The campus customizes it",
    body: "Name, colours, policy thresholds, and Moodle or LTI launch paths are set by the university — not by a public storefront.",
  },
  {
    n: "03",
    title: "Students write and submit",
    body: "The established writing studio stays. Process is recorded as the draft is built, then submitted against the assignment.",
  },
  {
    n: "04",
    title: "Instructors review and seal",
    body: "Faculty read the composition record beside the paper. Ready work leaves as a signed package anyone can verify.",
  },
];

const custom = [
  { title: "Brand", body: "Crest, colours, and language so the studio feels like the university, not a third-party tool." },
  { title: "Policy", body: "Thresholds faculty can explain. Flags open a conversation; they are not an automatic verdict." },
  { title: "Moodle & LTI", body: "Launch from the LMS the campus already uses. Students stay on institutional accounts." },
  { title: "Access codes", body: "The university provisions students and instructors. There is no public individual checkout." },
];

export default function HomePage() {
  const { t } = useLocale();

  const roles = [
    { title: t("home.role.students"), detail: t("home.role.students.detail"), mark: "01" },
    { title: t("home.role.faculty"), detail: t("home.role.faculty.detail"), mark: "02" },
    { title: t("home.role.institutions"), detail: t("home.role.institutions.detail"), mark: "03" },
  ];

  const pillars = [
    { title: t("home.v1.title"), body: t("home.v1.body") },
    { title: t("home.v2.title"), body: t("home.v2.body") },
    { title: t("home.v3.title"), body: t("home.v3.body") },
  ];

  return (
    <main className="bg-[#07090d] text-zinc-100">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 12% -10%, rgba(22,116,81,0.28), transparent 60%), radial-gradient(ellipse 40% 40% at 100% 0%, rgba(197,163,75,0.12), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "linear-gradient(180deg, #000 20%, transparent 85%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] tracking-wide text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A34B]" />
              {t("home.badge")}
            </div>
            <h1 className="mt-6 max-w-xl font-display text-[2.7rem] leading-[1.05] tracking-tight text-white sm:text-6xl">
              {t("home.hero")}
            </h1>
            <div className="m-rule mt-6" />
            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">{t("home.sub")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/onboarding?intent=institution"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                {t("nav.contactSupport")}
              </Link>
              <Link
                href="/universities"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 text-sm font-medium text-white transition hover:border-white/30"
              >
                For universities
              </Link>
              <Link
                href="/verify"
                className="inline-flex h-12 items-center justify-center px-2 text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                {t("home.cta.verify")}
              </Link>
            </div>
            <p className="mt-6 text-sm text-zinc-500">
              Anyone who wants Veritas writes to{" "}
              <a href="mailto:support@veritas.io" className="font-medium text-emerald-300 hover:text-emerald-200">
                support@veritas.io
              </a>
              . There is no public checkout.
            </p>
          </div>

          <aside className="folio p-5 sm:p-6" aria-label="Example sealed submission">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A34B]">Sealed submission</p>
                <p className="mt-2 font-display text-2xl text-white">Philosophy 101 · Essay 3</p>
                <p className="mt-1 text-sm text-zinc-400">Amina R. · institutional account</p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-200">
                Valid
              </span>
            </div>

            <ol className="mt-6 space-y-3 border-t border-white/10 pt-5">
              {[
                ["Draft opened", "14 days of composition"],
                ["Revisions kept", "27 recorded passes"],
                ["Sources in view", "11 cited in the trail"],
                ["Instructor", "Ready for review"],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-500">{label}</span>
                  <span className="text-right text-zinc-200">{value}</span>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-[11px] leading-6 text-zinc-400">
              <div className="flex justify-between gap-3">
                <span>SHA-256</span>
                <span className="text-zinc-200">9f3a ··· c21e</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Ed25519</span>
                <span className="text-emerald-300">signature holds</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`px-6 py-8 ${i > 0 ? "md:border-l md:border-white/10" : ""} ${i % 2 === 1 ? "border-l border-white/10 md:border-l" : ""}`}
            >
              <p className="font-display text-3xl text-white">{m.value}</p>
              <p className="mt-1 text-sm text-zinc-200">{m.label}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C5A34B]">The licence</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl text-white md:text-4xl">
            Sold to the university. Used by the campus.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.n} className="bg-[#07090d] p-6">
                <p className="font-mono text-xs text-emerald-300">{step.n}</p>
                <h3 className="mt-4 font-display text-2xl text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 md:py-20">
          {pillars.map((p) => (
            <article key={p.title} className="border-t border-[#C5A34B]/50 pt-5">
              <h2 className="font-display text-2xl text-white">{p.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C5A34B]">Customization</p>
              <h2 className="mt-3 max-w-lg font-display text-3xl text-white md:text-4xl">
                The university makes it its own.
              </h2>
            </div>
            <Link href="/platform" className="text-sm font-medium text-emerald-300 hover:text-emerald-200">
              See the platform →
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {custom.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-sm font-semibold tracking-wide text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-300">{t("home.who.label")}</p>
        <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">{t("home.who.title")}</h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {roles.map((role) => (
            <div key={role.title} className="grid gap-2 py-6 sm:grid-cols-[6rem_14rem_1fr] sm:items-baseline sm:gap-6">
              <span className="font-mono text-xs text-zinc-500">{role.mark}</span>
              <h3 className="font-display text-2xl text-white">{role.title}</h3>
              <p className="text-sm leading-7 text-zinc-400">{role.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center md:py-20">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl text-white md:text-5xl">{t("home.cta.title")}</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">{t("home.cta.body")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/onboarding?intent=institution"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
            >
              {t("home.cta.contact")}
            </Link>
            <a
              href="mailto:support@veritas.io"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white hover:border-white/40"
            >
              support@veritas.io
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
