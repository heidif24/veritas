"use client";

import { useState } from "react";
import { PortalShell } from "../../components/portal-shell";

type NarrativeResponse = {
  documentId: string;
  title: string;
  overall: string;
  headline: string;
  story: string[];
  processCertificate?: {
    plainSummary: string;
    bullets: string[];
    wordCount: number;
    activeWritingMinutes: number;
    compositionRisk: string;
    continuityLabel: string;
    sessionLabel: string;
    deviceSummary: string;
  };
  continuity?: { label: string; notes: string[]; continuity: number };
  pasteOrigin?: { externalBulkEvents: number; notes: string[]; externalBulkRatio: number };
  deviceTrail?: {
    distinctIpCount: number;
    distinctDeviceCount: number;
    flags: { multipleIps: boolean; multipleDevices: boolean };
    ips: string[];
  };
  report?: { summary: { sessionRisk: number; documentRisk: number } };
};

export default function InstructorNarrativePage() {
  const [documentId, setDocumentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NarrativeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!documentId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/integrity/narrative?documentId=${encodeURIComponent(documentId.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const overallColor =
    data?.overall === "clear"
      ? "from-emerald-400 to-teal-500"
      : data?.overall === "review"
        ? "from-amber-400 to-orange-500"
        : "from-rose-400 to-red-500";

  return (
    <PortalShell
      role="instructor"
      title="Integrity narrative"
      subtitle="One coherent story per submission — process, devices, continuity, and seal."
      navItems={[
        { label: "Courses", href: "/instructor/courses", active: false },
        { label: "Assignments", href: "/instructor/assignments", active: false },
        { label: "Review", href: "/instructor/review", active: false },
        { label: "Narrative", href: "/instructor/narrative", active: true },
      ]}
    >
      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
        <label className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Document ID</label>
        <div className="mt-2 flex flex-wrap gap-3">
          <input
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            placeholder="Paste document id…"
            className="min-w-[240px] flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50"
          />
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Build narrative"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      </div>

      {data && (
        <div className="mt-8 space-y-6">
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/60 p-6">
            <div className={`absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${overallColor} opacity-30 blur-2xl`} />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{data.overall}</div>
              <h2 className="mt-2 text-2xl font-black text-white">{data.title}</h2>
              <p className="mt-3 text-slate-300">{data.headline}</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-6">
            <h3 className="text-lg font-bold text-white">Story</h3>
            <ul className="mt-4 space-y-2.5">
              {data.story.map((line, i) => (
                <li key={i} className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-300">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {data.processCertificate && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[24px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
                <h3 className="text-lg font-bold text-white">Process certificate</h3>
                <p className="mt-3 text-sm text-slate-300">{data.processCertificate.plainSummary}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-400">
                  {data.processCertificate.bullets.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[24px] border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-6">
                <h3 className="text-lg font-bold text-white">Signals</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-3">
                    <div className="text-slate-500">Words</div>
                    <div className="font-bold text-white">{data.processCertificate.wordCount}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-3">
                    <div className="text-slate-500">Active min</div>
                    <div className="font-bold text-white">{data.processCertificate.activeWritingMinutes}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-3">
                    <div className="text-slate-500">Continuity</div>
                    <div className="font-bold text-white">{data.processCertificate.continuityLabel}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-3">
                    <div className="text-slate-500">Devices</div>
                    <div className="font-bold text-white">{data.processCertificate.deviceSummary}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.deviceTrail && (
            <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-6">
              <h3 className="text-lg font-bold text-white">Device / IP trail</h3>
              <p className="mt-2 text-sm text-slate-400">
                {data.deviceTrail.distinctIpCount} IP(s) · {data.deviceTrail.distinctDeviceCount} device(s)
                {data.deviceTrail.flags.multipleDevices || data.deviceTrail.flags.multipleIps
                  ? " — multi-device or multi-network activity flagged"
                  : ""}
              </p>
              {data.deviceTrail.ips?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.deviceTrail.ips.map((ip) => (
                    <span key={ip} className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                      {ip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PortalShell>
  );
}
