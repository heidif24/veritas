"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

const initialChecks = [
  { label: "Document status", value: "Awaiting file" },
  { label: "Signature", value: "Pending" },
  { label: "Integrity", value: "Pending" },
  { label: "Confidence", value: "Pending" },
];

export default function VerifyPage() {
  const [status, setStatus] = useState("Awaiting file");
  const [summary, setSummary] = useState("Upload a sealed Veritas package to confirm authenticity.");
  const [checks, setChecks] = useState(initialChecks);

  const verificationState = useMemo(() => {
    if (status === "Verified") {
      return { tone: "border-emerald-200 bg-emerald-50 text-emerald-800", label: "Verified" };
    }
    if (status === "Failed") {
      return { tone: "border-red-200 bg-red-50 text-red-800", label: "Verification failed" };
    }
    if (status === "Invalid") {
      return { tone: "border-amber-200 bg-amber-50 text-amber-800", label: "Invalid file" };
    }
    return { tone: "border-slate-200 bg-slate-50 text-slate-700", label: "Awaiting file" };
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
        setStatus("Verified");
        setSummary("This package has a valid signature and matching content hash. The document has not been altered after sealing.");
        setChecks([
          { label: "Document status", value: "Sealed" },
          { label: "Signature", value: "Valid" },
          { label: "Integrity", value: "Matched" },
          { label: "Confidence", value: "High" },
        ]);
        return;
      }

      setStatus("Failed");
      setSummary(result.result?.reason || "This package could not be validated. The content may have been changed after sealing.");
      setChecks([
        { label: "Document status", value: "Altered" },
        { label: "Signature", value: "Invalid" },
        { label: "Integrity", value: "Mismatch" },
        { label: "Confidence", value: "Low" },
      ]);
    } catch {
      setStatus("Invalid");
      setSummary("This file is not a valid Veritas package. Please upload a signed .veritas JSON export.");
      setChecks(initialChecks);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Public verification</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          Confirm a document is authentic
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
          Upload a sealed Veritas package to validate its signature and integrity. Results are immediate.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-24 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="rounded-[22px] border border-dashed border-cyan-300 bg-cyan-50/40 p-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Drop your package here</p>
            <p className="mt-2 text-sm text-slate-500">Signed .veritas JSON export</p>
            <label className="mt-6 inline-flex cursor-pointer rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              Select file
              <input type="file" className="hidden" accept=".json,.veritas" onChange={handleFile} />
            </label>
          </div>
        </div>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Result</p>
          <div className={`mt-4 rounded-2xl border p-4 ${verificationState.tone}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.16em]">Status</div>
            <div className="mt-2 text-2xl font-black">{verificationState.label}</div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">{summary}</p>
          <div className="mt-6 space-y-3">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">{check.label}</span>
                <span className="text-sm font-semibold text-slate-900">{check.value}</span>
              </div>
            ))}
          </div>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-cyan-700 hover:text-cyan-800">
            ← Back to home
          </Link>
        </aside>
      </section>
    </main>
  );
}
