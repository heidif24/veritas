import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

export default function PublishersPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Publishers & enterprise</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Verified authorship for submissions, reviews, and archives
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Accept sealed .veritas packages from writers and campuses. Confirm process integrity, AI/plagiarism
            signals, and cryptographic seals before publication — or require Veritas on the way in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register?plan=publisher" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              Start publisher plan
            </Link>
            <Link href="/verify" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Verify a sealed package
            </Link>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { t: "Inbound verification", d: "Upload sealed packages from freelancers, campuses, or agencies and confirm signature + content hash in seconds." },
                { t: "Process evidence", d: "See composition trails and integrity signals when authors draft in Veritas — not only a final file." },
                { t: "AI & plagiarism pass", d: "Segment assistance and similarity checks before you commission or publish." },
                { t: "Archive-ready seals", d: "Signed packages remain verifiable years later for rights, disputes, and compliance." },
                { t: "Team workflows", d: "Shared queues for editors, integrity reviewers, and external counsel." },
                { t: "API-ready path", d: "Enterprise integrations for high-volume intake and automated verify steps." },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-base font-bold text-slate-900">{c.t}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14 text-center">
          <h2 className="text-2xl font-black">Require sealed work. Verify with confidence.</h2>
          <Link href="/pricing" className="mt-6 inline-flex rounded-full bg-cyan-600 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-500">
            See publisher pricing
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
