import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">For universities</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
            Campus integrity with free student writing once you are onboarded
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Custom institutional agreement. Faculty create assignments, invite students by email, run timed writing or objective checks, and review evidence packages. Students with your domain email write without paying.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding?intent=institution" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              Discuss institutional pricing
            </Link>
            <Link href="/instructor/assignments/new" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Preview faculty tools
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="text-xl font-black">LMS connectivity</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Veritas implements <strong>LTI Advantage 1.3</strong> endpoints for login, launch, and JWKS. Canvas, Moodle, and Blackboard can launch into the student workspace once your IT team configures client ID, deployment, and platform auth URLs.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["Canvas", "Moodle", "Blackboard"].map((lms) => (
              <div key={lms} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center text-sm font-bold text-slate-800">
                {lms}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50/80">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
            {[
              ["Faculty", "Create essay, timed writing, or objective assignments. Invite by email. Review evidence and decide."],
              ["Students", "Free unlimited writing with institutional email. Submit, seal, appeal."],
              ["Integrity office", "Case queue, appeals desk, corpus, and audit trails."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
