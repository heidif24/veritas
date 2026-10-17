import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--paper)] px-6 text-[var(--ink)]">
      <div className="max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--emerald)]">404</p>
        <h1 className="mt-3 font-display text-4xl">This page is not part of Veritas.</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          The university site, verification, and licensing pages are still available.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="v-btn v-btn-primary">
            Home
          </Link>
          <Link href="/onboarding?intent=institution" className="v-btn v-btn-secondary">
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
