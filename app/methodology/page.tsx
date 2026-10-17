import Link from "next/link";

export const metadata = {
  title: "Methodology — Veritas",
  description: "What Veritas measures for universities, and what it does not claim.",
};

export default function MethodologyPage() {
  const layers = [
    ["01", "Behaviour", "Keystroke timing, paste and delete events, focus, and revision ratios captured while a student writes in the studio."],
    ["02", "Structure", "Session shape, bulk inserts, late-paste concentration, and how the draft grew."],
    ["03", "Text", "Institutional corpus and cross-submission similarity, with quoted material down-weighted. External providers only when the university configures them."],
    ["04", "Style", "Light stylometric drift against earlier drafts of the same piece, when snapshots exist."],
    ["05", "Custody", "A cryptographic seal — hash and signature — and public verification of the portable package."],
    ["06", "Policy", "Course genre and thresholds map signals to allow, warn, or hold. Faculty can always override."],
  ];

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      <section className="m-band">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">Methodology</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] md:text-5xl">
            Evidence for review. Not an automated verdict.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            Veritas produces authorship evidence packages for universities. It does not issue misconduct findings,
            and it does not claim certainty that text is or is not machine-written.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <ol className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {layers.map(([n, title, body]) => (
            <li key={n} className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr]">
              <span className="font-mono text-xs text-[var(--emerald)]">{n}</span>
              <div>
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-2xl border border-[#C5A34B]/40 bg-[var(--gold-soft)] p-6 text-sm leading-7 text-[#5c4a1e]">
          <h2 className="font-display text-2xl text-[var(--ink)]">What we do not claim</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>That any percentage proves machine authorship beyond reasonable doubt</li>
            <li>That behavioural signals cannot be manipulated</li>
            <li>That a clean report means the scholarship is original in every sense</li>
          </ul>
        </div>
        <Link href="/fairness" className="mt-8 inline-block text-sm font-semibold text-[var(--emerald)] hover:underline">
          Student fairness: why was I flagged? →
        </Link>
      </section>
    </main>
  );
}
