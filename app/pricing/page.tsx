"use client";

import Link from "next/link";

const included = [
  ["Writing studio", "The student composition environment already in use — drafts, process, submission."],
  ["Instructor review", "Assignments, folders, deadlines, and evidence beside the paper."],
  ["Seals & verification", "Signed packages that hold after they leave the campus system."],
  ["Tenant & branding", "The university’s name, colours, and policy — not a shared public brand."],
  ["Student access", "Covered by the licence. No individual plan, no card at signup."],
  ["Support", "Onboarding with the people who will run the campus, not a self-serve trial."],
];

export default function PricingPage() {
  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      <section className="m-band">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">Licensing</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] md:text-5xl">
            One agreement with the university.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Veritas is not sold to individuals, tutors, or publishers. A campus licenses the platform,
            customizes it, and issues access. Students write under that licence.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <aside className="m-card overflow-hidden">
          <div className="bg-[#101815] px-7 py-8 text-white">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C5A34B]">University licence</p>
            <p className="mt-4 font-display text-5xl">Custom</p>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Scoped to enrolment, faculties, and how you connect Moodle or your LMS. Quoted with support —
              never a public checkout.
            </p>
          </div>
          <div className="space-y-3 px-7 py-6">
            <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary w-full">
              Contact support
            </Link>
            <a href="mailto:support@veritas.io" className="v-btn v-btn-secondary w-full">
              support@veritas.io
            </a>
            <p className="text-center text-xs leading-5 text-[var(--muted)]">
              Tell us the institution, approximate students, and whether you need LTI.
            </p>
          </div>
        </aside>

        <div>
          <h2 className="font-display text-3xl">What the licence covers</h2>
          <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {included.map(([title, body]) => (
              <li key={title} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <span className="font-semibold">{title}</span>
                <span className="text-sm leading-7 text-[var(--muted)]">{body}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
            Individual, tutor, and publisher plans are retired. If a campus is already licensed, students and
            instructors sign in — they do not buy a seat.
          </p>
        </div>
      </section>
    </main>
  );
}
