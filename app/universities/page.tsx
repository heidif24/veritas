import Link from "next/link";

const outcomes = [
  "Faculty onboarding in under 10 minutes",
  "Live policy enforcement for schools and departments",
  "Student submissions routed directly to reviewers",
  "Cryptographic export verification for every final artifact",
];

const capabilities = [
  { title: "Institution lifecycle control", detail: "Manage onboarding, role provisioning, and trust policy from a single tenant command center." },
  { title: "Academic review workflows", detail: "Turn student submissions into review queues with provenance, risk scoring, and sealed exports." },
  { title: "Cross-campus visibility", detail: "Monitor health, review latency, and integrity performance across departments and teams." },
];

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">Veritas</Link>
          <div className="flex gap-3">
            <Link href="/onboarding" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white">Register institution</Link>
            <Link href="/admin/tenant" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">Open admin</Link>
          </div>
        </header>

        <section className="grid gap-8 rounded-[32px] border border-white/10 bg-slate-900/80 p-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">For universities and institutions</p>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Turn trust into a campus-wide operating system.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Manage onboarding, faculty access, student submissions, and verification in a single secure collaboration layer built for modern academic operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding" className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950">Launch onboarding</Link>
              <Link href="/admin/tenant" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white">View tenant console</Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-cyan-500/20 bg-cyan-500/5 p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">Institutional status</p>
            <div className="mt-6 space-y-4">
              {[
                ["Departments live", "12"],
                ["Faculty accounts", "184"],
                ["Submitted this term", "2,184"],
                ["Verified exports", "341"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className="text-lg font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {capabilities.map((capability) => (
            <div key={capability.title} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-xl font-bold text-white">{capability.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{capability.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-[30px] border border-white/10 bg-slate-900/70 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">What the campus workflow looks like</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-200">Trusted by operation teams</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {outcomes.map((outcome, index) => (
              <div key={outcome} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-200">{index + 1}</div>
                <p className="text-sm leading-7 text-slate-200">{outcome}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
