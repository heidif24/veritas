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

const INCH = 96;
const PAGE_WIDTH = 8.5 * INCH;
const PAGE_HEIGHT = 11 * INCH;
const MARGIN = 1 * INCH;

function RulerTicks({
  orientation,
  lengthPx,
  majorEvery = INCH,
}: {
  orientation: "h" | "v";
  lengthPx: number;
  majorEvery?: number;
}) {
  const ticks: ReactNode[] = [];
  const isH = orientation === "h";
  const count = Math.ceil(lengthPx / (majorEvery / 8));

  for (let i = 0; i <= count; i++) {
    const pos = (i * majorEvery) / 8;
    if (pos > lengthPx) break;
    const isMajor = i % 8 === 0;
    const isHalf = i % 4 === 0;
    const label = isMajor ? Math.round(pos / INCH) : null;

    if (isH) {
      ticks.push(
        <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: pos }}>
          <div
            className={`w-px bg-slate-400/70 ${isMajor ? "h-3.5" : isHalf ? "h-2.5" : "h-1.5"}`}
          />
          {label !== null && label > 0 ? (
            <span className="mt-0.5 select-none text-[9px] font-medium tabular-nums text-slate-500">
              {label}
            </span>
          ) : null}
        </div>
      );
    } else {
      ticks.push(
        <div key={i} className="absolute left-0 flex items-center" style={{ top: pos }}>
          <div
            className={`h-px bg-slate-400/70 ${isMajor ? "w-3.5" : isHalf ? "w-2.5" : "w-1.5"}`}
          />
          {label !== null && label > 0 ? (
            <span className="ml-0.5 select-none text-[9px] font-medium tabular-nums text-slate-500">
              {label}
            </span>
          ) : null}
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

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [content]);

  return (
    <div className={`relative overflow-auto ${isLight ? "bg-slate-200/80" : "bg-slate-900"}`}>
      <div
        className={`sticky top-0 z-20 flex items-center justify-between gap-3 border-b px-3 py-1.5 text-[11px] ${
          isLight ? "border-slate-200 bg-white/90 text-slate-600 backdrop-blur" : "border-white/10 bg-slate-900 text-slate-400"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-cyan-800">Composition page</span>
          <span className="text-slate-300">|</span>
          <span>Letter · 8.5″ × 11″</span>
          <button
            type="button"
            onClick={() => setShowGuides((v) => !v)}
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              showGuides ? "bg-cyan-100 text-cyan-800" : "bg-slate-100 text-slate-500"
            }`}
          >
            {showGuides ? "Guides on" : "Guides off"}
          </button>
        </div>
        <span className="tabular-nums">
          Page {pageNumber} of {totalPages}
        </span>
      </div>

      <div className="relative flex min-h-[820px] justify-center p-6 pt-4">
        <div
          className={`relative mr-0 shrink-0 overflow-hidden rounded-l-md border ${
            isLight ? "border-slate-200 bg-white" : "border-white/10 bg-slate-900"
          }`}
          style={{ width: 22, height: PAGE_HEIGHT + 26 }}
        >
          <div className="absolute inset-0" style={{ top: 26, height: PAGE_HEIGHT }}>
            <RulerTicks orientation="v" lengthPx={PAGE_HEIGHT} />
          </div>
        </div>

        <div>
          <div
            className={`relative overflow-hidden rounded-t-md border-b ${
              isLight ? "border-slate-200 bg-white" : "border-white/10 bg-slate-900"
            }`}
            style={{ height: 22, width: PAGE_WIDTH }}
          >
            <RulerTicks orientation="h" lengthPx={PAGE_WIDTH} />
          </div>

          <div
            className="relative bg-white text-slate-900 shadow-[0_8px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80"
            style={{ width: PAGE_WIDTH, minHeight: PAGE_HEIGHT }}
          >
            {showGuides ? (
              <>
                <div
                  className="pointer-events-none absolute border-l border-dashed border-cyan-300/60"
                  style={{ left: MARGIN, top: 0, bottom: 0 }}
                />
                <div
                  className="pointer-events-none absolute border-r border-dashed border-cyan-300/60"
                  style={{ right: MARGIN, top: 0, bottom: 0 }}
                />
                <div
                  className="pointer-events-none absolute border-t border-dashed border-cyan-300/60"
                  style={{ top: MARGIN * 0.65, left: 0, right: 0 }}
                />
                <div
                  className="pointer-events-none absolute border-b border-dashed border-cyan-300/60"
                  style={{ bottom: MARGIN * 0.55, left: 0, right: 0 }}
                />
              </>
            ) : null}

            <div
              className="border-b border-dashed border-slate-100 text-center text-xs text-slate-400"
              style={{
                minHeight: MARGIN * 0.6,
                paddingLeft: MARGIN,
                paddingRight: MARGIN,
                paddingTop: 8,
                paddingBottom: 4,
              }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onHeaderChange?.((e.target as HTMLDivElement).innerText)}
                className="min-h-[1.25em] rounded px-1 outline-none focus:bg-cyan-50/50"
              >
                {header || "\u00A0"}
              </div>
            </div>

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
              onPaste={onPaste}
              onBlur={onBlur}
              className="outline-none"
              style={{
                minHeight: PAGE_HEIGHT - MARGIN * 1.4,
                paddingLeft: MARGIN,
                paddingRight: MARGIN,
                paddingTop: 12,
                paddingBottom: 12,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "12pt",
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div
              className="border-t border-dashed border-slate-100 text-center text-xs text-slate-400"
              style={{
                minHeight: MARGIN * 0.5,
                paddingLeft: MARGIN,
                paddingRight: MARGIN,
                paddingTop: 4,
                paddingBottom: 8,
              }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onFooterChange?.((e.target as HTMLDivElement).innerText)}
                className="min-h-[1.25em] rounded px-1 outline-none focus:bg-cyan-50/50"
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
