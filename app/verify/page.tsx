"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import { useLocale } from "@/app/components/locale-provider";

export default function VerifyPage() {
  const { t } = useLocale();

  const initialChecks = [
    { label: t("verify.check.status"), value: t("verify.awaiting") },
    { label: t("verify.check.signature"), value: t("verify.pending") },
    { label: t("verify.check.integrity"), value: t("verify.pending") },
    { label: t("verify.check.confidence"), value: t("verify.pending") },
  ];

  const [status, setStatus] = useState("Awaiting file");
  const [summary, setSummary] = useState(t("verify.summary.idle"));
  const [checks, setChecks] = useState(initialChecks);

  const verificationState = useMemo(() => {
    if (status === "Verified") {
      return { tone: "border-emerald-200 bg-emerald-50 text-emerald-800", label: t("verify.verified") };
    }
    if (status === "Failed") {
      return { tone: "border-red-200 bg-red-50 text-red-800", label: t("verify.failed") };
    }
    if (status === "Invalid") {
      return { tone: "border-amber-200 bg-amber-50 text-amber-800", label: t("verify.invalid") };
    }
    return { tone: "border-slate-200 bg-slate-50 text-slate-700", label: t("verify.awaiting") };
  }, [status, t]);

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
        setSummary(t("verify.summary.ok"));
        setChecks([
          { label: t("verify.check.status"), value: t("verify.sealed") },
          { label: t("verify.check.signature"), value: t("verify.valid") },
          { label: t("verify.check.integrity"), value: t("verify.matched") },
          { label: t("verify.check.confidence"), value: t("verify.high") },
        ]);
        return;
      }

      setStatus("Failed");
      setSummary(result.result?.reason || t("verify.summary.fail"));
      setChecks([
        { label: t("verify.check.status"), value: t("verify.altered") },
        { label: t("verify.check.signature"), value: t("verify.invalidSig") },
        { label: t("verify.check.integrity"), value: t("verify.mismatch") },
        { label: t("verify.check.confidence"), value: t("verify.low") },
      ]);
    } catch {
      setStatus("Invalid");
      setSummary(t("verify.summary.invalid"));
      setChecks(initialChecks);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-12 md:pt-14">
        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-700">{t("verify.badge")}</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          {t("verify.title")}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">{t("verify.sub")}</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-2xl border border-dashed border-cyan-300 bg-cyan-50/40 p-10 text-center">
            <p className="text-base font-semibold text-slate-900">{t("verify.drop")}</p>
            <p className="mt-1.5 text-sm text-slate-500">{t("verify.filetype")}</p>
            <label className="mt-5 inline-flex cursor-pointer rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
              {t("verify.select")}
              <input type="file" className="hidden" accept=".json,.veritas" onChange={handleFile} />
            </label>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{t("verify.result")}</p>
          <div className={`mt-3 rounded-xl border p-4 ${verificationState.tone}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.14em]">{t("verify.status")}</div>
            <div className="mt-1.5 text-xl font-black">{verificationState.label}</div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{summary}</p>
          <div className="mt-4 space-y-2">
            {checks.map((check) => (
              <div
                key={check.label}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <span className="text-sm text-slate-600">{check.label}</span>
                <span className="text-sm font-semibold text-slate-900">{check.value}</span>
              </div>
            ))}
          </div>
          <Link href="/" className="mt-5 inline-block text-sm font-medium text-cyan-700 hover:text-cyan-800">
            ← {t("verify.back")}
          </Link>
        </aside>
      </section>
    </main>
  );
}
