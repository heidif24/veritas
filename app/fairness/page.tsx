import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

export default function FairnessPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Student fairness</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Why was I flagged?</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Flags are <strong>evidence for review</strong>, not a verdict. Here is how to read them and what you can do.
        </p>
        <ol className="mt-10 list-decimal space-y-6 pl-5 text-sm leading-7 text-slate-700">
          <li><strong className="text-slate-900">Open your evidence report</strong> — every composition has a timeline of process signals, similarity spans, and policy checks.</li>
          <li><strong className="text-slate-900">Read the plain-language factors</strong> — paste share, session structure, style drift, and similarity each carry an explanation.</li>
          <li><strong className="text-slate-900">Confidence bands</strong> — short drafts and sparse event streams produce wider uncertainty.</li>
          <li><strong className="text-slate-900">Talk to your instructor</strong> — faculty can accept, request revision, or refer to the integrity office.</li>
          <li><strong className="text-slate-900">Appeal</strong> — file an appeal with your explanation. Appeals are logged for the integrity office.</li>
        </ol>
        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          Veritas will never market “100% AI detection.” We market authorship evidence you and your institution can defend.
        </div>
        <Link href="/methodology" className="mt-8 inline-block text-sm font-semibold text-cyan-700 hover:underline">Read the full methodology →</Link>
      </main>
      <SiteFooter />
    </div>
  );
}
