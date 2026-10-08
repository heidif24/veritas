import Link from "next/link";

export const metadata = {
  title: "Refund Policy — Veritas",
  description: "Refunds for Veritas subscriptions and writing tutor sessions.",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <article className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">Legal</p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ink)]">Refund Policy</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: October 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-[var(--muted)]">
          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Subscriptions</h2>
            <p className="mt-2">
              Individual and publisher monthly plans may be cancelled at any time. Fees already charged for the current
              billing period are generally non-refundable unless required by law or a billing error occurred. Institution
              contracts follow the terms in the signed agreement.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Writing tutor sessions</h2>
            <p className="mt-2">
              Coaching is charged per booked session. If a tutor cancels or technical failure prevents the session,
              you may request a full credit or refund of that session fee. No-shows by the student after a confirmed
              booking may not be refundable. Platform service fees on completed sessions are non-refundable once the
              session is marked complete and the tutor is paid.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">How to request</h2>
            <p className="mt-2">
              Contact support through your account or institutional admin within 14 days of the charge, with the
              invoice or session ID. Approved refunds are returned to the original payment method where the provider
              allows it.
            </p>
          </section>

          <section className="v-card p-6 border-[var(--gold)]/30 bg-[var(--gold-soft)]">
            <h2 className="font-display text-xl text-[var(--ink)]">Demo mode</h2>
            <p className="mt-2 text-[#7a6220]">
              While payment providers are in demo or test mode, no live charges are taken. Demo checkouts must not be
              treated as real payments.
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
