import Link from "next/link";
import { features, metrics, platformCapabilities } from "./data";

const replayEvents = [
  { time: "00:12", label: "Opening draft captured", tone: "bg-emerald-400", width: "82%" },
  { time: "04:38", label: "Revision window logged", tone: "bg-cyan-400", width: "64%" },
  { time: "18:05", label: "Source note linked", tone: "bg-amber-400", width: "38%" },
  { time: "41:22", label: "Final proof sealed", tone: "bg-violet-400", width: "92%" },
];

const roleLinks = [
  { label: "Student writer", href: "/student", detail: "Draft with source tracking and export-ready proof." },
  { label: "Professor", href: "/instructor/courses", detail: "Review submissions with readable lineage and evidence." },
  { label: "Institution admin", href: "/admin/tenant", detail: "Set policy, roles, and onboarding for teams." },
  { label: "Publication editor", href: "/publisher/pitches", detail: "Validate trust certificates before publication." },
];

export default function Home() {
  return (
    <main className="min-h-screen text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:pt-18">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 shadow-[0_40px_100px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="grid items-center gap-10 px-6 py-8 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Authored with proof
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
                Trusted writing for serious work.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Veritas supports academic, institutional, and editorial teams with clear writing, traceable sources, and secure final verification.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/app/dashboard" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                  Open workspace
                </Link>
                <Link href="/verify" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Verify record
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  ["Browser workflow", "Simple and secure"],
                  ["Source tracking", "Clear and visible"],
                  ["Signed export", "Ready for review"],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-bold text-slate-900">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-600">{detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-[0_25px_80px_rgba(14,116,144,0.08)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Linked provenance</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">Existentialism and Choice</h2>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                    Verified trail
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_210px]">
                  <div className="rounded-[20px] border border-slate-200 bg-white p-5">
                    <div className="space-y-3 text-sm leading-7 text-slate-700">
                      <p><span className="rounded bg-emerald-100 px-1 text-emerald-800">Draft trail</span> linked to source context.</p>
                      <p>Structured notes, references, and clear revision history.</p>
                      <p><span className="rounded bg-amber-100 px-1 text-amber-800">Reviewer-ready</span> evidence at every stage.</p>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {[
                        ["Sources", "4"],
                        ["Sessions", "7"],
                        ["Status", "Ready"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
                          <div className="mt-2 text-lg font-black text-slate-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-slate-200 bg-slate-900 p-4 text-slate-100">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">Timeline</p>
                    <div className="mt-5 space-y-5">
                      {replayEvents.map((event) => (
                        <div key={event.time}>
                          <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                            <span>{event.time}</span>
                            <span className="text-right">{event.label}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800">
                            <span className={`block h-full rounded-full ${event.tone}`} style={{ width: event.width }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
              <div className="text-3xl font-black text-slate-900">{metric.value}</div>
              <div className="mt-2 text-sm font-semibold text-slate-800">{metric.label}</div>
              <p className="mt-2 text-xs leading-5 text-slate-600">{metric.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Built for teams</p>
          <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">
            Trusted workflow, clean review, confident publication.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {platformCapabilities.slice(0, 4).map((capability) => (
            <div key={capability.title} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">{capability.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{capability.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {features.slice(0, 2).map((feature) => (
            <div key={feature.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r ${feature.accent}`} />
              <h3 className="text-2xl font-black text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[30px] border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-violet-50 p-8 md:p-10 shadow-[0_30px_80px_rgba(14,116,144,0.08)]">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Built for every workflow</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">One trusted record, different review journeys.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {roleLinks.map((role) => (
              <Link key={role.href} href={role.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
                <div className="text-base font-bold text-slate-900">{role.label}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{role.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
