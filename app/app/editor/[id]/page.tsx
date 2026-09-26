"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
} from "react";
import { DocumentCanvas } from "@/components/editor/DocumentCanvas";
import { PlagiarismSidebar, type PlagiarismMatch } from "@/components/editor/PlagiarismSidebar";
import { VeritasMark } from "@/app/components/veritas-logo";
import {
  scoreCompositionHealth,
  type CompositionHealth,
  type CompositionOperation,
} from "@/lib/composition-health";

type SealBundle = {
  version: number;
  format: "veritas";
  payload: Record<string, unknown>;
  sha256: string;
  signature: string;
  publicKeyPem: string;
};

function exec(cmd: string, value?: string) {
  try {
    document.execCommand(cmd, false, value);
  } catch {
    /* ignore */
  }
}

function stripHtml(html: string) {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ");
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.innerText || "";
}

function safeFilename(name: string) {
  return (name || "document").replace(/[^\w\s.-]+/g, "").trim().replace(/\s+/g, "-") || "document";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildPrintHtml(opts: { title: string; header: string; footer: string; bodyHtml: string }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${opts.title.replace(/</g, "<")}</title>
<style>@page{size:letter;margin:1in}body{font-family:Georgia,"Times New Roman",serif;font-size:12pt;line-height:1.6;color:#111}
.header,.footer{text-align:center;font-size:10pt;color:#555;font-family:system-ui,sans-serif}</style></head><body>
<div class="header">${opts.header ? opts.header.replace(/</g, "<") : "&nbsp;"}</div>
<div>${opts.bodyHtml || "<p></p>"}</div>
<div class="footer">${opts.footer ? opts.footer.replace(/</g, "<") : ""}</div>
<script>window.onload=function(){window.focus();window.print();}</script></body></html>`;
}

function buildWordHtml(opts: { title: string; header: string; footer: string; bodyHtml: string }) {
  return `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/><title>${opts.title.replace(/</g, "<")}</title>
<style>@page{size:8.5in 11in;margin:1in}body{font-family:Georgia,serif;font-size:12pt;line-height:1.6}</style></head><body>
${opts.header ? `<p style="text-align:center">${opts.header.replace(/</g, "<")}</p>` : ""}
${opts.bodyHtml || "<p></p>"}
${opts.footer ? `<p style="text-align:center">${opts.footer.replace(/</g, "<")}</p>` : ""}
</body></html>`;
}

export default function EditorPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const [title, setTitle] = useState("Untitled composition");
  const [content, setContent] = useState("<p></p>");
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fontName, setFontName] = useState("Georgia");
  const [fontSize, setFontSize] = useState("12");
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [ops, setOps] = useState<CompositionOperation[]>([]);
  const [focusLosses, setFocusLosses] = useState(0);
  const [plagiarism, setPlagiarism] = useState({
    score: 0,
    threshold: 20,
    blocked: false,
    matches: [] as PlagiarismMatch[],
  });
  const [sealBundle, setSealBundle] = useState<SealBundle | null>(null);
  const [sealedHash, setSealedHash] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const lastPlainLen = useRef(0);
  const sessionStart = useRef(Date.now());

  const plainText = useMemo(() => stripHtml(content), [content]);
  const wordCount = useMemo(() => {
    const t = plainText.trim();
    return t ? t.split(/\s+/).length : 0;
  }, [plainText]);
  const charCount = plainText.length;

  const health: CompositionHealth = useMemo(
    () => scoreCompositionHealth(ops, focusLosses),
    [ops, focusLosses]
  );

  const canSeal =
    !plagiarism.blocked &&
    health.aiRiskLabel !== "Critical" &&
    plainText.trim().length >= 40;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/documents/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Could not load document.");
          setLoading(false);
          return;
        }
        const doc = data.document ?? data;
        setTitle(doc.title || "Untitled composition");
        setContent(doc.content || "<p></p>");
        setStatus(doc.status || "draft");
        setHeader(doc.header || "");
        setFooter(doc.footer || "");
        if (doc.sealedHash) setSealedHash(doc.sealedHash);
        lastPlainLen.current = stripHtml(doc.content || "").length;
      } catch {
        if (!cancelled) setError("Failed to load document.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const persist = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!id) return;
      setSaving(true);
      if (!opts?.silent) setMessage("");
      try {
        const res = await fetch(`/api/documents/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, header, footer }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) setError(data.error || "Save failed.");
        else if (!opts?.silent) {
          setMessage("Saved");
          setTimeout(() => setMessage(""), 2000);
        }
      } catch {
        setError("Save failed.");
      } finally {
        setSaving(false);
      }
    },
    [id, title, content, header, footer]
  );

  useEffect(() => {
    if (loading || !id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void persist({ silent: true }), 2500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, content, header, footer, loading, id, persist]);

  useEffect(() => {
    if (loading) return;
    const len = plainText.length;
    const delta = len - lastPlainLen.current;
    if (delta === 0) return;
    const kind: CompositionOperation["kind"] = delta > 12 ? "paste" : delta < 0 ? "delete" : "type";
    setOps((prev) => [...prev.slice(-400), { timestamp: Date.now(), kind, chars: Math.abs(delta) }]);
    lastPlainLen.current = len;
  }, [plainText, loading]);

  useEffect(() => {
    const onBlur = () => setFocusLosses((n) => n + 1);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  const handlePrint = useCallback(() => {
    const html = buildPrintHtml({ title, header, footer, bodyHtml: content });
    const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
    if (!w) {
      setError("Allow pop-ups to print.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }, [title, header, footer, content]);

  const handleDownloadExport = useCallback(
    (format: "html" | "doc" | "txt") => {
      const base = safeFilename(title);
      if (format === "txt") {
        downloadBlob(new Blob([plainText], { type: "text/plain;charset=utf-8" }), `${base}.txt`);
      } else if (format === "html") {
        downloadBlob(
          new Blob([buildPrintHtml({ title, header, footer, bodyHtml: content })], {
            type: "text/html;charset=utf-8",
          }),
          `${base}.html`
        );
      } else {
        downloadBlob(
          new Blob([buildWordHtml({ title, header, footer, bodyHtml: content })], {
            type: "application/msword;charset=utf-8",
          }),
          `${base}.doc`
        );
      }
      setExportOpen(false);
      setMessage(`Exported .${format}`);
      setTimeout(() => setMessage(""), 2000);
    },
    [title, header, footer, content, plainText]
  );

  const downloadSealedPackage = useCallback(() => {
    if (!sealBundle) {
      setError("Seal the composition first to export a verifiable package.");
      return;
    }
    downloadBlob(
      new Blob([JSON.stringify(sealBundle, null, 2)], { type: "application/json;charset=utf-8" }),
      `${safeFilename(title)}.veritas.json`
    );
    setExportOpen(false);
    setMessage("Sealed package exported");
    setTimeout(() => setMessage(""), 2500);
  }, [sealBundle, title]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "s") {
        e.preventDefault();
        void persist();
      } else if (e.key === "p") {
        e.preventDefault();
        handlePrint();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [persist, handlePrint]);

  useEffect(() => {
    if (!exportOpen) return;
    function onDoc(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [exportOpen]);

  async function handleSeal() {
    if (!id) return;
    if (!canSeal) {
      setError(
        plagiarism.blocked
          ? `Similarity ${plagiarism.score}% meets or exceeds the ${plagiarism.threshold}% limit. Resolve matches before sealing.`
          : health.aiRiskLabel === "Critical"
            ? "Composition risk is Critical. Keep drafting organically before sealing."
            : "Write a meaningful draft (40+ characters) before sealing."
      );
      setSidebarOpen(true);
      return;
    }

    setSealing(true);
    setError("");
    try {
      await persist({ silent: true });
      const telemetry = {
        startAt: new Date(sessionStart.current).toISOString(),
        lastInputAt: new Date().toISOString(),
        tabSwitches: focusLosses,
        blurCount: focusLosses,
        aiRiskScore: health.aiRiskScore,
        aiRiskLabel: health.aiRiskLabel,
        organicRatio: health.organicRatio,
        pastedRatio: health.pastedRatio,
        similarityScore: plagiarism.score,
        similarityThreshold: plagiarism.threshold,
      };

      const res = await fetch(`/api/documents/${encodeURIComponent(id)}/seal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ops: ops.map((o) => ({ type: o.kind, timestamp: o.timestamp, chars: o.chars })),
          telemetry,
          assignmentId: id,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Could not seal composition.");
      else {
        setStatus(data.document?.status || "submitted");
        setSealedHash(data.seal || data.document?.sealedHash || "");
        if (data.bundle) setSealBundle(data.bundle as SealBundle);
        setMessage("Sealed — export the Veritas package to verify");
      }
    } catch {
      setError("Seal failed.");
    } finally {
      setSealing(false);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    const text = e.clipboardData?.getData("text/plain") || "";
    if (text.length > 0) {
      setOps((prev) => [...prev.slice(-400), { timestamp: Date.now(), kind: "paste", chars: text.length }]);
    }
  }

  function applyPlagiarismFix(match: PlagiarismMatch, mode: "quote" | "paraphrase") {
    if (!match.snippet) return;
    if (mode === "quote") {
      setContent(
        (c) =>
          c +
          `<blockquote><p>${match.snippet}</p><p><cite>${match.sourceTitle || match.matchedSourceUrl}</cite></p></blockquote>`
      );
    } else {
      setMessage("Highlight the flagged passage and rewrite it in your own words.");
      setTimeout(() => setMessage(""), 4000);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <VeritasMark />
          <p className="text-sm font-medium">Opening composition…</p>
        </div>
      </div>
    );
  }

  const aiTone =
    health.aiRiskLabel === "Low"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : health.aiRiskLabel === "Moderate"
        ? "bg-amber-50 text-amber-900 ring-amber-200"
        : health.aiRiskLabel === "High"
          ? "bg-orange-50 text-orange-900 ring-orange-200"
          : "bg-red-50 text-red-900 ring-red-200";

  const simTone = plagiarism.blocked
    ? "text-red-700"
    : plagiarism.score > plagiarism.threshold * 0.5
      ? "text-amber-700"
      : "text-emerald-700";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-800">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/app/dashboard" className="shrink-0" title="Workspace">
            <VeritasMark />
          </Link>
          <div className="min-w-0">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full max-w-lg truncate border-0 bg-transparent text-[15px] font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Composition title"
              aria-label="Composition title"
            />
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium capitalize text-slate-600">
                {status}
              </span>
              <span>{saving ? "Saving…" : message || "Autosave"}</span>
              {sealedHash ? (
                <span className="font-mono text-cyan-700" title={sealedHash}>
                  · sealed {sealedHash.slice(0, 10)}…
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button type="button" title="Save (Ctrl+S)" onClick={() => void persist()} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
            Save
          </button>
          <button type="button" title="Print (Ctrl+P)" onClick={handlePrint} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
            Print
          </button>
          <div className="relative" ref={exportRef}>
            <button type="button" onClick={() => setExportOpen((v) => !v)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
              Export ▾
            </button>
            {exportOpen ? (
              <div className="absolute right-0 z-50 mt-1.5 min-w-[220px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Formats</p>
                <button type="button" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50" onClick={() => handleDownloadExport("doc")}>Document (.doc)</button>
                <button type="button" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50" onClick={() => handleDownloadExport("html")}>Web page (.html)</button>
                <button type="button" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50" onClick={() => handleDownloadExport("txt")}>Plain text (.txt)</button>
                <div className="my-1 border-t border-slate-100" />
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Integrity</p>
                <button type="button" className={`block w-full px-3 py-2 text-left text-xs ${sealBundle ? "hover:bg-cyan-50 text-cyan-800" : "cursor-not-allowed text-slate-400"}`} onClick={downloadSealedPackage} disabled={!sealBundle}>
                  Sealed package (.veritas.json)
                </button>
              </div>
            ) : null}
          </div>
          <button type="button" onClick={() => void handleSeal()} disabled={sealing || status === "submitted"} className="rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-violet-500 disabled:opacity-50">
            {sealing ? "Sealing…" : status === "submitted" ? "Sealed" : "Seal authenticity"}
          </button>
          <Link href="/verify" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50">
            Verify
          </Link>
        </div>
      </header>

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-cyan-50/40 px-4 py-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${aiTone}`}>
          Authorship risk · {health.aiRiskLabel} ({health.aiRiskScore}%)
        </span>
        <span className={`text-[11px] font-semibold ${simTone}`}>
          Similarity {plagiarism.score}%{plagiarism.blocked ? " · over limit" : ""}
        </span>
        <span className="text-[11px] text-slate-500">
          Organic {(health.organicRatio * 100).toFixed(0)}% · Paste {(health.pastedRatio * 100).toFixed(0)}%
        </span>
        {!canSeal && status !== "submitted" ? (
          <span className="text-[11px] font-medium text-amber-700">Seal needs clear similarity and non-critical risk</span>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setSidebarOpen((v) => !v)} className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-cyan-800 hover:bg-cyan-100/60">
            {sidebarOpen ? "Hide integrity" : "Show integrity"}
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-3 py-2">
        <ToolBtn label="B" title="Bold" className="font-bold" onClick={() => exec("bold")} />
        <ToolBtn label="I" title="Italic" className="italic" onClick={() => exec("italic")} />
        <ToolBtn label="U" title="Underline" className="underline" onClick={() => exec("underline")} />
        <Sep />
        <select value={fontName} onChange={(e) => { setFontName(e.target.value); exec("fontName", e.target.value); }} className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-700">
          {["Georgia", "Times New Roman", "Arial", "Verdana", "Courier New"].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select value={fontSize} onChange={(e) => { setFontSize(e.target.value); exec("fontSize", String(Math.min(7, Math.max(1, Math.round(Number(e.target.value) / 4))))); }} className="h-8 w-14 rounded-lg border border-slate-200 bg-slate-50 px-1 text-xs text-slate-700">
          {["10", "11", "12", "14", "16", "18", "24"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Sep />
        <ToolBtn label="H1" onClick={() => exec("formatBlock", "h1")} />
        <ToolBtn label="H2" onClick={() => exec("formatBlock", "h2")} />
        <ToolBtn label="¶" title="Paragraph" onClick={() => exec("formatBlock", "p")} />
        <Sep />
        <ToolBtn label="•" title="Bullet list" onClick={() => exec("insertUnorderedList")} />
        <ToolBtn label="1." title="Numbered list" onClick={() => exec("insertOrderedList")} />
        <ToolBtn label="⟸" title="Align left" onClick={() => exec("justifyLeft")} />
        <ToolBtn label="⇔" title="Center" onClick={() => exec("justifyCenter")} />
        <ToolBtn label="⟹" title="Align right" onClick={() => exec("justifyRight")} />
        <Sep />
        <ToolBtn label="Link" onClick={() => { const url = window.prompt("URL"); if (url) exec("createLink", url); }} />
        <ToolBtn label="Quote" onClick={() => exec("formatBlock", "blockquote")} />
        <div className="ml-auto flex items-center gap-1">
          <ToolBtn label="−" title="Zoom out" onClick={() => setZoom((z) => Math.max(60, z - 10))} />
          <span className="min-w-[3rem] text-center text-[11px] font-semibold tabular-nums text-slate-500">{zoom}%</span>
          <ToolBtn label="+" title="Zoom in" onClick={() => setZoom((z) => Math.min(160, z + 10))} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-auto" style={{ zoom: `${zoom}%` } as CSSProperties}>
          <DocumentCanvas
            content={content}
            onChange={setContent}
            onPaste={handlePaste}
            onBlur={() => void persist({ silent: true })}
            theme="light"
            header={header}
            footer={footer}
            onHeaderChange={setHeader}
            onFooterChange={setFooter}
            pageNumber={1}
            totalPages={1}
          />
        </div>

        {sidebarOpen ? (
          <aside className="flex w-[340px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Integrity studio</p>
                <p className="mt-0.5 text-xs text-slate-500">Live authorship signals</p>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} className="text-xs text-slate-400 hover:text-slate-700">Close</button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-cyan-50/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Composition</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${aiTone}`}>{health.aiRiskLabel}</span>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-900">{health.aiRiskScore}%</span>
                <span className="pb-1 text-xs text-slate-500">behavioural risk</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">{health.signalSummary}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl bg-white/80 px-2.5 py-2 ring-1 ring-slate-100">
                  <div className="text-slate-500">Organic</div>
                  <div className="text-sm font-bold text-slate-900">{(health.organicRatio * 100).toFixed(0)}%</div>
                </div>
                <div className="rounded-xl bg-white/80 px-2.5 py-2 ring-1 ring-slate-100">
                  <div className="text-slate-500">Paste share</div>
                  <div className="text-sm font-bold text-slate-900">{(health.pastedRatio * 100).toFixed(0)}%</div>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                {health.notes.slice(0, 3).map((n) => (
                  <li key={n} className="flex gap-1.5 leading-4"><span className="text-cyan-600">·</span><span>{n}</span></li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-1">
              <PlagiarismSidebar documentId={id} text={plainText} enabled onChange={setPlagiarism} onApply={applyPlagiarismFix} />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">Composition</p>
              <div className="mt-2 space-y-1.5">
                <div className="flex justify-between"><span>Status</span><span className="font-medium capitalize">{status}</span></div>
                <div className="flex justify-between"><span>Words</span><span className="font-medium">{wordCount}</span></div>
                <div className="flex justify-between"><span>Characters</span><span className="font-medium">{charCount}</span></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <button type="button" onClick={() => handleDownloadExport("doc")} className="rounded-lg bg-white px-2.5 py-1 font-medium ring-1 ring-slate-200 hover:bg-slate-50">.doc</button>
                <button type="button" onClick={handlePrint} className="rounded-lg bg-white px-2.5 py-1 font-medium ring-1 ring-slate-200 hover:bg-slate-50">Print</button>
                <button type="button" onClick={downloadSealedPackage} disabled={!sealBundle} className="rounded-lg bg-white px-2.5 py-1 font-medium ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-40">.veritas</button>
              </div>
              {sealBundle ? (
                <p className="mt-2 text-[11px] text-cyan-800">Package ready. Upload it on Verify to confirm integrity.</p>
              ) : (
                <p className="mt-2 text-[11px] text-slate-500">Seal creates a signed package for public verification.</p>
              )}
            </div>
          </aside>
        ) : null}
      </div>

      {error ? <div className="shrink-0 border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</div> : null}

      <footer className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-4 py-1.5 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span>Page 1</span>
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="tabular-nums">{zoom}%</span>
          <Link href="/app/dashboard" className="font-medium text-cyan-700 hover:underline">Workspace</Link>
        </div>
      </footer>
    </div>
  );
}

function Sep() {
  return <div className="mx-0.5 h-5 w-px bg-slate-200" />;
}

function ToolBtn({
  label,
  onClick,
  title,
  className = "",
}: {
  label: string;
  onClick: () => void;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title || label}
      onClick={onClick}
      className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs text-slate-700 transition hover:bg-slate-100 ${className}`}
    >
      {label}
    </button>
  );
}
