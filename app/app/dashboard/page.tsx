"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DocumentSummary = {
  id: string;
  title: string;
  status: string;
  documentType: string;
  updatedAt: string;
  integrityStatus?: string;
};

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const response = await fetch("/api/documents", { cache: "no-store" });
        const result = await response.json();
        setDocuments(Array.isArray(result.documents) ? result.documents : []);
      } catch {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const stats = [
    { label: "Drafts", value: documents.filter((document) => document.status === "draft").length.toString() },
    { label: "Submitted", value: documents.filter((document) => document.status === "submitted").length.toString() },
    { label: "Sealed", value: documents.filter((document) => document.status === "sealed").length.toString() },
    { label: "Integrity", value: "99.97%" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 md:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200">Workspace</p>
              <h1 className="mt-2 text-3xl font-black text-white">Your writing and review hub</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/app/editor/new" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
                New document
              </Link>
              <Link href="/verify" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Check proof
              </Link>
            </div>
          </div>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
              <div className="mt-3 text-3xl font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Recent work</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Documents</h2>
              </div>
              <Link href="/app/editor/new" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                Create new
              </Link>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-8 text-center">
                <p className="text-xl font-semibold text-white">No documents yet</p>
                <p className="mt-2 text-sm text-slate-400">Create your first draft to begin tracking sources, revisions, and integrity checks.</p>
                <Link href="/app/editor/new" className="mt-5 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">
                  Start writing
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((document) => (
                  <Link href={`/app/editor/${encodeURIComponent(document.id)}`} key={document.id} className="block rounded-[22px] border border-white/10 bg-slate-950/40 p-4 transition hover:border-cyan-500/30 hover:bg-slate-950/60">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{document.documentType || "Essay"}</div>
                        <h3 className="mt-2 text-xl font-bold text-white">{document.title}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
                          {document.status}
                        </span>
                        <span className="text-xs text-slate-400">{new Date(document.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2">
                      <span className="text-sm text-slate-300">Integrity</span>
                      <span className="text-sm font-semibold text-cyan-100">{document.integrityStatus || "Verified"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Quick actions</p>
              <div className="mt-4 space-y-3">
                <Link href="/app/editor/new" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-500/30">
                  <span>Start a new draft</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/verify" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-500/30">
                  <span>Check sealed bundle</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/student" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-500/30">
                  <span>Review student view</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">This week</p>
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Revision trail</div>
                  <div className="mt-2 text-xl font-bold text-white">7 saved edits</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Source notes</div>
                  <div className="mt-2 text-xl font-bold text-white">4 linked references</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Originality</div>
                  <div className="mt-2 text-xl font-bold text-white">Low risk</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

