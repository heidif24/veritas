"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { VeritasMark } from "@/app/components/veritas-logo";

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
  const router = useRouter();
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
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const plainText = useMemo(() => stripHtml(content), [content]);
  const wordCount = useMemo(() => {
    const t = plainText.trim();
    return t ? t.split(/\s+/).length : 0;
  }, [plainText]);
  const charCount = plainText.length;

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
        setTitle(doc.title || "Untitled document");
        setContent(doc.content || "<p></p>");
        setStatus(doc.status || "draft");
        setHeader(doc.header || "");
        setFooter(doc.footer || "");
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
        if (!res.ok) {
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
    [id, title, content, header, footer]
  );

  useEffect(() => {
    if (loading || !id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist({ silent: true });
    }, 2500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, content, header, footer, loading, id, persist]);

  async function handleSeal() {
    if (!id) return;
    setSealing(true);
    setError("");
    try {
      await persist({ silent: true });
      const res = await fetch(`/api/documents/${encodeURIComponent(id)}/seal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not seal document.");
      } else {
        setStatus("sealed");
        setMessage("Document sealed");
      }
    } catch {
      setError("Seal failed.");
    } finally {
      setSealing(false);
    }
  }

  function handlePaste(_e: ClipboardEvent<HTMLDivElement>) {
    /* default paste */
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-slate-600">
        <div className="text-sm font-medium">Opening document…</div>
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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f3f3f3] text-slate-800">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-300 bg-white px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/app/dashboard" className="shrink-0" title="Back to workspace">
            <VeritasMark />
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
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => void persist()} className="rounded px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
            Save
          </button>
          <button
            type="button"
            onClick={() => void handleSeal()}
            disabled={sealing || status === "sealed"}
            className="rounded bg-[#2b579a] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1e3f6f] disabled:opacity-50"
          >
            {sealing ? "Sealing…" : status === "sealed" ? "Sealed" : "Seal"}
          </button>
          <Link href="/verify" className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Verify
          </Link>
        </div>
      </div>

      <div className="shrink-0 border-b border-slate-300 bg-white">
        <div className="flex items-center gap-0 px-2 pt-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setRibbon(t.id)}
              className={`rounded-t px-3 py-1.5 text-xs font-semibold ${
                ribbon === t.id ? "border border-b-0 border-slate-300 bg-[#f3f3f3] text-[#2b579a]" : "text-slate-600 hover:bg-slate-100"
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
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    exec("fontSize", String(Math.min(7, Math.max(1, Math.round(Number(e.target.value) / 4)))));
                  }}
                  className="h-7 w-14 rounded border border-slate-300 bg-white px-1 text-xs"
                >
                  {["10", "11", "12", "14", "16", "18", "24", "36"].map((s) => (
                    <option key={s} value={s}>{s}</option>
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
                <span className="px-2 text-[11px] text-slate-500">Edit on the page header / footer areas</span>
              </RibbonGroup>
            </>
          ) : null}

          {ribbon === "layout" ? (
            <>
              <RibbonGroup label="Page Setup">
                <span className="px-2 text-[11px] text-slate-600">Letter · Portrait · 1&quot; margins</span>
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
                <RibbonBtn label="Originality panel" onClick={() => setSidebarOpen(true)} />
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
                <RibbonBtn label={sidebarOpen ? "Hide sidebar" : "Show sidebar"} onClick={() => setSidebarOpen((v) => !v)} />
              </RibbonGroup>
            </>
          ) : null}
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
          <div className="w-[300px] shrink-0 overflow-y-auto border-l border-slate-300 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Originality</p>
              <button type="button" onClick={() => setSidebarOpen(false)} className="text-xs text-slate-400 hover:text-slate-700">
                Hide
              </button>
            </div>
            <div className="[&>aside]:rounded-xl [&>aside]:border-slate-200 [&>aside]:bg-slate-50 [&>aside]:text-slate-800">
              <PlagiarismSidebar documentId={id} text={plainText} enabled />
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <div className="font-semibold text-slate-800">Document</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between"><span>Status</span><span className="capitalize font-medium">{status}</span></div>
                <div className="flex justify-between"><span>Words</span><span className="font-medium">{wordCount}</span></div>
                <div className="flex justify-between"><span>Characters</span><span className="font-medium">{charCount}</span></div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-slate-300 bg-white px-3 py-1 text-[11px] text-slate-600">
        <div className="flex items-center gap-4">
          <span>Page 1 of 1</span>
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-3">
          {error ? <span className="text-red-600">{error}</span> : null}
          <span className="tabular-nums">{zoom}%</span>
          <Link href="/app/dashboard" className="text-[#2b579a] hover:underline">Workspace</Link>
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
