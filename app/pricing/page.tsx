import Link from "next/link";
import { pricingTiers } from "../data";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Transparent pricing</p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Built for every scale of trusted review and operations.</h1>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`rounded-[30px] border p-6 ${tier.name === "Institutional" ? "border-cyan-500/35 bg-cyan-500/10" : "border-white/10 bg-slate-900/70"}`}>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{tier.name}</div>
              <div className="mt-4 text-4xl font-black text-white">{tier.price}</div>
              <p className="mt-2 text-sm text-slate-300">{tier.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] text-emerald-200">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/verify" className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950">Get started</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
