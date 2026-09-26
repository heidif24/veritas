"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "@/app/components/portal-shell";

type Entry = { id: string; title: string; source_url?: string; body_len?: number; created_at: string };

const navItems = [
  { label: "Overview", href: "/admin/tenant" },
  { label: "Users", href: "/admin/users" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Integrity cases", href: "/admin/cases" },
  { label: "Corpus", href: "/admin/corpus", active: true },
  { label: "Security", href: "/admin/security" },
  { label: "Billing", href: "/admin/billing" },
];

export default function CorpusAdminPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/corpus");
    const data = await res.json();
    if (res.ok) setEntries(data.entries || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function addEntry(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/corpus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, sourceUrl }),
    });
    if (res.ok) {
      setTitle("");
      setBody("");
      setSourceUrl("");
      setMessage("Corpus entry indexed.");
      void load();
    } else {
      setMessage("Could not add entry.");
    }
  }

  return (
    <PortalShell title="Institutional corpus" subtitle="Sources used for similarity matching" role="super" navItems={navItems}>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={addEntry} className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <p className="text-sm font-semibold text-white">Index a source</p>
          <p className="mt-1 text-xs text-slate-400">Prior submissions and reference texts for institutional matching</p>
          <label className="mt-4 block text-xs font-semibold text-slate-300">
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" required />
          </label>
          <label className="mt-3 block text-xs font-semibold text-slate-300">
            Source URL (optional)
            <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" />
          </label>
          <label className="mt-3 block text-xs font-semibold text-slate-300">
            Body
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 min-h-[140px] w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" required />
          </label>
          <button type="submit" className="mt-4 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-xs font-bold text-white">
            Add to corpus
          </button>
          {message ? <p className="mt-2 text-xs text-cyan-300">{message}</p> : null}
        </form>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40">
          <div className="border-b border-white/10 px-6 py-4">
            <p className="text-sm font-semibold text-white">Indexed entries</p>
            <p className="text-xs text-slate-400">{entries.length} sources</p>
          </div>
          <ul className="max-h-[480px] divide-y divide-white/5 overflow-y-auto">
            {entries.map((e) => (
              <li key={e.id} className="px-6 py-3">
                <p className="font-medium text-white">{e.title}</p>
                <p className="text-xs text-slate-400">
                  {e.body_len ?? 0} chars · {new Date(e.created_at).toLocaleDateString()}
                  {e.source_url ? ` · ${e.source_url}` : ""}
                </p>
              </li>
            ))}
            {!entries.length ? <li className="px-6 py-8 text-sm text-slate-400">No corpus entries yet.</li> : null}
          </ul>
        </div>
      </div>
    </PortalShell>
  );
}
