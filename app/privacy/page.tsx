import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Veritas",
  description: "How Veritas collects, uses, and protects personal and academic data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <article className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">Legal</p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ink)]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: October 2026</p>

        <div className="prose-veritas mt-10 space-y-6 text-sm leading-7 text-[var(--muted)]">
          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">1. Who we are</h2>
            <p className="mt-2">
              Veritas provides academic integrity tools licensed to universities: writing process records, instructor
              review, and cryptographic seals. This policy explains what data we process and why. Students and
              instructors are covered through their institution.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">2. Data we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account details: name, email, role, organisation affiliation</li>
              <li>Documents you create, revise, submit, or seal for a course</li>
              <li>Writing process signals used for integrity review (not sold to advertisers)</li>
              <li>Session metadata for login security (IP, device fingerprint where enabled)</li>
              <li>Billing identifiers for a university licence, when a contract uses a payment provider</li>
            </ul>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">3. How we use data</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Provide sealing, verification, assignment, and submission features</li>
              <li>Secure accounts and prevent abuse</li>
              <li>Improve product reliability and academic support workflows</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">4. Sharing</h2>
            <p className="mt-2">
              We do not sell personal data. We share data only with processors needed to run the service (hosting,
              payments, email), with your institution when you join a tenant, or when required by law.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">5. Your rights</h2>
            <p className="mt-2">
              Depending on your region, you may request access, correction, deletion, or export of your personal data.
              Contact your institution admin or the Veritas operator for privacy requests.
            </p>
          </section>

          <section className="v-card p-6">
            <h2 className="font-display text-xl text-[var(--ink)]">6. Contact</h2>
            <p className="mt-2">
              For privacy questions, use the contact path on the onboarding page or your institutional Veritas admin.
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
