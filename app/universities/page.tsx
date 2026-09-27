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
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Campus integrity: process, proctoring, LMS, and sealed submissions
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Onboard once. Students with your domain write free. Faculty create writing and objective assignments,
            enable proctored sessions, launch from Canvas or Moodle via LTI, review evidence packages, and seal
            outcomes for verification after handoff.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding?intent=institution" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              Discuss institutional pricing
            </Link>
            <Link href="/register" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Preview faculty tools
            </Link>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">What campuses get</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { t: "Process monitoring", d: "Composition trails for every draft — keystrokes, pastes, focus, revisions — so review is grounded in how work was built." },
                { t: "Proctored assignments", d: "Optional secure sessions with visibility, fullscreen, and focus event logs. Honest browser evidence for high-stakes work." },
                { t: "Canvas & Moodle (LTI 1.3)", d: "Launch Veritas from your LMS. Students authenticate through campus SSO paths; faculty stay in their gradebook workflow." },
                { t: "AI + plagiarism together", d: "Segment-level AI assistance and corpus similarity in one report — flags invite conversation, not automatic penalties." },
                { t: "Objective questions & timers", d: "Mix writing with timed objective checks under the same assignment and integrity model." },
                { t: "Seal & public verify", d: "Signed .veritas packages (SHA-256 + Ed25519). External reviewers confirm integrity without an account." },
                { t: "Multi-tenant admin", d: "Domain-based free student access, faculty seats, policy thresholds, analytics, and audit logs." },
                { t: "Fairness & appeals", d: "Students can read evidence factors, discuss with instructors, and file appeals that are logged for the integrity office." },
                { t: "FERPA-minded design", d: "Institutional controls over data retention and access. Process evidence stays with your tenancy." },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-base font-bold text-slate-900">{c.t}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">How onboarding works</h2>
          <ol className="mt-8 space-y-4">
            {[
              "Institutional agreement and domain verification so eligible students write free.",
              "Configure LTI 1.3 (Canvas, Moodle, or other) or use Veritas-native assignment invites.",
              "Faculty create writing / objective / proctored assignments and invite by email or LMS launch.",
              "Students draft with process capture; instructors review evidence; seal packages for archives and external verify.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <span className="text-lg font-black text-cyan-600">0{i + 1}</span>
                <span className="text-sm leading-6 text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/onboarding?intent=institution" className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-500">
              Start institutional onboarding
            </Link>
            <Link href="/methodology" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Read methodology
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
