import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

export default function PublishersPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-700">For publishing houses</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
            Editorial integrity at $750 / month
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Pitch queues, manuscript review, and sealed author packages — built for imprints and editorial desks that need portable proof of authorship and originality.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register?plan=publisher" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              Start publisher plan
            </Link>
            <Link href="/publisher/pitches" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Open pitch desk
            </Link>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
          {[
            ["Pitch pipeline", "Track submissions from query to acceptance with integrity status on every piece."],
            ["Team seats", "Editors share review queues without sharing student-grade classroom tools."],
            ["Trust badges", "Accepted work can carry a verification link for rights, syndication, and partners."],
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
