import Link from "next/link";

export const metadata = {
  title: "Refund Policy — Veritas",
  description: "How university licences of Veritas are billed and corrected.",
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
            <h2 className="font-display text-xl text-[var(--ink)]">University licences</h2>
            <p className="mt-2">
              Veritas is sold to universities under a written agreement or quote. Fees follow that agreement.
              Amounts already invoiced for a current term are generally non-refundable unless the law requires it
              or a billing error occurred. There are no individual, tutor, or publisher subscriptions to cancel.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Billing errors</h2>
            <p className="mt-2">
              If a campus was charged in error, the contracting administrator should write to support within 14 days
              with the invoice reference. Approved corrections are returned to the original payment method where the
              provider allows it.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">How to request</h2>
            <p className="mt-2">
              Write to{" "}
              <a className="font-semibold text-[var(--ink)]" href="mailto:support@veritas.io">
                support@veritas.io
              </a>{" "}
              from the institutional admin contact, with the invoice reference.
            </p>
          </section>

          <section className="v-card p-6 border-[var(--gold)]/30 bg-[var(--gold-soft)]">
            <h2 className="font-display text-xl text-[var(--ink)]">Test billing</h2>
            <p className="mt-2 text-[#7a6220]">
              If a payment provider is in test mode, no live charge is taken. Test checkouts are not invoices.
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
