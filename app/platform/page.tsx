import Link from "next/link";
import { platformCapabilities } from "../data";

export default function PlatformPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Product</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          Everything you need for trusted writing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          A complete workspace for drafting, review, originality, and sealed verification — designed for academic and professional teams.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {platformCapabilities.map((item) => (
            <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 md:p-10">
          <h2 className="text-2xl font-black text-slate-900">From draft to verified submission</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              { t: "Draft", d: "Write in a focused editor with sources and structure." },
              { t: "Check", d: "See originality and composition signals before you submit." },
              { t: "Review", d: "Faculty and teams work from a shared, clear record." },
              { t: "Seal", d: "Export a signed package that stays verifiable." },
            ].map((step) => (
              <div key={step.t}>
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">{step.t}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/register" className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              Create your account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
