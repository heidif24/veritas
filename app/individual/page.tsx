import Link from "next/link";

const files = [
  { name: "Board brief", status: "Sealed", hash: "v-92af4b2d" },
  { name: "Client proposal", status: "Verified", hash: "v-d81ce09a" },
  { name: "Research synopsis", status: "Protected", hash: "v-4d66b11c" },
];

export default function IndividualPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">For individuals</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Protect and prove your professional writing
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Draft, seal, and share work with a clear provenance trail — for clients, publishers, and stakeholders.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app/editor/new" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              Start a draft
            </Link>
            <Link href="/verify" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Verify a package
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Draft history", "Tracked"],
            ["Modification risk", "Low"],
            ["Verification", "Anytime"],
            ["Export integrity", "99.97%"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-medium text-slate-500">{label}</div>
              <div className="mt-2 text-lg font-bold text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-xl font-bold text-slate-900">Recent packages</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {files.map((file) => (
            <div key={file.name} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">{file.name}</h3>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                  {file.status}
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500">Package reference</p>
              <div className="mt-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
                {file.hash}
              </div>
              <button type="button" className="mt-5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                Download package
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
