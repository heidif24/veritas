import Link from "next/link";

export const metadata = {
  title: "Cookie Policy — Veritas",
  description: "How Veritas uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <article className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">Legal</p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ink)]">Cookie Policy</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: October 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-[var(--muted)]">
          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">What we use</h2>
            <p className="mt-2">
              Veritas uses essential cookies and similar storage to keep you signed in, remember language preferences,
              and protect sessions. These are required for the product to function.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Essential</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-[var(--ink)]">Session cookie</strong> — authenticates your account (httpOnly)
              </li>
              <li>
                <strong className="text-[var(--ink)]">Locale preference</strong> — stores language choice where enabled
              </li>
            </ul>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Analytics & marketing</h2>
            <p className="mt-2">
              We do not rely on third-party advertising cookies for the core academic product. If optional analytics are
              enabled for a deployment, they will be disclosed and configurable by the operator.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">Managing cookies</h2>
            <p className="mt-2">
              You can clear cookies in your browser settings. Disabling essential cookies will sign you out and may
              prevent login and workspace features from working.
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
