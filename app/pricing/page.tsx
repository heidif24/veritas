import Link from "next/link";
import { pricingTiers } from "../data";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Pricing</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          Simple plans for every team
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          From individual writers to full campuses — choose the plan that fits how you work.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => {
            const featured = tier.name === "Institutional";
            return (
              <div
                key={tier.name}
                className={`rounded-[28px] border p-7 shadow-sm ${
                  featured
                    ? "border-cyan-300 bg-cyan-50/50 ring-1 ring-cyan-200"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{tier.name}</div>
                <div className="mt-4 text-4xl font-black text-slate-900">{tier.price}</div>
                <p className="mt-2 text-sm text-slate-600">{tier.description}</p>
                <ul className="mt-7 space-y-3 text-sm text-slate-700">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition ${
                    featured
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  Get started
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
