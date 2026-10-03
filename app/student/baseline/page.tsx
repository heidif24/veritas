"use client";

import { useState } from "react";
import Link from "next/link";

export default function StudentBaselinePage() {
  const [title, setTitle] = useState("Baseline writing sample");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/baseline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setStatus(`Saved (${json.sample?.wordCount ?? 0} words). Later work can be compared against this sample.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-3xl px-6 pb-8 pt-14">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Baseline</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Course writing sample</h1>
        <p className="mt-3 text-slate-600">
          Write a short, timed piece in your own words. This becomes a fair reference for style and process on later assignments.
        </p>
      </section>

      <section className="mx-auto max-w-3xl space-y-4 px-6 pb-20">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
          placeholder="Write at least ~40 words. Prefer continuous typing over large pastes."
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save baseline"}
          </button>
          <Link href="/student/transparency" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">
            Transparency
          </Link>
        </div>
        {status && <p className="text-sm text-slate-600">{status}</p>}
      </section>
    </main>
  );
}
