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
    <main className="min-h-screen text-slate-100">
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-14 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.96fr_1.04fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Trusted writing, provenance, and review
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] text-white md:text-7xl">
              Proof of authorship without the friction.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Veritas gives writers, institutions, and editors a cleaner way to protect originality, preserve source context, and verify a document’s creation trail.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/app/dashboard" className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
                Open workspace
              </Link>
              <Link href="/verify" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Check proof
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["Browser-native", "Works in a standard browser"],
                ["Source-aware", "Attachments and references stay with the draft"],
                ["Export-ready", "Signed package for trusted review"],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
                  <div className="text-sm font-bold text-white">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-cyan-950/20 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Linked provenance</p>
                <h2 className="mt-2 text-2xl font-black text-white">Existentialism and Choice</h2>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                Verified trail
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_210px]">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
                <div className="space-y-3 text-sm leading-7 text-slate-200">
                  <p>
                    <span className="rounded bg-emerald-500/20 px-1 text-emerald-100">The draft remains connected to the choices and sources behind it.</span>
                  </p>
                  <p>
                    Writers can manage structure, references, and revision history without leaving a single trusted workspace.
                  </p>
                  <p>
                    <span className="rounded bg-amber-500/20 px-1 text-amber-100">Linked notes and sourcing remain visible to collaborators.</span>
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ["Sources", "4"],
                    ["Sessions", "7"],
                    ["Status", "Ready"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
                      <div className="mt-2 text-lg font-black text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#111318] p-4">
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
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <div className="text-3xl font-black text-white">{metric.value}</div>
              <div className="mt-2 text-sm font-semibold text-slate-100">{metric.label}</div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{metric.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">Why teams choose Veritas</p>
          <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
            A more trusted way to handle writing, review, and publication.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {platformCapabilities.map((capability) => (
            <div key={capability.title} className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6">
              <h3 className="text-lg font-bold text-white">{capability.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{capability.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
              <div className={`mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r ${feature.accent}`} />
              <h3 className="text-2xl font-black text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[30px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-[#15151d] to-emerald-500/10 p-8 md:p-10">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">Built for every workflow</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">One trusted record, different review journeys.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {roleLinks.map((role) => (
              <Link key={role.href} href={role.href} className="rounded-2xl border border-white/10 bg-slate-950/45 p-5 transition hover:border-cyan-400/40 hover:bg-slate-950/65">
                <div className="text-base font-bold text-white">{role.label}</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{role.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
