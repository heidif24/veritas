import Link from "next/link";

export const metadata = {
  title: "Student fairness — Veritas",
  description: "How students at a licensed university should read a Veritas flag.",
};

export default function FairnessPage() {
  const steps = [
    ["Open the evidence", "Every composition has a timeline of process signals, similarity spans, and policy checks."],
    ["Read the factors in plain language", "Paste share, session structure, style drift, and similarity each carry an explanation."],
    ["Notice the confidence", "Short drafts and sparse event streams produce wider uncertainty. A thin record is not a confession."],
    ["Talk to your instructor", "Faculty can accept the work, ask for revision, or refer it to the integrity office."],
    ["Appeal if you need to", "File an explanation. Appeals are logged for the office your university designates."],
  ];

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      <section className="m-band">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">Student fairness</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] md:text-5xl">Why was I flagged?</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            A flag is evidence for a person to read. It is not a grade, and it is not a finding. This is how to
            read it inside a licensed university.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <ol className="space-y-4">
          {steps.map(([title, body], i) => (
            <li key={title} className="m-card grid gap-3 p-5 sm:grid-cols-[3rem_1fr]">
              <span className="font-mono text-xs text-[var(--emerald)]">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm leading-7 text-[var(--muted)]">
          Veritas will not market “100% AI detection.” The product is authorship evidence a university can defend.
        </p>
        <Link href="/methodology" className="mt-4 inline-block text-sm font-semibold text-[var(--emerald)] hover:underline">
          Read the methodology →
        </Link>
      </section>
    </main>
  );
}
