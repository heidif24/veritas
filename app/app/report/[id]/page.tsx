"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VeritasMark } from "@/app/components/veritas-logo";

type Report = {
  documentId: string;
  title: string;
  generatedAt: string;
  summary: { overall: string; headline: string; sealed: boolean; sealedHash?: string | null };
  composition: { aiRiskScore: number; aiRiskLabel: string; organicRatio: number; pastedRatio: number; signalSummary: string; notes: string[] };
  session: { structuralLabel: string; structuralRisk: number; bulkInsertEvents: number; latePasteRatio: number; segmentCount: number; notes: string[]; totalDurationMs: number };
  style: { driftLabel: string; driftScore: number; notes: string[] };
  similarity: { score: number; threshold: number; matches: Array<{ snippet: string; sourceTitle?: string; similarityPercentage: number }> };
  policy: { action: string; allowed: boolean; reasons: string[] };
  timeline: Array<{ label: string; detail: string; severity: string }>;
  methodology: string[];
};

const overallTone: Record<string, string> = {
  clear: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review: "bg-amber-50 text-amber-900 ring-amber-200",
  elevated: "bg-orange-50 text-orange-900 ring-orange-200",
  critical: "bg-red-50 text-red-900 ring-red-200",
};

export default function IntegrityReportPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok) setError(data.error || "Could not load report.");
        else setReport(data.report);
      } catch {
        setError("Failed to load integrity report.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Building evidence package…</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-sm text-red-600">{error || "Report unavailable."}</p>
        <Link href="/app/dashboard" className="mt-4 inline-block text-sm font-medium text-cyan-700">← Workspace</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 print:bg-white">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <VeritasMark />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Integrity evidence</p>
              <h1 className="text-lg font-semibold tracking-tight">{report.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => window.print()} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">Export PDF</button>
            <Link href={`/app/editor/${report.documentId}`} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Open composition</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <section className={`rounded-2xl border p-6 ring-1 ${overallTone[report.summary.overall] || overallTone.review}`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide">{report.summary.overall}</span>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">{report.summary.sealed ? "Sealed" : "Unsealed"}</span>
          </div>
          <p className="mt-3 text-xl font-semibold tracking-tight">{report.summary.headline}</p>
          <p className="mt-2 text-xs opacity-80">Generated {new Date(report.generatedAt).toLocaleString()}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Authorship risk", value: `${report.composition.aiRiskScore}%`, sub: report.composition.aiRiskLabel },
            { label: "Similarity", value: `${report.similarity.score}%`, sub: `Limit ${report.similarity.threshold}%` },
            { label: "Session", value: report.session.structuralLabel, sub: `${report.session.segmentCount} segments` },
            { label: "Policy", value: report.policy.action, sub: report.policy.allowed ? "May proceed" : "Blocked" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
              <p className="mt-2 text-2xl font-black tracking-tight capitalize">{card.value}</p>
              <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Evidence timeline</h2>
          <ul className="mt-4 space-y-3">
            {report.timeline.map((item) => (
              <li key={item.label} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.severity === "critical" ? "bg-red-500" : item.severity === "warn" ? "bg-amber-400" : "bg-emerald-500"}`} />
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Composition</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{report.composition.signalSummary}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Organic</p><p className="font-bold">{(report.composition.organicRatio * 100).toFixed(0)}%</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Paste</p><p className="font-bold">{(report.composition.pastedRatio * 100).toFixed(0)}%</p></div>
            </div>
            <ul className="mt-4 space-y-1 text-xs text-slate-600">{report.composition.notes.map((n) => (<li key={n}>· {n}</li>))}</ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Session structure</h2>
            <p className="mt-3 text-sm text-slate-600">Structural risk {(report.session.structuralRisk * 100).toFixed(0)}% · {report.session.bulkInsertEvents} bulk insert(s) · late paste {(report.session.latePasteRatio * 100).toFixed(0)}%</p>
            <ul className="mt-4 space-y-1 text-xs text-slate-600">{report.session.notes.map((n) => (<li key={n}>· {n}</li>))}</ul>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">Style drift: <strong className="capitalize">{report.style.driftLabel}</strong> ({(report.style.driftScore * 100).toFixed(0)}%)<p className="mt-1">{report.style.notes[0]}</p></div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Similarity matches</h2>
          {report.similarity.matches.length ? (
            <ul className="mt-4 space-y-3">
              {report.similarity.matches.map((m, i) => (
                <li key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-500"><span>{m.sourceTitle || "Source"}</span><span>{m.similarityPercentage}%</span></div>
                  <p className="mt-2 text-sm text-slate-700">{m.snippet}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No material similarity matches above the reporting floor.</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Policy evaluation</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">{report.policy.reasons.map((r) => (<li key={r}>· {r}</li>))}</ul>
        </section>

        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Methodology</h2>
          <ul className="mt-3 space-y-1 text-xs leading-5 text-slate-500">{report.methodology.map((m) => (<li key={m}>· {m}</li>))}</ul>
        </section>
      </main>
    </div>
  );
}
