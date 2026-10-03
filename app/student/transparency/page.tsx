"use client";

import { useState } from "react";
import Link from "next/link";

type TransparencyLive = {
  wordCount: number;
  organicRatio: number;
  pastedRatio: number;
  riskLabel: string;
  signalSummary: string;
  continuity: string;
  sessionStructure: string;
  externalBulkPastes: number;
  activeWritingMinutes: number;
};

export default function StudentTransparencyPage() {
  const [live, setLive] = useState<TransparencyLive | null>(null);
  const [recorded, setRecorded] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      // Demo call with empty ops — editor can POST real ops in production
      const res = await fetch("/api/transparency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ops: [], focusLosses: 0, text: "" }),
      });
      const json = await res.json();
      if (res.ok) {
        setLive(json.live);
        setRecorded(json.recorded ?? []);
        setNotes(json.notes ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-3xl px-6 pb-8 pt-14">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Transparency</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">What Veritas records while you write</h1>
        <p className="mt-3 text-slate-600">
          We show you the same signals used for integrity review. Nothing here is hidden from you.
        </p>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-6 pb-20">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">Always recorded</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {(
              recorded.length
                ? recorded
                : [
                    "Keystroke timing and character counts (not the keys themselves)",
                    "Paste and delete events (size only, not clipboard content)",
                    "Focus loss / tab switch counts",
                    "Login IP and device fingerprint for session integrity",
                  ]
            ).map((item) => (
              <li key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            We never store raw keystrokes or clipboard text. Paste classification uses size and timing only.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Live authorship health</h2>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Updating…" : "Refresh"}
            </button>
          </div>
          {live ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Words", String(live.wordCount)],
                ["Organic ratio", `${Math.round(live.organicRatio * 100)}%`],
                ["Paste share", `${Math.round(live.pastedRatio * 100)}%`],
                ["Risk", live.riskLabel],
                ["Continuity", live.continuity],
                ["Session", live.sessionStructure],
                ["Active writing", `${live.activeWritingMinutes} min`],
                ["External-bulk pastes", String(live.externalBulkPastes)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 font-semibold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Open a draft in the editor to stream live signals here, or press Refresh for a snapshot.
            </p>
          )}
          {notes.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              {notes.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[24px] border border-cyan-200 bg-cyan-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">Baseline writing sample</h2>
          <p className="mt-2 text-sm text-slate-600">
            A short early sample helps compare later work fairly. Your instructor may require one for the course.
          </p>
          <Link
            href="/app/editor/new"
            className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
          >
            Write a baseline sample
          </Link>
        </div>
      </section>
    </main>
  );
}
