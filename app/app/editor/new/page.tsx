"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Untitled research draft");
  const [documentType, setDocumentType] = useState("essay");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Untitled research draft",
          content: "",
          status: "draft",
          documentType,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "Could not create the document.");
        setLoading(false);
        return;
      }

      const documentId = payload.document?.id ?? payload.id;
      if (documentId) {
        router.push(`/app/editor/${encodeURIComponent(documentId)}`);
        return;
      }

      setError("Document created but the editor ID was not returned.");
    } catch {
      setError("Document creation failed unexpectedly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-6">
      <div className="mx-auto max-w-4xl rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">Create</p>
          <h1 className="mt-2 text-3xl font-black text-white">Start a new document</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-300">Document title</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="Untitled research draft"
            />
          </div>

          <div>
            <label htmlFor="documentType" className="mb-2 block text-sm font-medium text-slate-300">Document type</label>
            <select
              id="documentType"
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option value="essay">Essay</option>
              <option value="research">Research paper</option>
              <option value="proposal">Proposal</option>
              <option value="report">Report</option>
              <option value="thesis">Thesis</option>
            </select>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-7 text-slate-300">
            This draft will open in the editor with tracking enabled, source references, and originality monitoring ready to use.
          </div>

          {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div> : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60">
              {loading ? "Creating..." : "Create document"}
            </button>
            <button type="button" onClick={() => router.push("/app/dashboard")} className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Back to dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
