"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

const verificationChecks = [
  { label: "Document status", value: "Awaiting file" },
  { label: "Review queue", value: "Pending" },
  { label: "Offline tamper check", value: "Pending" },
  { label: "Integrity confidence", value: "Pending" },
];

export default function VerifyPage() {
  const [status, setStatus] = useState("Awaiting file");
  const [summary, setSummary] = useState("Upload a sealed document bundle to confirm provenance.");
  const [checks, setChecks] = useState(verificationChecks);

  const verificationState = useMemo(() => {
    if (status === "Sealed") {
      return {
        tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
        label: "Sealed",
      };
    }

    if (status === "CRITICAL TAMPER ALERT") {
      return {
        tone: "border-red-500/20 bg-red-500/10 text-red-200",
        label: "CRITICAL TAMPER ALERT",
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

    try {
      const text = await file.text();
      const bundle = JSON.parse(text);
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle }),
      });

      const result = await response.json();

      if (result.ok && result.status === "sealed") {
        setStatus("Sealed");
        setSummary("This bundle has a valid hash and Ed25519 signature. The document has not been tampered with after sealing.");
        setChecks([
          { label: "Document status", value: "Sealed" },
          { label: "Review queue", value: "Pass" },
          { label: "Offline tamper check", value: "Passed" },
          { label: "Integrity confidence", value: "High" },
        ]);
        return;
      }

      setStatus("CRITICAL TAMPER ALERT");
      setSummary(result.result?.reason || "The document bundle failed validation and was altered after sealing.");
      setChecks([
        { label: "Document status", value: "Tampered" },
        { label: "Review queue", value: "Fail" },
        { label: "Offline tamper check", value: "Failed" },
        { label: "Integrity confidence", value: "Low" },
      ]);
    } catch {
      setStatus("Review");
      setSummary("The file was not a valid Veritas bundle. Please upload a signed .veritas JSON export.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">Veritas</Link>
          <div className="flex gap-3">
            <Link href="/app/dashboard" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">Return to workspace</Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[30px] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Public verifier</p>
            <h1 className="mt-4 text-4xl font-black text-white">Check document authenticity.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Upload a signed Veritas bundle to validate the SHA-256 hash and Ed25519 signature. The result is instant and unambiguous.
            </p>

            <div className="mt-8 rounded-[24px] border border-dashed border-cyan-400/35 bg-slate-950/50 p-10 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl">↥</div>
              <p className="text-lg font-semibold text-white">Drop your verification bundle here</p>
              <p className="mt-2 text-sm text-slate-400">Signed .veritas JSON export</p>
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
              {checks.map((check) => (
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
