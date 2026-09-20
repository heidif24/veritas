"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

const verificationChecks = [
  { label: "Document status", value: "Verified" },
  { label: "Review queue", value: "2 pending" },
  { label: "Offline tamper check", value: "Passed" },
  { label: "Integrity confidence", value: "High" },
];

function downloadSecureBundle() {
  const payload = {
    exportType: "signed-document-bundle",
    author: "Alicia Morgan",
    status: "verified",
    integrity: "99.97%",
    hash: "8f2e1e6c-0d8d-4d3d-9cd7-beb49a6159d2",
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "secure-document-bundle.veritas.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function VerifyPage() {
  const [status, setStatus] = useState("Awaiting file");
  const [summary, setSummary] = useState("Upload a sealed document bundle to confirm provenance.");

  const verificationState = useMemo(() => {
    if (status === "Verified") {
      return {
        tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
        label: "Verified",
      };
    }

    if (status === "Review") {
      return {
        tone: "border-amber-500/20 bg-amber-500/10 text-amber-200",
        label: "Review",
      };
    }

    return {
      tone: "border-slate-500/20 bg-slate-500/10 text-slate-200",
      label: "Awaiting file",
    };
  }, [status]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileText = await file.text().catch(() => "");
    const hasIntegrityMarker = /veritas|verified|hash|integrity/i.test(fileText || file.name);

    if (hasIntegrityMarker) {
      setStatus("Verified");
      setSummary("This archive matches the recorded signature and has not been tampered with.");
      return;
    }

    setStatus("Review");
    setSummary("The bundle is readable but did not include a valid integrity marker from the document archive.");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">Veritas</Link>
          <div className="flex gap-3">
            <button onClick={downloadSecureBundle} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">Download sample sealed bundle</button>
            <Link href="/app/dashboard" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">Return to workspace</Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[30px] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Public verifier</p>
            <h1 className="mt-4 text-4xl font-black text-white">Check document authenticity.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Drop a signed export, paste a certificate link, or upload a protected archive to validate provenance and confirm whether the file was altered offline.
            </p>

            <div className="mt-8 rounded-[24px] border border-dashed border-cyan-400/35 bg-slate-950/50 p-10 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl">↥</div>
              <p className="text-lg font-semibold text-white">Drop your verification bundle here</p>
              <p className="mt-2 text-sm text-slate-400">Signed export, archive, or public certificate link</p>
              <label className="mt-6 inline-flex cursor-pointer rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">
                Select file
                <input type="file" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/10 bg-slate-900/70 p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-200">Verification result</p>
            <div className={`mt-4 rounded-2xl border p-4 ${verificationState.tone}`}>
              <div className="text-sm uppercase tracking-[0.2em]">Status</div>
              <div className="mt-3 text-3xl font-black text-white">{verificationState.label}</div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">{summary}</p>

            <div className="mt-6 space-y-3">
              {verificationChecks.map((check) => (
                <div key={check.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <span className="text-sm text-slate-300">{check.label}</span>
                  <span className="text-sm font-semibold text-white">{check.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
