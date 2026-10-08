"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/app/components/locale-provider";
import { RoleShell, AUTHOR_NAV } from "@/app/components/role-shell";

export default function DashboardPage() {
  const { t } = useLocale();
  const [documents, setDocuments] = useState<
    Array<{ id: string; title: string; status: string; integrityStatus?: string; updatedAt?: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/documents")
      .then((response) => response.json().catch(() => ({})))
      .then((result) => {
        if (Array.isArray(result.documents)) setDocuments(result.documents);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleShell
      roleLabel="Workspace"
      title="Documents"
      nav={AUTHOR_NAV}
      actions={
        <Link href="/app/editor/new" className="v-btn v-btn-primary">
          {t("student.newDraft")}
        </Link>
      }
    >
      <p className="mb-6 max-w-2xl text-[var(--muted)]">{t("student.sub")}</p>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [t("student.stat.open"), String(documents.length || 0)],
          [t("student.stat.integrity"), "96/100"],
          [t("student.stat.awaiting"), "3"],
          [t("student.stat.sealed"), "4"],
        ].map(([label, value]) => (
          <div key={label} className="v-card p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</div>
            <div className="mt-2 font-display text-3xl text-[var(--ink)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {loading ? (
            <div className="v-empty">Loading documents…</div>
          ) : documents.length ? (
            documents.map((document) => (
              <article key={document.id} className="v-card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">{t("student.status")}</div>
                    <h2 className="mt-1 font-display text-xl text-[var(--ink)]">{document.title}</h2>
                  </div>
                  <span className="v-badge v-badge-emerald">{document.status}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{document.integrityStatus ?? t("student.passed")}</span>
                  <span>{document.updatedAt ? new Date(document.updatedAt).toLocaleDateString() : "—"}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/app/editor/${encodeURIComponent(document.id)}`} className="v-btn v-btn-primary">
                    {t("student.openDraft")}
                  </Link>
                  <Link href="/verify" className="v-btn v-btn-secondary">
                    {t("nav.verify")}
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="v-empty">
              No documents yet.{" "}
              <Link href="/app/editor/new" className="font-semibold text-[var(--emerald)] hover:underline">
                {t("student.newDraft")}
              </Link>
            </div>
          )}
        </div>

        <aside className="v-card h-fit p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{t("student.status")}</p>
          <div className="mt-4 space-y-2">
            {[
              [t("portal.integrity"), t("student.passed")],
              [t("student.export"), t("student.available")],
              [t("student.verification"), t("student.passed")],
            ].map(([title, status]) => (
              <div key={String(title)} className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[var(--ink)]">{title}</span>
                  <span className="text-xs font-semibold text-[var(--emerald)]">{status}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/student/coaching" className="v-btn v-btn-secondary mt-5 w-full">
            Need writing coaching?
          </Link>
        </aside>
      </div>
    </RoleShell>
  );
}
