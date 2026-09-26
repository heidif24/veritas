import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Transparency</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">What Veritas measures — and what it does not claim</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Veritas produces <strong>authorship evidence packages</strong> for human review. It does not issue automated
          misconduct findings and does not claim certainty that text is or is not AI-generated.
        </p>
        <section className="mt-12 space-y-8 text-sm leading-7 text-slate-700">
          <div><h2 className="text-lg font-bold text-slate-900">1. Behavioural layer</h2><p className="mt-2">Keystroke timing, paste/delete events, focus loss, and revision ratios captured while writing in Integrity Studio.</p></div>
          <div><h2 className="text-lg font-bold text-slate-900">2. Structural layer</h2><p className="mt-2">Session segmentation, bulk-insert detection, late-paste concentration, and growth curves over the writing session.</p></div>
          <div><h2 className="text-lg font-bold text-slate-900">3. Text layer</h2><p className="mt-2">Institutional corpus and cross-submission similarity, citation-aware down-weighting of quoted material, and paraphrase-oriented span overlap. Optional licensed external providers when configured.</p></div>
          <div><h2 className="text-lg font-bold text-slate-900">4. Style layer</h2><p className="mt-2">Lightweight stylometric drift against earlier drafts of the same composition when snapshots exist.</p></div>
          <div><h2 className="text-lg font-bold text-slate-900">5. Custody layer</h2><p className="mt-2">Cryptographic seal (hash + signature) and public verification of the portable .veritas package.</p></div>
          <div><h2 className="text-lg font-bold text-slate-900">6. Policy layer</h2><p className="mt-2">Course genre and thresholds map signals to allow / warn / block — always overridable by faculty.</p></div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-bold text-amber-950">What we do not claim</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-950/90">
              <li>That any percentage proves AI authorship beyond reasonable doubt</li>
              <li>That behavioural signals cannot be adversarially manipulated</li>
              <li>That absence of flags means original scholarly work in every sense</li>
            </ul>
          </div>
        </section>
        <Link href="/fairness" className="mt-10 inline-block text-sm font-semibold text-cyan-700 hover:underline">Student fairness: why was I flagged? →</Link>
      </main>
      <SiteFooter />
    </div>
  );
}
