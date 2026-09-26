"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type ReactNode } from "react";

type Props = {
  content: string;
  onChange: (html: string) => void;
  onPaste?: (event: ClipboardEvent<HTMLDivElement>) => void;
  onBlur?: () => void;
  theme?: "light" | "dark";
  header?: string;
  footer?: string;
  onHeaderChange?: (value: string) => void;
  onFooterChange?: (value: string) => void;
  pageNumber?: number;
  totalPages?: number;
};

const INCH = 96; // CSS px per inch approximation
const PAGE_WIDTH = 8.5 * INCH;
const PAGE_HEIGHT = 11 * INCH;
const MARGIN = 1 * INCH;

function RulerTicks({ orientation, lengthPx, majorEvery = INCH }: { orientation: "h" | "v"; lengthPx: number; majorEvery?: number }) {
  const ticks: ReactNode[] = [];
  const isH = orientation === "h";
  const count = Math.ceil(lengthPx / (majorEvery / 4));

  for (let i = 0; i <= count; i++) {
    const pos = (i * majorEvery) / 4;
    if (pos > lengthPx) break;
    const isMajor = i % 4 === 0;
    const isHalf = i % 2 === 0;
    const size = isMajor ? 12 : isHalf ? 8 : 5;
    const label = isMajor ? Math.round(pos / INCH) : null;

    if (isH) {
      ticks.push(
        <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: pos }}>
          <div className={`w-px bg-slate-500/70 ${isMajor ? "h-3" : isHalf ? "h-2" : "h-1.5"}`} />
          {label !== null && label > 0 && (
            <span className="mt-0.5 text-[9px] font-medium text-slate-500 select-none">{label}</span>
          )}
        </div>
      );
    } else {
      ticks.push(
        <div key={i} className="absolute left-0 flex items-center" style={{ top: pos }}>
          <div className={`h-px bg-slate-500/70 ${isMajor ? "w-3" : isHalf ? "w-2" : "w-1.5"}`} />
          {label !== null && label > 0 && (
            <span className="ml-0.5 text-[9px] font-medium text-slate-500 select-none">{label}</span>
          )}
        </div>
      );
    }
  }
  return <>{ticks}</>;
}

export function DocumentCanvas({
  content,
  onChange,
  onPaste,
  onBlur,
  theme = "light",
  header = "",
  footer = "",
  onHeaderChange,
  onFooterChange,
  pageNumber = 1,
  totalPages = 1,
}: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showGuides, setShowGuides] = useState(true);
  const isLight = theme === "light";

  // Keep contentEditable in sync when content prop changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      // Only update if not focused to avoid cursor jumps
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [content]);

  const pageBg = isLight ? "bg-white text-slate-900" : "bg-slate-950 text-slate-100";
  const guideBorder = isLight ? "border-slate-300" : "border-slate-600";
  const deskBg = isLight ? "bg-slate-200/90" : "bg-slate-900/80";

  return (
    <div className={`relative overflow-auto rounded-[22px] border ${isLight ? "border-slate-200" : "border-white/10"} ${deskBg}`}>
      {/* Toolbar strip for canvas controls */}
      <div className={`sticky top-0 z-20 flex items-center justify-between gap-3 border-b px-3 py-1.5 text-[10px] uppercase tracking-wider ${isLight ? "border-slate-300 bg-slate-100 text-slate-600" : "border-white/10 bg-slate-900 text-slate-400"}`}>
        <div className="flex items-center gap-3">
          <span>Page layout · Letter (8.5 × 11 in)</span>
          <button
            type="button"
            onClick={() => setShowGuides((v) => !v)}
            className={`rounded px-2 py-0.5 font-semibold ${showGuides ? "bg-cyan-500/20 text-cyan-700" : "bg-slate-300/50 text-slate-500"}`}
          >
            {showGuides ? "Guides on" : "Guides off"}
          </button>
        </div>
        <span className="tabular-nums">Page {pageNumber} of {totalPages}</span>
      </div>

      <div className="relative flex min-h-[780px] p-6 pt-2">
        {/* Vertical ruler */}
        <div
          className={`relative mr-1 shrink-0 overflow-hidden border-r ${isLight ? "border-slate-300 bg-slate-100" : "border-white/10 bg-slate-900"}`}
          style={{ width: 28, height: PAGE_HEIGHT + 40 }}
        >
          <div className="absolute inset-0" style={{ height: PAGE_HEIGHT }}>
            <RulerTicks orientation="v" lengthPx={PAGE_HEIGHT} />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          {/* Horizontal ruler */}
          <div
            className={`relative mb-1 overflow-hidden border-b ${isLight ? "border-slate-300 bg-slate-100" : "border-white/10 bg-slate-900"}`}
            style={{ height: 28, width: PAGE_WIDTH + 2 }}
          >
            <div className="absolute inset-0">
              <RulerTicks orientation="h" lengthPx={PAGE_WIDTH} />
            </div>
          </div>

          {/* The page itself */}
          <div
            className={`relative mx-auto shadow-2xl shadow-black/20 ring-1 ring-black/5 ${pageBg}`}
            style={{
              width: PAGE_WIDTH,
              minHeight: PAGE_HEIGHT,
            }}
          >
            {/* Margin guides (optional) */}
            {showGuides && (
              <>
                <div className={`pointer-events-none absolute border-l border-dashed ${guideBorder} opacity-60`} style={{ left: MARGIN, top: 0, bottom: 0 }} />
                <div className={`pointer-events-none absolute border-r border-dashed ${guideBorder} opacity-60`} style={{ right: MARGIN, top: 0, bottom: 0 }} />
                <div className={`pointer-events-none absolute border-t border-dashed ${guideBorder} opacity-60`} style={{ top: MARGIN * 0.7, left: 0, right: 0 }} />
                <div className={`pointer-events-none absolute border-b border-dashed ${guideBorder} opacity-60`} style={{ bottom: MARGIN * 0.7, left: 0, right: 0 }} />
              </>
            )}

            {/* Header zone */}
            <div
              className={`border-b border-dashed px-4 py-2 text-center text-xs ${isLight ? "border-slate-200 text-slate-500" : "border-white/10 text-slate-400"}`}
              style={{ minHeight: MARGIN * 0.65, paddingLeft: MARGIN, paddingRight: MARGIN }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onHeaderChange?.((e.target as HTMLDivElement).innerText)}
                className="min-h-[1.4em] outline-none focus:bg-cyan-50/30 rounded px-1"
                data-placeholder="Header (double-click to edit)"
              >
                {header || "\u00A0"}
              </div>
            </div>

            {/* Main editable body */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
              onPaste={onPaste}
              onBlur={onBlur}
              className="outline-none prose prose-slate max-w-none leading-7"
              style={{
                minHeight: PAGE_HEIGHT - MARGIN * 1.5,
                paddingLeft: MARGIN,
                paddingRight: MARGIN,
                paddingTop: 16,
                paddingBottom: 16,
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Footer zone */}
            <div
              className={`border-t border-dashed px-4 py-2 text-center text-xs ${isLight ? "border-slate-200 text-slate-500" : "border-white/10 text-slate-400"}`}
              style={{ minHeight: MARGIN * 0.55, paddingLeft: MARGIN, paddingRight: MARGIN }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onFooterChange?.((e.target as HTMLDivElement).innerText)}
                className="min-h-[1.4em] outline-none focus:bg-cyan-50/30 rounded px-1"
              >
                {footer || `Page ${pageNumber}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
