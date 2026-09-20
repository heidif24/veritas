import Link from "next/link";

const secureFiles = [
  { name: "Board brief", status: "Sealed", hash: "v-92af4b2d" },
  { name: "Client proposal", status: "Verified", hash: "v-d81ce09a" },
  { name: "Research synopsis", status: "Protected", hash: "v-4d66b11c" },
];

export default function IndividualPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">Veritas</Link>
          <div className="flex gap-3">
            <Link href="/verify" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">Verify</Link>
            <Link href="/app/dashboard" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">Open workspace</Link>
          </div>
        </header>

        <section className="grid gap-8 rounded-[32px] border border-white/10 bg-slate-900/80 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">For individuals</p>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Protect your work with a trusted, private paper trail.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Draft, review, and export secure documents with verifiable provenance for clients, publishers, and stakeholders.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/app/dashboard" className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950">Create secure draft</Link>
              <Link href="/verify" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white">Check verification</Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-violet-200">Secure record</p>
            <div className="mt-5 space-y-4">
              {[
                ["Drafting history", "Verified"],
                ["Modification risk", "Low"],
                ["Verification window", "24/7"],
                ["Export integrity", "99.97%"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className="text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {secureFiles.map((file) => (
            <div key={file.name} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{file.name}</h2>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">{file.status}</span>
              </div>
              <p className="mt-5 text-sm text-slate-300">Protected certificate hash</p>
              <div className="mt-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-cyan-200">{file.hash}</div>
              <button className="mt-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Download secure bundle</button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
