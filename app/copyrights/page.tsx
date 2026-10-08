import Link from "next/link";

export const metadata = {
  title: "Copyrights Notice — Veritas",
  description: "Copyright and intellectual property notice for Veritas.",
};

export default function CopyrightsPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <article className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">Legal</p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ink)]">Copyrights Notice</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: October 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-[var(--muted)]">
          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Platform content</h2>
            <p className="mt-2">
              The Veritas name, logos, UI design, documentation, and software are protected by copyright and other
              intellectual property laws. You may not copy, reverse engineer, or redistribute the platform except as
              allowed by your licence agreement.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Your academic work</h2>
            <p className="mt-2">
              Students and authors retain ownership of the writing they produce. Veritas processes and stores content
              only to provide sealing, verification, institutional workflows, and optional tutoring. Tutors may view
              shared drafts only for the purpose of guidance during a booked session.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Institutional corpus</h2>
            <p className="mt-2">
              Reference materials uploaded by institutions remain subject to the licences and rights those institutions
              hold. Veritas does not claim ownership of institutional corpora.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Infringement</h2>
            <p className="mt-2">
              If you believe material on Veritas infringes your copyright, contact the operator with sufficient detail
              to identify the work and the claimed rights so we can investigate promptly.
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
