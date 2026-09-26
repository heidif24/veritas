"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Untitled document");
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
          title: title.trim() || "Untitled document",
          content: "<p></p>",
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
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2b579a]">New document</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Start writing</h1>
        <p className="mt-2 text-sm text-slate-600">
          Opens in a familiar word-processor layout with originality checks and sealed export.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#2b579a] focus:ring-2 focus:ring-blue-100"
              placeholder="Untitled document"
            />
          </div>

          <div>
            <label htmlFor="documentType" className="mb-1.5 block text-sm font-medium text-slate-700">
              Type
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#2b579a] focus:ring-2 focus:ring-blue-100"
            >
              <option value="essay">Essay</option>
              <option value="research">Research paper</option>
              <option value="proposal">Proposal</option>
              <option value="report">Report</option>
              <option value="thesis">Thesis</option>
            </select>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#2b579a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3f6f] disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create & open"}
            </button>
            <Link
              href="/app/dashboard"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
