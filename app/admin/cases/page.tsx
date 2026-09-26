"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalShell } from "@/app/components/portal-shell";

type CaseRow = {
  id: string;
  document_id: string;
  document_title?: string;
  decision: string;
  notes?: string;
  reviewer_name?: string;
  updated_at: string;
};

const decisionTone: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  accepted: "bg-emerald-50 text-emerald-800",
  revision_requested: "bg-amber-50 text-amber-900",
  referred: "bg-red-50 text-red-800",
};

const navItems = [
  { label: "Overview", href: "/admin/tenant" },
  { label: "Users", href: "/admin/users" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Integrity cases", href: "/admin/cases", active: true },
  { label: "Corpus", href: "/admin/corpus" },
  { label: "Security", href: "/admin/security" },
  { label: "Billing", href: "/admin/billing" },
];

export default function IntegrityCasesPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cases");
        const data = await res.json();
        if (res.ok) setCases(data.cases || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PortalShell
      title="Integrity cases"
      subtitle="Faculty and office decisions on authorship evidence"
      role="super"
      navItems={navItems}
    >
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 shadow-sm">
        <div className="border-b border-white/10 px-6 py-4">
          <p className="text-sm font-semibold text-white">Case queue</p>
          <p className="text-xs text-slate-400">Decisions recorded from faculty review workspaces</p>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-slate-400">Loading…</p>
        ) : cases.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">No cases yet. Decisions from faculty review will appear here.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {cases.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="font-semibold text-white">{c.document_title || c.document_id}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {c.reviewer_name || "Reviewer"} · {new Date(c.updated_at).toLocaleString()}
                  </p>
                  {c.notes ? <p className="mt-1 max-w-xl text-xs text-slate-300">{c.notes}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${decisionTone[c.decision] || decisionTone.pending}`}>
                    {c.decision.replace(/_/g, " ")}
                  </span>
                  <Link href={`/instructor/review/${c.document_id}`} className="text-xs font-semibold text-cyan-300 hover:underline">
                    Open
                  </Link>
                  <Link href={`/app/report/${c.document_id}`} className="text-xs font-semibold text-slate-300 hover:underline">
                    Evidence
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
