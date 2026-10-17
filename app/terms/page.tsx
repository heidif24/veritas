import Link from "next/link";

export const metadata = {
  title: "Terms — Veritas",
  description: "Terms for university licences of the Veritas academic integrity platform.",
};

export default function TermsPage() {
  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">Legal</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Terms of use</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: October 2026</p>

        <div className="mt-10 space-y-5 text-sm leading-7 text-[var(--muted)]">
          <section className="m-card p-6">
            <h2 className="font-display text-2xl text-[var(--ink)]">Who these terms cover</h2>
            <p className="mt-2">
              Veritas is licensed to universities and academic institutions. Students and instructors use the
              service under their institution’s agreement. There is no separate consumer, tutor, or publisher plan.
            </p>
          </section>
          <section className="m-card p-6">
            <h2 className="font-display text-2xl text-[var(--ink)]">The campus licence</h2>
            <p className="mt-2">
              Access codes, seats, branding, and policy are controlled by the licensing university. Fees, term, and
              support are set in the institutional agreement or the written quote from support — not by a public
              checkout.
            </p>
          </section>
          <section className="m-card p-6">
            <h2 className="font-display text-2xl text-[var(--ink)]">Academic use</h2>
            <p className="mt-2">
              Writing records, similarity signals, and seals are evidence for human review. Veritas does not issue
              an automated finding of misconduct. Faculty and the institution remain responsible for academic
              decisions.
            </p>
          </section>
          <section className="m-card p-6">
            <h2 className="font-display text-2xl text-[var(--ink)]">Acceptable use</h2>
            <p className="mt-2">
              Do not attempt to break seals, scrape other students’ work, or misrepresent a package as verified
              when it is not. Institutions may suspend accounts that abuse the service.
            </p>
          </section>
          <section className="m-card p-6">
            <h2 className="font-display text-2xl text-[var(--ink)]">Contact</h2>
            <p className="mt-2">
              Licence questions:{" "}
              <a className="font-semibold text-[var(--emerald)]" href="mailto:support@veritas.io">
                support@veritas.io
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-10 text-sm">
          <Link href="/" className="font-semibold text-[var(--emerald)] hover:underline">
            ← Back to home
          </Link>
        </p>
      </article>
    </main>
  );
}
