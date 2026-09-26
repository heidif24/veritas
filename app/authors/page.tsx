import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">For authors & academics</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
            Draft with evidence. Publish with proof.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Independent researchers, thesis writers, and professionals use Veritas to compose in Integrity Studio, seal a portable package, and share verification — without needing a campus licence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register?plan=individual" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              Start at $15/month
            </Link>
            <Link href="/pricing" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Compare plans
            </Link>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
          {[
            ["Integrity Studio", "Professional canvas with process evidence built in — not bolted on after export."],
            ["Seal & verify", "Cryptographic packages anyone can check on the public Verify page."],
            ["Fair signals", "Similarity and authorship factors explained in plain language — never a magic AI score alone."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-bold">{t}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{d}</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
