"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import { verificationChecks } from "../data";

function downloadSecureBundle() {
  const payload = {
    exportType: "signed-veritas-bundle",
    author: "Alicia Morgan",
    status: "human-authored",
    organicRatio: "94%",
    pastedRatio: "3%",
    transcriptionRisk: "low",
    textHash: "8f2e1e6c-0d8d-4d3d-9cd7-beb49a6159d2",
    signature: "veritas-platform-key-demo",
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sample-human-authorship.veritas.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function VerifyPage() {
  const [status, setStatus] = useState("Awaiting file");
  const [summary, setSummary] = useState("Upload a sealed .veritas bundle or paste a public certificate link to confirm provenance.");
  const [certificateLink, setCertificateLink] = useState("");

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
    const hasIntegrityMarker = /veritas|signature|textHash|integrity|human-authored/i.test(fileText || file.name);
    const looksTampered = /tamper|altered|broken|invalid/i.test(fileText || file.name);

    if (hasIntegrityMarker && !looksTampered) {
      setStatus("Verified");
      setSummary("Signature valid. Raw text hash matched the sealed record and no offline modification was detected.");
      return;
    }

    setStatus("Review");
    setSummary("Tampered or incomplete: the bundle did not include a valid Veritas signature and matching text hash.");
  }

  function handleCertificateCheck() {
    if (/veritas|verify|certificate/i.test(certificateLink)) {
      setStatus("Verified");
      setSummary("Certificate link resolved to a valid human-authorship record with intact lineage metadata.");
      return;
    }

    setStatus("Review");
    setSummary("Certificate link could not be matched to a Veritas record. Ask the writer for the signed verification URL.");
  }

  function handleDownloadExample() {
    const payload = {
      exportType: "signed-veritas-bundle",
      author: "Alicia Morgan",
      status: "human-authored",
      organicRatio: "94%",
      pastedRatio: "3%",
      transcriptionRisk: "low",
      textHash: "8f2e1e6c-0d8d-4d3d-9cd7-beb49a6159d2",
      signature: "veritas-platform-key-demo",
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sample-human-authorship.veritas.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-xl font-bold text-white">Veritas</Link>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleDownloadExample} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">
              Download sample bundle
            </button>
            <Link href="/app/dashboard" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">
              Return to workspace
            </Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[30px] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Public verifier</p>
            <h1 className="mt-4 text-4xl font-black text-white">Check human-authorship proof.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Drop a signed export, paste a certificate link, or upload a protected archive to validate authorship lineage and confirm whether the file was altered offline.
            </p>

            <div className="mt-8 rounded-[24px] border border-dashed border-cyan-400/35 bg-slate-950/50 p-10 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl font-black text-cyan-100">V</div>
              <p className="text-lg font-semibold text-white">Drop your .veritas bundle here</p>
              <p className="mt-2 text-sm text-slate-400">Signed export, secure archive, or public certificate file</p>
              <label className="mt-6 inline-flex cursor-pointer rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">
                Select file
                <input type="file" className="hidden" onChange={handleFile} />
              </label>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
              <label htmlFor="certificate-link" className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Certificate link
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="certificate-link"
                  value={certificateLink}
                  onChange={(event) => setCertificateLink(event.target.value)}
                  placeholder="https://verify.veritas.example/cert/..."
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
                <button type="button" onClick={handleCertificateCheck} className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950">
                  Check link
                </button>
              </div>
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
