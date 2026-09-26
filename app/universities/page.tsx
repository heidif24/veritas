import Link from "next/link";

const capabilities = [
  {
    title: "One place for policy and people",
    detail: "Onboard departments, set roles, and keep institutional standards consistent across programs.",
  },
  {
    title: "Review that respects academic judgment",
    detail: "Faculty see clear provenance and originality signals without replacing their expertise.",
  },
  {
    title: "Exports that travel with trust",
    detail: "Sealed submissions stay verifiable for external examiners, publishers, and archives.",
  },
];

export default function UniversitiesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">For universities</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Academic integrity that scales with your institution.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Veritas helps campuses manage writing, review, and verification with clarity — from first draft to final sealed submission.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              Start onboarding
            </Link>
            <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {capabilities.map((item) => (
            <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-black text-slate-900">How institutions use Veritas</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Onboard faculty and set campus policy",
              "Route student work into review queues",
              "Support fair originality assessment",
              "Issue sealed, verifiable exports",
            ].map((step, i) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800">{i + 1}</div>
                <p className="text-sm leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
