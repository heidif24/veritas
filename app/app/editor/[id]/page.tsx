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
  type ReactNode,
} from "react";
import { DocumentCanvas } from "@/components/editor/DocumentCanvas";
import { PlagiarismSidebar, type PlagiarismMatch } from "@/components/editor/PlagiarismSidebar";
import { VeritasMark } from "@/app/components/veritas-logo";
import {
  scoreCompositionHealth,
  type CompositionHealth,
  type CompositionOperation,
} from "@/lib/composition-health";

type RibbonTab = "file" | "home" | "insert" | "layout" | "review" | "view";

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
<style>@page{size:letter;margin:1in}body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.5}
.header,.footer{text-align:center;font-size:10pt;color:#555}</style></head><body>
<div class="header">${opts.header ? opts.header.replace(/</g, "<") : "&nbsp;"}</div>
<div>${opts.bodyHtml || "<p></p>"}</div>
<div class="footer">${opts.footer ? opts.footer.replace(/</g, "<") : ""}</div>
<script>window.onload=function(){window.focus();window.print();}</script></body></html>`;
}

function buildWordHtml(opts: { title: string; header: string; footer: string; bodyHtml: string }) {
  return `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/><title>${opts.title.replace(/</g, "<")}</title>
<style>@page{size:8.5in 11in;margin:1in}body{font-family:Calibri,Arial,sans-serif;font-size:12pt}</style></head><body>
${opts.header ? `<p style="text-align:center">${opts.header.replace(/</g, "<")}</p>` : ""}
${opts.bodyHtml || "<p></p>"}
${opts.footer ? `<p style="text-align:center">${opts.footer.replace(/</g, "<")}</p>` : ""}
</body></html>`;
}

export default function EditorPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [title, setTitle] = useState("Untitled document");
  const [content, setContent] = useState("<p></p>");
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ribbon, setRibbon] = useState<RibbonTab>("home");
  const [fontName, setFontName] = useState("Calibri");
  const [fontSize, setFontSize] = useState("12");
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [downloadMenu, setDownloadMenu] = useState(false);
  const [ops, setOps] = useState<CompositionOperation[]>([]);
  const [focusLosses, setFocusLosses] = useState(0);
  const [plagiarism, setPlagiarism] = useState({ score: 0, threshold: 20, blocked: false, matches: [] as PlagiarismMatch[] });
  const [sealBundle, setSealBundle] = useState<SealBundle | null>(null);
  const [sealedHash, setSealedHash] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const downloadRef = useRef<HTMLDivElement | null>(null);
  const lastPlainLen = useRef(0);
  const sessionStart = useRef(Date.now());

  const plainText = useMemo(() => stripHtml(content), [content]);
  const wordCount = useMemo(() => { const t = plainText.trim(); return t ? t.split(/\s+/).length : 0; }, [plainText]);
  const charCount = plainText.length;
  const health: CompositionHealth = useMemo(() => scoreCompositionHealth(ops, focusLosses), [ops, focusLosses]);
  const canSeal = !plagiarism.blocked && health.aiRiskLabel !== "Critical" && plainText.trim().length >= 40;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/documents/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) { setError(data.error || "Could not load document."); setLoading(false); return; }
        const doc = data.document ?? data;
        setTitle(doc.title || "Untitled document");
        setContent(doc.content || "<p></p>");
        setStatus(doc.status || "draft");
        setHeader(doc.header || "");
        setFooter(doc.footer || "");
        if (doc.sealedHash) setSealedHash(doc.sealedHash);
        lastPlainLen.current = stripHtml(doc.content || "").length;
      } catch { if (!cancelled) setError("Failed to load document."); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const persist = useCallback(async (opts?: { silent?: boolean }) => {
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
      else if (!opts?.silent) { setMessage("Saved"); setTimeout(() => setMessage(""), 2000); }
    } catch { setError("Save failed."); }
    finally { setSaving(false); }
  }, [id, title, content, header, footer]);

  useEffect(() => {
    if (loading || !id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void persist({ silent: true }), 2500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
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
    if (!w) { setError("Allow pop-ups to print."); return; }
    w.document.open(); w.document.write(html); w.document.close();
  }, [title, header, footer, content]);

  const handleDownloadExport = useCallback((format: "html" | "doc" | "txt") => {
    const base = safeFilename(title);
    if (format === "txt") downloadBlob(new Blob([plainText], { type: "text/plain;charset=utf-8" }), `${base}.txt`);
    else if (format === "html") downloadBlob(new Blob([buildPrintHtml({ title, header, footer, bodyHtml: content })], { type: "text/html;charset=utf-8" }), `${base}.html`);
    else downloadBlob(new Blob([buildWordHtml({ title, header, footer, bodyHtml: content })], { type: "application/msword;charset=utf-8" }), `${base}.doc`);
    setDownloadMenu(false);
    setMessage(`Downloaded .${format}`);
    setTimeout(() => setMessage(""), 2000);
  }, [title, header, footer, content, plainText]);

  const downloadSealedPackage = useCallback(() => {
    if (!sealBundle) { setError("Seal the document first to download a verifiable package."); return; }
    downloadBlob(new Blob([JSON.stringify(sealBundle, null, 2)], { type: "application/json;charset=utf-8" }), `${safeFilename(title)}.veritas.json`);
    setDownloadMenu(false);
    setMessage("Sealed package downloaded");
    setTimeout(() => setMessage(""), 2500);
  }, [sealBundle, title]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "s") { e.preventDefault(); void persist(); }
      else if (e.key === "p") { e.preventDefault(); handlePrint(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [persist, handlePrint]);

  useEffect(() => {
    if (!downloadMenu) return;
    function onDoc(e: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) setDownloadMenu(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [downloadMenu]);

  async function handleSeal() {
    if (!id) return;
    if (!canSeal) {
      setError(
        plagiarism.blocked
          ? `Similarity ${plagiarism.score}% is at or above the ${plagiarism.threshold}% threshold. Resolve matches before sealing.`
          : health.aiRiskLabel === "Critical"
            ? "Composition risk is Critical. Continue drafting organically before sealing."
            : "Write at least a short draft (40+ characters) before sealing."
      );
      setRibbon("review");
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
      if (!res.ok) setError(data.error || "Could not seal document.");
      else {
        setStatus(data.document?.status || "submitted");
        setSealedHash(data.seal || data.document?.sealedHash || "");
        if (data.bundle) setSealBundle(data.bundle as SealBundle);
        setMessage("Sealed — download the Veritas package to verify");
      }
    } catch { setError("Seal failed."); }
    finally { setSealing(false); }
  }

  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    const text = e.clipboardData?.getData("text/plain") || "";
    if (text.length > 0) setOps((prev) => [...prev.slice(-400), { timestamp: Date.now(), kind: "paste", chars: text.length }]);
  }

  function applyPlagiarismFix(match: PlagiarismMatch, mode: "quote" | "paraphrase") {
    if (!match.snippet) return;
    if (mode === "quote") setContent((c) => c + `<blockquote><p>${match.snippet}</p><p><cite>${match.sourceTitle || match.matchedSourceUrl}</cite></p></blockquote>`);
    else { setMessage("Select the flagged passage and rewrite in your own words."); setTimeout(() => setMessage(""), 4000); }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-slate-600"><div className="text-sm font-medium">Opening document…</div></div>;
  }

  const tabs: { id: RibbonTab; label: string }[] = [
    { id: "file", label: "File" }, { id: "home", label: "Home" }, { id: "insert", label: "Insert" },
    { id: "layout", label: "Layout" }, { id: "review", label: "Review" }, { id: "view", label: "View" },
  ];

  const aiTone =
    health.aiRiskLabel === "Low" ? "text-emerald-700 bg-emerald-50 ring-emerald-200"
    : health.aiRiskLabel === "Moderate" ? "text-amber-800 bg-amber-50 ring-amber-200"
    : health.aiRiskLabel === "High" ? "text-orange-800 bg-orange-50 ring-orange-200"
    : "text-red-800 bg-red-50 ring-red-200";
  const simTone = plagiarism.score < plagiarism.threshold * 0.5 ? "text-emerald-700" : plagiarism.blocked ? "text-red-700" : "text-amber-700";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f3f3f3] text-slate-800">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-300 bg-white px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/app/dashboard" className="shrink-0" title="Workspace"><VeritasMark /></Link>
          <div className="min-w-0">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full max-w-md truncate border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none" aria-label="Document title" />
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
              <span className="capitalize">{status}</span><span>·</span>
              <span>{saving ? "Saving…" : message || "Autosave on"}</span>
              {sealedHash ? (<><span>·</span><span className="font-mono text-emerald-700" title={sealedHash}>sealed {sealedHash.slice(0, 8)}…</span></>) : null}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" title="Save (Ctrl+S)" onClick={() => void persist()} className="rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">Save</button>
          <button type="button" title="Print (Ctrl+P)" onClick={handlePrint} className="rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">Print</button>
          <div className="relative" ref={downloadRef}>
            <button type="button" onClick={() => setDownloadMenu((v) => !v)} className="rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">Download ▾</button>
            {downloadMenu ? (
              <div className="absolute right-0 z-50 mt-1 min-w-[220px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button type="button" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50" onClick={() => handleDownloadExport("doc")}>Word (.doc)</button>
                <button type="button" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50" onClick={() => handleDownloadExport("html")}>Web page (.html)</button>
                <button type="button" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50" onClick={() => handleDownloadExport("txt")}>Plain text (.txt)</button>
                <div className="my-1 border-t border-slate-100" />
                <button type="button" className={`block w-full px-3 py-2 text-left text-xs ${sealBundle ? "hover:bg-slate-50" : "cursor-not-allowed text-slate-400"}`} onClick={downloadSealedPackage} disabled={!sealBundle}>Sealed package (.veritas.json)</button>
              </div>
            ) : null}
          </div>
          <button type="button" onClick={() => void handleSeal()} disabled={sealing || status === "submitted"} className="rounded bg-[#2b579a] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1e3f6f] disabled:opacity-50">{sealing ? "Sealing…" : status === "submitted" ? "Sealed" : "Seal"}</button>
          <Link href="/verify" className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Verify</Link>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-3 py-1.5 text-[11px]">
        <span className={`rounded-full px-2 py-0.5 font-semibold ring-1 ${aiTone}`}>AI risk: {health.aiRiskLabel} ({health.aiRiskScore}%)</span>
        <span className={`font-semibold ${simTone}`}>Similarity: {plagiarism.score}%{plagiarism.blocked ? " · blocked" : ""}</span>
        <span className="text-slate-500">Organic {(health.organicRatio * 100).toFixed(0)}%</span>
        <span className="text-slate-500">Paste {(health.pastedRatio * 100).toFixed(0)}%</span>
        {!canSeal && status !== "submitted" ? <span className="text-amber-700">Seal requires clear similarity and non-critical AI risk</span> : null}
      </div>

      <div className="shrink-0 border-b border-slate-300 bg-white">
        <div className="flex items-center gap-0 px-2 pt-1">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setRibbon(t.id)} className={`rounded-t px-3 py-1.5 text-xs font-semibold ${
              ribbon === t.id ? (t.id === "file" ? "border border-b-0 border-slate-300 bg-[#2b579a] text-white" : "border border-b-0 border-slate-300 bg-[#f3f3f3] text-[#2b579a]") : "text-slate-600 hover:bg-slate-100"
            }`}>{t.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-stretch gap-0 border-t border-slate-200 bg-[#f3f3f3] px-2 py-2">
          {ribbon === "file" ? (<><RibbonGroup label="Save"><RibbonBtn label="Save" onClick={() => void persist()} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Print"><RibbonBtn label="Print" onClick={handlePrint} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Download"><RibbonBtn label="Word" onClick={() => handleDownloadExport("doc")} /><RibbonBtn label="HTML" onClick={() => handleDownloadExport("html")} /><RibbonBtn label="Text" onClick={() => handleDownloadExport("txt")} /><RibbonBtn label="Sealed package" onClick={downloadSealedPackage} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Protect"><RibbonBtn label="Seal" onClick={() => void handleSeal()} /><RibbonBtn label="Verify" onClick={() => { window.location.href = "/verify"; }} /></RibbonGroup></>) : null}
          {ribbon === "home" ? (<><RibbonGroup label="Clipboard"><RibbonBtn label="Paste" onClick={() => exec("paste")} /><RibbonBtn label="Cut" onClick={() => exec("cut")} /><RibbonBtn label="Copy" onClick={() => exec("copy")} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Font"><select value={fontName} onChange={(e) => { setFontName(e.target.value); exec("fontName", e.target.value); }} className="h-7 rounded border border-slate-300 bg-white px-1.5 text-xs">{["Calibri", "Arial", "Times New Roman", "Georgia", "Verdana", "Courier New"].map((f) => <option key={f} value={f}>{f}</option>)}</select><select value={fontSize} onChange={(e) => { setFontSize(e.target.value); exec("fontSize", String(Math.min(7, Math.max(1, Math.round(Number(e.target.value) / 4))))); }} className="h-7 w-14 rounded border border-slate-300 bg-white px-1 text-xs">{["10", "11", "12", "14", "16", "18", "24", "36"].map((s) => <option key={s} value={s}>{s}</option>)}</select><RibbonBtn label="B" title="Bold" className="font-bold" onClick={() => exec("bold")} /><RibbonBtn label="I" title="Italic" className="italic" onClick={() => exec("italic")} /><RibbonBtn label="U" title="Underline" className="underline" onClick={() => exec("underline")} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Paragraph"><RibbonBtn label="• List" onClick={() => exec("insertUnorderedList")} /><RibbonBtn label="1. List" onClick={() => exec("insertOrderedList")} /><RibbonBtn label="←" title="Left" onClick={() => exec("justifyLeft")} /><RibbonBtn label="≡" title="Center" onClick={() => exec("justifyCenter")} /><RibbonBtn label="→" title="Right" onClick={() => exec("justifyRight")} /><RibbonBtn label="⇔" title="Justify" onClick={() => exec("justifyFull")} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Styles"><RibbonBtn label="Normal" onClick={() => exec("formatBlock", "p")} /><RibbonBtn label="H1" onClick={() => exec("formatBlock", "h1")} /><RibbonBtn label="H2" onClick={() => exec("formatBlock", "h2")} /></RibbonGroup></>) : null}
          {ribbon === "insert" ? (<><RibbonGroup label="Pages"><RibbonBtn label="Page break" onClick={() => exec("insertHorizontalRule")} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Links"><RibbonBtn label="Hyperlink" onClick={() => { const url = window.prompt("URL"); if (url) exec("createLink", url); }} /></RibbonGroup></>) : null}
          {ribbon === "layout" ? (<><RibbonGroup label="Page Setup"><span className="px-2 text-[11px] text-slate-600">Letter · Portrait · 1" margins</span></RibbonGroup><RibbonDivider /><RibbonGroup label="Paragraph"><RibbonBtn label="Indent +" onClick={() => exec("indent")} /><RibbonBtn label="Indent −" onClick={() => exec("outdent")} /></RibbonGroup></>) : null}
          {ribbon === "review" ? (<><RibbonGroup label="Proofing"><RibbonBtn label="Originality" onClick={() => setSidebarOpen(true)} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Authenticity"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ring-1 ${aiTone}`}>{health.aiRiskLabel}</span></RibbonGroup><RibbonDivider /><RibbonGroup label="Protect"><RibbonBtn label="Seal" onClick={() => void handleSeal()} /><RibbonBtn label="Download seal" onClick={downloadSealedPackage} /></RibbonGroup></>) : null}
          {ribbon === "view" ? (<><RibbonGroup label="Zoom"><RibbonBtn label="−" onClick={() => setZoom((z) => Math.max(50, z - 10))} /><span className="px-2 text-xs font-semibold tabular-nums">{zoom}%</span><RibbonBtn label="+" onClick={() => setZoom((z) => Math.min(200, z + 10))} /><RibbonBtn label="100%" onClick={() => setZoom(100)} /></RibbonGroup><RibbonDivider /><RibbonGroup label="Show"><RibbonBtn label={sidebarOpen ? "Hide panel" : "Show panel"} onClick={() => setSidebarOpen((v) => !v)} /></RibbonGroup></>) : null}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-auto" style={{ zoom: `${zoom}%` } as CSSProperties}>
          <DocumentCanvas content={content} onChange={setContent} onPaste={handlePaste} onBlur={() => void persist({ silent: true })} theme="light" header={header} footer={footer} onHeaderChange={setHeader} onFooterChange={setFooter} pageNumber={1} totalPages={1} />
        </div>
        {sidebarOpen ? (
          <div className="flex w-[320px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-slate-300 bg-white p-3">
            <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Integrity</p><button type="button" onClick={() => setSidebarOpen(false)} className="text-xs text-slate-400 hover:text-slate-700">Hide</button></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Composition</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${aiTone}`}>{health.aiRiskLabel}</span></div>
              <div className="mt-2 text-2xl font-black text-slate-900">{health.aiRiskScore}%</div>
              <p className="mt-1 text-xs leading-5 text-slate-600">{health.signalSummary}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-100"><div className="text-slate-500">Organic</div><div className="font-semibold">{(health.organicRatio * 100).toFixed(0)}%</div></div>
                <div className="rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-100"><div className="text-slate-500">Paste</div><div className="font-semibold">{(health.pastedRatio * 100).toFixed(0)}%</div></div>
              </div>
              <ul className="mt-3 space-y-1 text-[11px] text-slate-600">{health.notes.slice(0, 3).map((n) => (<li key={n} className="leading-4">· {n}</li>))}</ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-1"><PlagiarismSidebar documentId={id} text={plainText} enabled onChange={setPlagiarism} onApply={applyPlagiarismFix} /></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <div className="font-semibold text-slate-800">Document</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between"><span>Status</span><span className="font-medium capitalize">{status}</span></div>
                <div className="flex justify-between"><span>Words</span><span className="font-medium">{wordCount}</span></div>
                <div className="flex justify-between"><span>Characters</span><span className="font-medium">{charCount}</span></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <button type="button" onClick={() => handleDownloadExport("doc")} className="rounded bg-white px-2 py-1 font-medium ring-1 ring-slate-200 hover:bg-slate-100">Word</button>
                <button type="button" onClick={handlePrint} className="rounded bg-white px-2 py-1 font-medium ring-1 ring-slate-200 hover:bg-slate-100">Print</button>
                <button type="button" onClick={downloadSealedPackage} disabled={!sealBundle} className="rounded bg-white px-2 py-1 font-medium ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-40">.veritas</button>
              </div>
              {sealBundle ? <p className="mt-2 text-[11px] text-emerald-700">Sealed package ready. Upload it on Verify to confirm integrity.</p> : <p className="mt-2 text-[11px] text-slate-500">Seal creates a signed package for public verification.</p>}
            </div>
          </div>
        ) : null}
      </div>

      {error ? <div className="shrink-0 border-t border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700">{error}</div> : null}
      <div className="flex shrink-0 items-center justify-between border-t border-slate-300 bg-white px-3 py-1 text-[11px] text-slate-600">
        <div className="flex items-center gap-4"><span>Page 1 of 1</span><span>{wordCount} words</span><span>{charCount} characters</span></div>
        <div className="flex items-center gap-3"><span className="tabular-nums">{zoom}%</span><button type="button" onClick={handlePrint} className="text-[#2b579a] hover:underline">Print</button><Link href="/app/dashboard" className="text-[#2b579a] hover:underline">Workspace</Link></div>
      </div>
    </div>
  );
}

function RibbonGroup({ label, children }: { label: string; children: ReactNode }) {
  return (<div className="flex flex-col items-center px-2"><div className="flex flex-wrap items-center gap-1">{children}</div><div className="mt-1 text-[9px] font-medium uppercase tracking-wide text-slate-500">{label}</div></div>);
}
function RibbonDivider() { return <div className="mx-1 w-px self-stretch bg-slate-300" />; }
function RibbonBtn({ label, onClick, title, className = "" }: { label: string; onClick: () => void; title?: string; className?: string }) {
  return (<button type="button" title={title || label} onClick={onClick} className={`h-7 min-w-[28px] rounded border border-transparent px-2 text-xs text-slate-700 hover:border-slate-300 hover:bg-white ${className}`}>{label}</button>);
}
