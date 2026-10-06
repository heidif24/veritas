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
import { PlagiarismSidebar } from "@/components/editor/PlagiarismSidebar";
import {
  scoreCompositionHealth,
  type CompositionOperation,
} from "@/lib/composition-health";

type RibbonTab = "home" | "insert" | "layout" | "review" | "view";

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
  const [ops, setOps] = useState<CompositionOperation[]>([]);
  const [focusLosses, setFocusLosses] = useState(0);
  const [sealedHash, setSealedHash] = useState("");
  const [liveTransparency, setLiveTransparency] = useState<{
    continuity?: string;
    sessionStructure?: string;
    externalBulkPastes?: number;
    activeWritingMinutes?: number;
    riskLabel?: string;
    organicRatio?: number;
  } | null>(null);
  const [baselineNote, setBaselineNote] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transparencyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPlainLen = useRef(0);
  const sessionStart = useRef(Date.now());

  const plainText = useMemo(() => stripHtml(content), [content]);
  const wordCount = useMemo(() => {
    const t = plainText.trim();
    return t ? t.split(/\s+/).length : 0;
  }, [plainText]);
  const charCount = plainText.length;
  const health = useMemo(() => scoreCompositionHealth(ops, focusLosses), [ops, focusLosses]);

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
          return;
        }
        const doc = data.document ?? data;
        setTitle(doc.title || "Untitled document");
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
      try {
        const res = await fetch(`/api/documents/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, header, footer }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Save failed.");
        } else if (!opts?.silent) {
          setMessage("Saved");
          setTimeout(() => setMessage(""), 2000);
        }
      } catch {
        setError("Save failed.");
      } finally {
        setSaving(false);
      }
    },
    [id, title, content, header, footer],
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
    const kind: CompositionOperation["kind"] =
      delta > 12 ? "paste" : delta < 0 ? "delete" : "type";
    setOps((prev) => [...prev.slice(-400), { timestamp: Date.now(), kind, chars: Math.abs(delta) }]);
    lastPlainLen.current = len;
  }, [plainText, loading]);

  useEffect(() => {
    if (loading || ops.length === 0) return;
    if (transparencyTimer.current) clearTimeout(transparencyTimer.current);
    transparencyTimer.current = setTimeout(() => {
      void fetch("/api/transparency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ops, focusLosses, text: plainText }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.live) {
            setLiveTransparency({
              continuity: data.live.continuity,
              sessionStructure: data.live.sessionStructure,
              externalBulkPastes: data.live.externalBulkPastes,
              activeWritingMinutes: data.live.activeWritingMinutes,
              riskLabel: data.live.riskLabel,
              organicRatio: data.live.organicRatio,
            });
          }
        })
        .catch(() => {});
    }, 1800);
    return () => {
      if (transparencyTimer.current) clearTimeout(transparencyTimer.current);
    };
  }, [ops, focusLosses, plainText, loading]);

  useEffect(() => {
    const onBlur = () => setFocusLosses((n) => n + 1);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  async function handleSeal() {
    if (!id) return;
    if (plainText.trim().length < 40) {
      setError("Write a meaningful draft (40+ characters) before sealing.");
      return;
    }
    setSealing(true);
    setError("");
    try {
      await persist({ silent: true });
      const telemetry = {
        startAt: new Date(sessionStart.current).toISOString(),
        lastInputAt: new Date().toISOString(),
        blurCount: focusLosses,
        aiRiskScore: health.aiRiskScore,
        aiRiskLabel: health.aiRiskLabel,
        organicRatio: health.organicRatio,
        pastedRatio: health.pastedRatio,
      };
      const res = await fetch(`/api/documents/${encodeURIComponent(id)}/seal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ops: ops.map((o) => ({
            kind: o.kind,
            type: o.kind,
            timestamp: o.timestamp,
            chars: o.chars,
          })),
          telemetry,
          assignmentId: id,
          compareBaseline: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Could not seal composition.");
      else {
        setStatus(data.document?.status || "submitted");
        setSealedHash(data.seal || data.document?.sealedHash || "");
        if (data.baselineComparison?.summary) {
          setBaselineNote(data.baselineComparison.summary);
          setMessage("Sealed · " + data.baselineComparison.summary);
        } else {
          setMessage("Sealed — you can now download the Veritas package");
        }
      }
    } catch {
      setError("Seal failed.");
    } finally {
      setSealing(false);
    }
  }

  function handleDownload() {
    const payload = {
      id,
      title,
      content,
      header,
      footer,
      status,
      sealedHash: sealedHash || null,
      wordCount,
      charCount,
      health: {
        aiRiskLabel: health.aiRiskLabel,
        aiRiskScore: health.aiRiskScore,
        organicRatio: health.organicRatio,
        pastedRatio: health.pastedRatio,
      },
      liveTransparency,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "document").replace(/[^a-z0-9-_]/gi, "_")}.veritas.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Downloaded");
    setTimeout(() => setMessage(""), 2000);
  }

  function handlePrint() {
    window.print();
  }

  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    const text = e.clipboardData?.getData("text/plain") || "";
    if (text.length > 0) {
      setOps((prev) => [
        ...prev.slice(-400),
        { timestamp: Date.now(), kind: "paste", chars: text.length },
      ]);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-slate-600">
        <p className="text-sm font-medium">Opening document…</p>
      </div>
    );
  }

  const tabs: { id: RibbonTab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "insert", label: "Insert" },
    { id: "layout", label: "Layout" },
    { id: "review", label: "Review" },
    { id: "view", label: "View" },
  ];

  const recentOps = ops.slice(-12).reverse();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f3f3f3] text-slate-800">
      {/* Title bar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-300 bg-white px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/app/dashboard" className="shrink-0 text-xs font-bold text-[#2b579a]" title="Back to workspace">
            Veritas
          </Link>
          <div className="min-w-0">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full max-w-md truncate border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none focus:ring-0"
              aria-label="Document title"
            />
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="capitalize">{status}</span>
              <span>·</span>
              <span>{saving ? "Saving…" : message || "Autosave on"}</span>
              {sealedHash ? <span>· sealed {sealedHash.slice(0, 8)}…</span> : null}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => void persist()}
            className="rounded px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Download
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Print
          </button>
          <button
            type="button"
            onClick={() => void handleSeal()}
            disabled={sealing || status === "submitted" || status === "sealed"}
            className="rounded bg-[#2b579a] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1e3f6f] disabled:opacity-50"
          >
            {sealing ? "Sealing…" : status === "submitted" || status === "sealed" ? "Sealed" : "Seal"}
          </button>
        </div>
      </div>

      {/* Ribbon tabs */}
      <div className="shrink-0 border-b border-slate-300 bg-white">
        <div className="flex items-center gap-0 px-2 pt-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setRibbon(t.id)}
              className={`rounded-t px-3 py-1.5 text-xs font-semibold ${
                ribbon === t.id
                  ? "border border-b-0 border-slate-300 bg-[#f3f3f3] text-[#2b579a]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-stretch gap-0 border-t border-slate-200 bg-[#f3f3f3] px-2 py-2">
          {ribbon === "home" ? (
            <>
              <RibbonGroup label="Clipboard">
                <RibbonBtn label="Paste" onClick={() => exec("paste")} />
                <RibbonBtn label="Cut" onClick={() => exec("cut")} />
                <RibbonBtn label="Copy" onClick={() => exec("copy")} />
              </RibbonGroup>
              <RibbonDivider />
              <RibbonGroup label="Font">
                <select
                  value={fontName}
                  onChange={(e) => {
                    setFontName(e.target.value);
                    exec("fontName", e.target.value);
                  }}
                  className="h-7 rounded border border-slate-300 bg-white px-1.5 text-xs"
                >
                  {["Calibri", "Arial", "Times New Roman", "Georgia", "Verdana", "Courier New"].map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    exec("fontSize", String(Math.min(7, Math.max(1, Math.round(Number(e.target.value) / 4))));
                  }}
                  className="h-7 w-14 rounded border border-slate-300 bg-white px-1 text-xs"
                >
                  {["10", "11", "12", "14", "16", "18", "24", "36"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <RibbonBtn label="B" title="Bold" className="font-bold" onClick={() => exec("bold")} />
                <RibbonBtn label="I" title="Italic" className="italic" onClick={() => exec("italic")} />
                <RibbonBtn label="U" title="Underline" className="underline" onClick={() => exec("underline")} />
              </RibbonGroup>
              <RibbonDivider />
              <RibbonGroup label="Paragraph">
                <RibbonBtn label="• List" onClick={() => exec("insertUnorderedList")} />
                <RibbonBtn label="1. List" onClick={() => exec("insertOrderedList")} />
                <RibbonBtn label="←" title="Align left" onClick={() => exec("justifyLeft")} />
                <RibbonBtn label="≡" title="Center" onClick={() => exec("justifyCenter")} />
                <RibbonBtn label="→" title="Align right" onClick={() => exec("justifyRight")} />
                <RibbonBtn label="⇔" title="Justify" onClick={() => exec("justifyFull")} />
              </RibbonGroup>
              <RibbonDivider />
              <RibbonGroup label="Styles">
                <RibbonBtn label="Normal" onClick={() => exec("formatBlock", "p")} />
                <RibbonBtn label="Heading 1" onClick={() => exec("formatBlock", "h1")} />
                <RibbonBtn label="Heading 2" onClick={() => exec("formatBlock", "h2")} />
              </RibbonGroup>
            </>
          ) : null}

          {ribbon === "insert" ? (
            <>
              <RibbonGroup label="Pages">
                <RibbonBtn label="Page break" onClick={() => exec("insertHorizontalRule")} />
              </RibbonGroup>
              <RibbonDivider />
              <RibbonGroup label="Links">
                <RibbonBtn
                  label="Hyperlink"
                  onClick={() => {
                    const url = window.prompt("URL");
                    if (url) exec("createLink", url);
                  }}
                />
              </RibbonGroup>
              <RibbonDivider />
              <RibbonGroup label="Header & Footer">
                <span className="px-2 text-[11px] text-slate-500">Edit header / footer on the page</span>
              </RibbonGroup>
            </>
          ) : null}

          {ribbon === "layout" ? (
            <>
              <RibbonGroup label="Page Setup">
                <span className="px-2 text-[11px] text-slate-600">Letter · Portrait · 1″ margins</span>
              </RibbonGroup>
              <RibbonDivider />
              <RibbonGroup label="Paragraph">
                <RibbonBtn label="Indent +" onClick={() => exec("indent")} />
                <RibbonBtn label="Indent −" onClick={() => exec("outdent")} />
              </RibbonGroup>
            </>
          ) : null}

          {ribbon === "review" ? (
            <>
              <RibbonGroup label="Proofing">
                <RibbonBtn label="Activities panel" onClick={() => setSidebarOpen(true)} />
              </RibbonGroup>
              <RibbonDivider />
              <RibbonGroup label="Protect">
                <RibbonBtn label="Seal document" onClick={() => void handleSeal()} />
              </RibbonGroup>
            </>
          ) : null}

          {ribbon === "view" ? (
            <>
              <RibbonGroup label="Zoom">
                <RibbonBtn label="−" onClick={() => setZoom((z) => Math.max(50, z - 10))} />
                <span className="px-2 text-xs font-semibold tabular-nums text-slate-700">{zoom}%</span>
                <RibbonBtn label="+" onClick={() => setZoom((z) => Math.min(200, z + 10))} />
                <RibbonBtn label="100%" onClick={() => setZoom(100)} />
              </RibbonGroup>
              <RibbonDivider />
              <RibbonGroup label="Show">
                <RibbonBtn
                  label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                  onClick={() => setSidebarOpen((v) => !v)}
                />
              </RibbonGroup>
            </>
          ) : null}
        </div>
      </div>

      {/* Main area: canvas + activities sidebar */}
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
          <aside className="flex w-[320px] shrink-0 flex-col overflow-hidden border-l border-slate-300 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Activities</p>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Hide
              </button>
            </div>

            {/* Live health */}
            <div className="space-y-2 border-b border-slate-100 px-3 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Authorship health</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-bold">
                  {health.aiRiskLabel} ({health.aiRiskScore}%)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                  Organic <span className="font-semibold">{(health.organicRatio * 100).toFixed(0)}%</span>
                </div>
                <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                  Paste <span className="font-semibold">{(health.pastedRatio * 100).toFixed(0)}%</span>
                </div>
                {liveTransparency?.continuity ? (
                  <div className="rounded-lg bg-slate-50 px-2 py-1.5 col-span-2">
                    Continuity · <span className="font-semibold">{liveTransparency.continuity}</span>
                  </div>
                ) : null}
                {liveTransparency?.sessionStructure ? (
                  <div className="rounded-lg bg-slate-50 px-2 py-1.5 col-span-2">
                    Session · <span className="font-semibold">{liveTransparency.sessionStructure}</span>
                  </div>
                ) : null}
                {typeof liveTransparency?.externalBulkPastes === "number" &&
                liveTransparency.externalBulkPastes > 0 ? (
                  <div className="rounded-lg bg-amber-50 px-2 py-1.5 col-span-2 text-amber-800">
                    External-bulk · {liveTransparency.externalBulkPastes}
                  </div>
                ) : null}
                {baselineNote ? (
                  <div className="rounded-lg bg-cyan-50 px-2 py-1.5 col-span-2 text-cyan-800" title={baselineNote}>
                    Baseline compared
                  </div>
                ) : null}
              </div>
            </div>

            {/* Recent activity feed */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Recent activity
              </p>
              {recentOps.length === 0 ? (
                <p className="text-xs text-slate-400">Start typing to see live activity…</p>
              ) : (
                <ul className="space-y-1.5">
                  {recentOps.map((op, i) => (
                    <li
                      key={`${op.timestamp}-${i}`}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px]"
                    >
                      <span className="font-medium capitalize text-slate-700">{op.kind}</span>
                      <span className="text-slate-500">{op.chars} chars</span>
                      <span className="tabular-nums text-slate-400">
                        {new Date(op.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Originality / plagiarism */}
            <div className="border-t border-slate-200 p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Originality
              </p>
              <div className="[&>aside]:rounded-xl [&>aside]:border-slate-200 [&>aside]:bg-slate-50 [&>aside]:text-slate-800">
                <PlagiarismSidebar documentId={id} text={plainText} enabled />
              </div>
            </div>

            {/* Document stats */}
            <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Words</span>
                <span className="font-medium">{wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Characters</span>
                <span className="font-medium">{charCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Focus losses</span>
                <span className="font-medium">{focusLosses}</span>
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      {/* Status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-slate-300 bg-white px-3 py-1 text-[11px] text-slate-600">
        <div className="flex items-center gap-4">
          <span>Page 1 of 1</span>
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-3">
          {error ? <span className="text-red-600">{error}</span> : null}
          <span className="tabular-nums">{zoom}%</span>
          <Link href="/app/dashboard" className="text-[#2b579a] hover:underline">
            Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}

function RibbonGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-2">
      <div className="flex flex-wrap items-center gap-1">{children}</div>
      <div className="mt-1 text-[9px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function RibbonDivider() {
  return <div className="mx-1 w-px self-stretch bg-slate-300" />;
}

function RibbonBtn({
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
      className={`h-7 min-w-[28px] rounded border border-transparent px-2 text-xs text-slate-700 hover:border-slate-300 hover:bg-white ${className}`}
    >
      {label}
    </button>
  );
}
