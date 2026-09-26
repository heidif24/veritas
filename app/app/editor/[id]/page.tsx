"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ClipboardEvent, ReactNode } from "react";
import { PlagiarismSidebar } from "@/components/editor/PlagiarismSidebar";
import { scoreCompositionHealth, type CompositionOperation } from "@/lib/composition-health";

const initialDraft = `Choice is not an abstract condition; it is the visible residue of decisions made over time.

This essay examines how existentialist thought treats authorship, responsibility, and revision as evidence of a person encountering uncertainty rather than merely producing a finished answer.

The claim matters because a final document alone can conceal the path that created it. A trustworthy submission should preserve hesitation, correction, citation, and the smaller returns that show a writer thinking on the page.`;

const documentSections = ["Thesis", "Context", "Evidence", "Conclusion"];
const tabs = ["Draft", "Lineage", "Sources", "Heatmap", "Seal"];

type Reference = {
  id: number;
  title: string;
  author: string;
  url: string;
  note: string;
};

type PasteEvent = {
  id: number;
  chars: number;
  preview: string;
  time: string;
};

type LoadedDocument = {
  id?: string;
  ownerId?: string;
  organizationId?: string | null;
  status?: string;
  sealedHash?: string | null;
  sealedSignature?: string | null;
};

type CurrentSeal = {
  hash: string;
  signature: string;
};

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const [draft, setDraft] = useState(initialDraft);
  const [documentTitle, setDocumentTitle] = useState("");
  const [activeTab, setActiveTab] = useState("Draft");
  const [focusLosses, setFocusLosses] = useState(1);
  const [pasteEvents, setPasteEvents] = useState<PasteEvent[]>([]);
  const [compositionOperations, setCompositionOperations] = useState<CompositionOperation[]>([]);
  const [sealMessage, setSealMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [similarityScore, setSimilarityScore] = useState(0);
  const [similarityThreshold, setSimilarityThreshold] = useState(20);
  const [similarityMatches, setSimilarityMatches] = useState<Array<{ startOffset: number; endOffset: number; similarityPercentage: number }>>([]);
  const [references, setReferences] = useState<Reference[]>([
    { id: 1, title: "The Ethics of Ambiguity", author: "Simone de Beauvoir", url: "https://example.org/ethics-of-ambiguity", note: "Context for responsibility and choice." },
  ]);
  const [referenceDraft, setReferenceDraft] = useState({ title: "", author: "", url: "", note: "" });
  const [currentDocument, setCurrentDocument] = useState<LoadedDocument | null>(null);
  const [currentSeal, setCurrentSeal] = useState<CurrentSeal | null>(null);
  const pendingPasteChars = useRef(0);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/documents/${encodeURIComponent(params.id)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (!result?.document) return;

        const document = result.document;
        setCurrentDocument({
          id: typeof document.id === "string" ? document.id : params.id,
          ownerId: typeof document.ownerId === "string" ? document.ownerId : undefined,
          organizationId: typeof document.organizationId === "string" ? document.organizationId : null,
          status: typeof document.status === "string" ? document.status : undefined,
          sealedHash: typeof document.sealedHash === "string" ? document.sealedHash : null,
          sealedSignature: typeof document.sealedSignature === "string" ? document.sealedSignature : null,
        });

        if (typeof document.sealedHash === "string" && typeof document.sealedSignature === "string") {
          setCurrentSeal({ hash: document.sealedHash, signature: document.sealedSignature });
        }

        if (typeof document.title === "string") {
          setDocumentTitle(document.title);
        }

        if (typeof document.content === "string") {
          setDraft(document.content);
        }

        if (Array.isArray(document.references)) {
          setReferences(document.references.map((ref: Record<string, unknown>, index: number) => ({
            id: typeof ref.id === "number" ? ref.id : index + 1,
            title: String(ref.title ?? "Untitled source"),
            author: String(ref.author ?? ""),
            url: String(ref.url ?? ""),
            note: String(ref.note ?? ""),
          })));
        }
      })
      .catch(() => undefined);
  }, [params.id]);

  const stats = useMemo(() => {
    const words = draft.trim().split(/\s+/).filter(Boolean).length;
    const health = scoreCompositionHealth(compositionOperations, focusLosses);
    const organicRatio = Math.round(health.organicRatio * 100);
    const pastedRatio = Math.round(health.pastedRatio * 100);
    const transcriptionRisk = health.risk === "organic" ? "Low" : health.risk === "mixed" ? "Moderate" : "High";

    return { words, pastedRatio, organicRatio, transcriptionRisk, health };
  }, [compositionOperations, draft, focusLosses]);

  const title = documentTitle || decodeURIComponent(params.id ?? "untitled-draft").replace(/-/g, " ");

  async function persistDocument(nextStatus?: string) {
    const response = await fetch(`/api/documents/${encodeURIComponent(params.id ?? "")}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: draft, references, ...(nextStatus ? { status: nextStatus } : {}) }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(String(result.error ?? "Save failed"));
    }

    if (result.document) {
      setCurrentDocument({
        id: result.document.id,
        ownerId: result.document.ownerId,
        organizationId: result.document.organizationId,
        status: result.document.status,
        sealedHash: result.document.sealedHash,
        sealedSignature: result.document.sealedSignature,
      });
    }

    return result.document as LoadedDocument | undefined;
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const text = event.clipboardData.getData("text");
    if (text.length < 40) return;

    pendingPasteChars.current = text.length;
    setCompositionOperations((current) => [...current, { timestamp: Date.now(), kind: "paste", chars: text.length }]);
    setPasteEvents((current) => [
      {
        id: Date.now(),
        chars: text.length,
        preview: text.slice(0, 64),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...current,
    ]);
  }

  function handleDraftChange(nextDraft: string) {
    const delta = nextDraft.length - draft.length;
    if (pendingPasteChars.current > 0) {
      pendingPasteChars.current = 0;
    } else if (delta > 0) {
      setCompositionOperations((current) => [...current, { timestamp: Date.now(), kind: "type", chars: delta }]);
    } else if (delta < 0) {
      setCompositionOperations((current) => [...current, { timestamp: Date.now(), kind: "delete", chars: Math.abs(delta) }]);
    }
    setDraft(nextDraft);
  }

  async function sealDocument() {
    setSealMessage("Saving the latest draft...");

    try {
      await persistDocument();
      setSaveMessage("Saved just now");
      setSealMessage("Creating signed seal...");

      const response = await fetch(`/api/documents/${encodeURIComponent(params.id ?? "")}/seal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telemetry: {
            focusLosses,
            pasteEvents,
            organicRatio: stats.organicRatio,
            pastedRatio: stats.pastedRatio,
            transcriptionRisk: stats.transcriptionRisk,
          },
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.seal?.hash || !result.seal?.signature) {
        setSealMessage(result.error || "Seal failed. Sign in and save the document before exporting.");
        return;
      }

      setCurrentSeal({ hash: result.seal.hash, signature: result.seal.signature });
      if (result.document) {
        setCurrentDocument({
          id: result.document.id,
          ownerId: result.document.ownerId,
          organizationId: result.document.organizationId,
          status: result.document.status,
          sealedHash: result.document.sealedHash,
          sealedSignature: result.document.sealedSignature,
        });
      }

      setSealMessage(`Signed bundle ready. SHA-256: ${result.seal.hash}`);
    } catch {
      setSealMessage("Seal failed. Sign in and save the document before exporting.");
    }
  }

  async function saveDocument() {
    setSaveMessage("Saving...");
    try {
      await persistDocument();
      setSaveMessage("Saved just now");
      setCurrentSeal(null);
    } catch {
      setSaveMessage("Save failed");
    }
  }

  function downloadBundle() {
    if (!currentSeal) {
      setActiveTab("Seal");
      setSealMessage("Generate a signed seal before downloading the .veritas bundle.");
      return;
    }

    const payload = {
      exportType: "signed-veritas-bundle",
      version: "veritas-v1",
      documentId: currentDocument?.id ?? params.id,
      documentType: "essay",
      title,
      content: draft,
      ownerId: currentDocument?.ownerId ?? "unknown",
      organizationId: currentDocument?.organizationId ?? null,
      status: "submitted",
      references,
      telemetry: {
        focusLosses,
        pasteEvents,
        organicRatio: stats.organicRatio,
        pastedRatio: stats.pastedRatio,
        transcriptionRisk: stats.transcriptionRisk,
        similarityScore,
        similarityThreshold,
      },
      exportedAt: new Date().toISOString(),
      seal: {
        algorithm: "SHA-256 + Ed25519",
        hash: currentSeal.hash,
        signature: currentSeal.signature,
        status: "submitted",
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title || "veritas-document").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "veritas-document"}.veritas.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function addReference() {
    if (!referenceDraft.title.trim() || !referenceDraft.url.trim()) return;
    setReferences((current) => [{ ...referenceDraft, id: Date.now() }, ...current]);
    setReferenceDraft({ title: "", author: "", url: "", note: "" });
  }

  function applySimilarityReview(match: { snippet: string; matchedSourceUrl: string }, mode: "quote" | "paraphrase") {
    const addition = mode === "quote"
      ? `\n\n\"${match.snippet}\" (${match.matchedSourceUrl})`
      : `\n\n[Rewrite this passage in your own words and cite: ${match.matchedSourceUrl}]`;
    setDraft((current) => `${current}${addition}`);
    setActiveTab("Draft");
  }

  function renderHighlightedDraft() {
    const flagged = similarityMatches
      .filter((match) => match.similarityPercentage > 15 && match.endOffset > match.startOffset)
      .sort((left, right) => left.startOffset - right.startOffset);
    if (!flagged.length) return draft;

    const segments: ReactNode[] = [];
    let cursor = 0;
    flagged.forEach((match, index) => {
      const start = Math.max(cursor, Math.min(draft.length, match.startOffset));
      const end = Math.max(start, Math.min(draft.length, match.endOffset));
      if (start > cursor) segments.push(<span key={`plain-${index}`}>{draft.slice(cursor, start)}</span>);
      if (end > start) {
        segments.push(<mark key={`match-${index}`} className="rounded bg-amber-400/25 text-transparent underline decoration-amber-300/80 decoration-2 underline-offset-4">{draft.slice(start, end)}</mark>);
      }
      cursor = end;
    });
    if (cursor < draft.length) segments.push(<span key="plain-tail">{draft.slice(cursor)}</span>);
    return segments;
  }

  return (
    <div className="min-h-screen bg-[#050b16] px-4 py-6 text-slate-100 md:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 rounded-[26px] border border-white/10 bg-slate-900/80 px-4 py-4 shadow-2xl shadow-cyan-950/10 backdrop-blur-sm md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200">Browser-native telemetry editor</p>
              <h1 className="mt-2 capitalize text-2xl font-black text-white md:text-3xl">{title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100">
                Organic {stats.organicRatio}%
              </span>
              <button onClick={saveDocument} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                {saveMessage || "Save"}
              </button>
              <button onClick={sealDocument} className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
                Export and seal
              </button>
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-3 py-1.5 ${activeTab === tab ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-slate-900/70 text-slate-300"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[220px_1.5fr_330px]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Structure</p>
            <div className="mt-4 space-y-2">
              {documentSections.map((section, index) => (
                <button
                  key={section}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${index === 0 ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-slate-950/40 text-slate-300"}`}
                >
                  <span>{section}</span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{index + 1}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Composition health</p>
              <div className="mt-3 text-2xl font-black text-white">{stats.organicRatio}%</div>
              <div className="mt-3 h-2.5 rounded-full bg-slate-800">
                <span className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${stats.organicRatio}%` }} />
              </div>
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                <span>{activeTab}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{draft.length} chars</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{stats.words} words</span>
              </div>

              <div className="flex gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-slate-200">B</button>
                <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-slate-200 italic">I</button>
                <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-slate-200">List</button>
              </div>
            </div>

            {activeTab === "Draft" ? (
              <div className="relative h-[620px] overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/60">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-5 text-base leading-8 text-slate-100">
                  {renderHighlightedDraft()}
                </div>
                <textarea
                  value={draft}
                  onChange={(event) => handleDraftChange(event.target.value)}
                  onPaste={handlePaste}
                  onBlur={() => setFocusLosses((current) => current + 1)}
                  className="relative h-full w-full resize-none bg-transparent p-5 text-base leading-8 text-transparent caret-white outline-none ring-0 selection:bg-cyan-400/30 placeholder:text-slate-500"
                  placeholder="Write your document here..."
                />
              </div>
            ) : activeTab === "Lineage" ? (
              <div className="space-y-4">
                {[
                  ["00:12", "Draft opened and thesis typed in natural bursts", "Organic"],
                  ["04:38", "Long pause before restructuring first paragraph", "Pause"],
                  ["18:05", "External quote pasted and marked as citation material", "Paste"],
                  ["41:22", "Final revision prepared for cryptographic seal", "Seal"],
                ].map(([time, action, type]) => (
                  <div key={time} className="rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{time}</span>
                      <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-cyan-200">{type}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{action}</p>
                  </div>
                ))}
              </div>
            ) : activeTab === "Sources" ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">Reference desk</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Keep the work behind the work close.</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Save sources, links, and notes alongside this draft so collaborators can trace decisions without leaving the workspace.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {references.map((reference) => (
                    <article key={reference.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">{reference.title}</h3>
                          <p className="mt-1 text-xs text-slate-400">{reference.author || "Author not added"}</p>
                        </div>
                        <button type="button" onClick={() => setReferences((current) => current.filter((item) => item.id !== reference.id))} className="text-xs text-slate-500 hover:text-red-200">Remove</button>
                      </div>
                      <a href={reference.url} target="_blank" rel="noreferrer" className="mt-3 block truncate text-xs text-cyan-200 hover:text-cyan-100">{reference.url}</a>
                      {reference.note ? <p className="mt-3 text-sm leading-6 text-slate-300">{reference.note}</p> : null}
                    </article>
                  ))}
                </div>
                <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 md:grid-cols-2">
                  <input value={referenceDraft.title} onChange={(event) => setReferenceDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Source title" className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none" />
                  <input value={referenceDraft.author} onChange={(event) => setReferenceDraft((current) => ({ ...current, author: event.target.value }))} placeholder="Author or organisation" className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none" />
                  <input value={referenceDraft.url} onChange={(event) => setReferenceDraft((current) => ({ ...current, url: event.target.value }))} placeholder="https://source.example" className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none md:col-span-2" />
                  <input value={referenceDraft.note} onChange={(event) => setReferenceDraft((current) => ({ ...current, note: event.target.value }))} placeholder="Why this source matters" className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none" />
                  <button type="button" onClick={addReference} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950">Add source</button>
                </div>
              </div>
            ) : activeTab === "Heatmap" ? (
              <div className="space-y-4 text-sm leading-8 text-slate-200">
                <p><span className="rounded bg-emerald-500/20 px-1 text-emerald-100">Choice is not an abstract condition</span>; it is the visible residue of decisions made over time.</p>
                <p><span className="rounded bg-emerald-500/20 px-1 text-emerald-100">This essay examines authorship, responsibility, and revision</span> as evidence of a person encountering uncertainty.</p>
                <p><span className="rounded bg-amber-500/20 px-1 text-amber-100">Quoted note from class reading</span> is retained as cited source material.</p>
                <div className="grid gap-3 pt-3 sm:grid-cols-3">
                  {[["Green", "Organic drafting"], ["Yellow", "Transcribed or pasted"], ["Red", "Bulk paste risk"]].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="text-sm font-bold text-white">{label}</div>
                      <div className="mt-1 text-xs text-slate-400">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[22px] border border-cyan-500/20 bg-cyan-500/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">Export and seal</p>
                <h2 className="mt-3 text-2xl font-black text-white">Create secure submission bundle</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Veritas packages the raw text hash, telemetry summary, paste log, focus-loss count, and author metadata. Any offline edit breaks the hash when the file is checked in the public verifier.
                </p>

                {similarityScore >= similarityThreshold ? (
                  <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
                    This draft exceeds the institution&apos;s {similarityThreshold}% similarity threshold. Review flagged passages before exporting the final .veritas package.
                  </div>
                ) : null}

                <button
                  onClick={similarityScore >= similarityThreshold ? undefined : sealDocument}
                  disabled={similarityScore >= similarityThreshold}
                  className={`mt-5 rounded-full px-5 py-3 text-sm font-bold ${similarityScore >= similarityThreshold ? "cursor-not-allowed bg-slate-700 text-slate-300" : "bg-cyan-400 text-slate-950"}`}
                >
                  {similarityScore >= similarityThreshold ? "Review flagged segments to unlock export" : "Generate .veritas bundle"}
                </button>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={downloadBundle}
                    disabled={!currentSeal}
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Download .veritas bundle
                  </button>
                </div>
                {sealMessage ? (
                  <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
                    {sealMessage}
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <PlagiarismSidebar documentId={params.id ?? ""} text={draft} onApply={applySimilarityReview} onChange={({ score, threshold, matches }) => {
              setSimilarityScore(score);
              setSimilarityThreshold(threshold);
              setSimilarityMatches(matches);
            }} />

            <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Live signals</p>
              <div className="mt-4 text-4xl font-black text-white">{stats.organicRatio}%</div>
              <div className="mt-4 h-2.5 rounded-full bg-slate-800">
                <span className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${stats.organicRatio}%` }} />
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between"><span>Pasted ratio</span><span className="font-semibold text-white">{stats.pastedRatio}%</span></div>
                <div className="flex items-center justify-between"><span>Focus losses</span><span className="font-semibold text-white">{focusLosses}</span></div>
                <div className="flex items-center justify-between"><span>AI transcription risk</span><span className="font-semibold text-white">{stats.transcriptionRisk}</span></div>
                <div className="flex items-center justify-between"><span>Median typing interval</span><span className="font-semibold text-white">{stats.health.medianFlightMs ? `${Math.round(stats.health.medianFlightMs)} ms` : "Not enough data"}</span></div>
              </div>
              <ul className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">
                {stats.health.notes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Paste interception</p>
              <div className="mt-4 space-y-3">
                {pasteEvents.map((event) => (
                  <div key={event.id} className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{event.chars} chars</p>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-amber-200">{event.time}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{event.preview}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
