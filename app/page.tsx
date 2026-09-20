import Link from "next/link";
import { LibraryLoader } from "./components/library-loader";

const metrics = [
  { value: "99.97%", label: "Review integrity" },
  { value: "2.1s", label: "Verification time" },
  { value: "40+", label: "Academic teams" },
];

const steps = [
  "Register your university or create an individual account.",
  "Upload or submit work into a secure review workflow.",
  "Track the review, share the result, and confirm next steps.",
];

export default function Home() {
  return (
    <div className="min-h-screen text-slate-100">
      <main>
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-200">
                Trusted academic review
              </div>
              <h1 className="max-w-2xl text-5xl font-black leading-[1.04] tracking-tight text-white md:text-6xl">
                A clear, trusted workflow for submissions and verification.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Veritas helps universities, educators, and individuals manage submissions with confidence, secure review trails, and a clear result-ready process.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register" className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Register now
                </Link>
                <Link href="/login" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Sign in
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
                <div><span className="font-semibold text-white">99.97%</span> review integrity</div>
                <div><span className="font-semibold text-white">24/7</span> workflow coverage</div>
                <div><span className="font-semibold text-white">Secure</span> by design</div>
              </div>
            </div>

            <div className="glass-panel soft-ring relative overflow-hidden rounded-[30px] p-4 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4 px-1">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Submission status</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Verified</h2>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">Ready</span>
              </div>

              <LibraryLoader label="Loading submission review" />

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { value: "92%", label: "Review" },
                  { value: "87%", label: "Coverage" },
                  { value: "96%", label: "Integrity" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                    <div className="mt-2 text-xl font-bold text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <div className="text-3xl font-black text-white">{metric.value}</div>
                <div className="mt-2 text-sm font-medium text-slate-100">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">How it works</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Simple steps, clear accountability.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-200">{index + 1}</div>
                <p className="text-sm leading-7 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-[30px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 p-8 md:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">Start here</p>
                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Choose the account that fits your workflow.</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950">Create account</Link>
                <Link href="/login" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white">Existing user</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
