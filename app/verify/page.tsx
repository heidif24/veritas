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
      return { tone: "border-[var(--emerald)]/30 bg-[var(--emerald-soft)] text-[var(--emerald-dark)]", label: t("verify.verified") };
    }
    if (status === "Failed") {
      return { tone: "border-red-200 bg-[var(--danger-soft)] text-[var(--danger)]", label: t("verify.failed") };
    }
    if (status === "Invalid") {
      return { tone: "border-[var(--gold)]/40 bg-[var(--gold-soft)] text-[#7a6220]", label: t("verify.invalid") };
    }
    return { tone: "border-[var(--line)] bg-[var(--paper)] text-[var(--muted)]", label: t("verify.awaiting") };
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
    <main className="min-h-[70vh] bg-[var(--paper)] text-[var(--ink)]">
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-12 md:pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">{t("verify.badge")}</p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl text-[var(--ink)] md:text-4xl">{t("verify.title")}</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">{t("verify.sub")}</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="v-card p-6">
          <div className="rounded-2xl border border-dashed border-[var(--emerald)]/40 bg-[var(--emerald-soft)]/50 p-10 text-center">
            <p className="text-base font-semibold text-[var(--ink)]">{t("verify.drop")}</p>
            <p className="mt-1.5 text-sm text-[var(--muted)]">{t("verify.filetype")}</p>
            <label className="v-btn v-btn-primary mt-5 cursor-pointer">
              {t("verify.select")}
              <input type="file" className="hidden" accept=".json,.veritas" onChange={handleFile} />
            </label>
          </div>
        </div>

        <aside className="v-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{t("verify.result")}</p>
          <div className={`mt-3 rounded-xl border p-4 ${verificationState.tone}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.14em]">{t("verify.status")}</div>
            <div className="mt-1.5 font-display text-2xl">{verificationState.label}</div>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{summary}</p>
          <div className="mt-4 space-y-2">
            {checks.map((check) => (
              <div
                key={check.label}
                className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5"
              >
                <span className="text-sm text-[var(--muted)]">{check.label}</span>
                <span className="text-sm font-semibold text-[var(--ink)]">{check.value}</span>
              </div>
            ))}
          </div>
          <Link href="/" className="mt-5 inline-block text-sm font-medium text-[var(--emerald)] hover:underline">
            ← {t("verify.back")}
          </Link>
        </aside>
      </section>
    </main>
  );
}
