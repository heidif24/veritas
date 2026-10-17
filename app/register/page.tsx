import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      <section className="m-band">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">
            Universities only
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] md:text-5xl">
            Accounts come from the university.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            There is no self-serve signup for individuals, tutors, or publishers. A campus licenses Veritas,
            then provisions students and instructors.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-14 md:grid-cols-2">
        <article className="m-card p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--emerald)]">For the institution</p>
          <h2 className="mt-3 font-display text-3xl">Start a licence conversation</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Contact support with the university name, domains, and how faculty should launch from Moodle or
            another LMS. We issue access and help you customize branding and policy.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary">
              Institutional onboarding
            </Link>
            <a href="mailto:support@veritas.io" className="v-btn v-btn-secondary">
              support@veritas.io
            </a>
          </div>
        </article>

        <article className="m-card p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--emerald)]">Already on campus</p>
          <h2 className="mt-3 font-display text-3xl">Sign in with your account</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            If your university is licensed, use the email the institution gave you. Student writing, submission,
            and instructor review are unchanged.
          </p>
          <Link href="/login" className="v-btn v-btn-secondary mt-6">
            Sign in
          </Link>
        </article>
      </section>
    </main>
  );
}
