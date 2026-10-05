"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/app/components/locale-provider";

export default function DashboardPage() {
  const { t } = useLocale();
  const [documents, setDocuments] = useState<Array<{ id: string; title: string; status: string; integrityStatus?: string; updatedAt?: string }>>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((response) => response.json().catch(() => ({})))
      .then((result) => {
        if (Array.isArray(result.documents)) {
          setDocuments(result.documents);
        }
      })
      .catch(() => undefined);
  }, []);

  const roleCards = [
    { label: t("portal.role.institutional"), href: "/admin/tenant", detail: t("portal.operations") },
    { label: t("faculty.badge"), href: "/instructor/courses", detail: t("faculty.sub") },
    { label: t("student.badge"), href: "/student", detail: t("student.sub") },
    { label: t("nav.verify"), href: "/verify", detail: t("verify.badge") },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">{t("portal.console")}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{t("student.title")}</h1>
            <p className="mt-2 text-slate-600">{t("student.sub")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/editor/new" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              {t("student.newDraft")}
            </Link>
            <Link href="/onboarding" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              {t("footer.onboarding")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t("student.stat.open"), String(documents.length || 0)],
            [t("student.stat.integrity"), "96/100"],
            [t("student.stat.awaiting"), "3"],
            [t("student.stat.sealed"), "4"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roleCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-200 hover:shadow-md"
            >
              <div className="text-sm font-bold text-slate-900">{card.label}</div>
              <p className="mt-2 text-sm text-slate-600">{card.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {documents.length ? (
            documents.map((document) => (
              <div key={document.id} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("student.status")}</div>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">{document.title}</h2>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {document.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{document.integrityStatus ?? t("student.passed")}</span>
                  <span>{document.updatedAt ? new Date(document.updatedAt).toLocaleDateString() : "—"}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/app/editor/${encodeURIComponent(document.id)}`}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {t("student.openDraft")}
                  </Link>
                  <Link
                    href="/verify"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    {t("nav.verify")}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <Link href="/app/editor/new" className="font-semibold text-cyan-700 hover:text-cyan-800">
                {t("student.newDraft")}
              </Link>
            </div>
          )}
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{t("student.status")}</p>
          <div className="mt-5 space-y-3">
            {[
              [t("portal.integrity"), t("student.passed")],
              [t("student.export"), t("student.available")],
              [t("student.verification"), t("student.passed")],
            ].map(([title, status]) => (
              <div key={String(title)} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-900">{title}</span>
                  <span className="text-xs font-semibold text-emerald-700">{status}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
