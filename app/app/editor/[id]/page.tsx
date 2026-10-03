"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  scoreCompositionHealth,
  type CompositionOperation,
} from "@/lib/composition-health";

/**
 * Editor with live transparency streaming + baseline-aware seal.
 * Streams ops to /api/transparency and compares baseline on seal.
 */
export default function EditorPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const [title, setTitle] = useState("Untitled composition");
  const [content, setContent] = useState("<p></p>");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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

  const plainText = useMemo(() => {
    if (typeof document === "undefined") return content.replace(/<[^>]+>/g, " ");
    const el = document.createElement("div");
    el.innerHTML = content;
    return el.innerText || "";
  }, [content]);

  const wordCount = useMemo(() => {
    const t = plainText.trim();
    return t ? t.split(/\s+/).length : 0;
  }, [plainText]);

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
        setTitle(doc.title || "Untitled composition");
        setContent(doc.content || "<p></p>");
        setStatus(doc.status || "draft");
        if (doc.sealedHash) setSealedHash(doc.sealedHash);
        lastPlainLen.current = (doc.content || "").replace(/<[^>]+>/g, " ").length;
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
          body: JSON.stringify({ title, content }),
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
    [id, title, content],
  );

  useEffect(() => {
    if (loading || !id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void persist({ silent: true }), 2500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, content, loading, id, persist]);

  useEffect(() => {
    if (loading) return;
    const len = plainText.length;
    const delta = len - lastPlainLen.current;
    if (delta === 0) return;
    const kind: CompositionOperation["kind"] = delta > 12 ? "paste" : delta < 0 ? "delete" : "type";
    setOps((prev) => [...prev.slice(-400), { timestamp: Date.now(), kind, chars: Math.abs(delta) }]);
    lastPlainLen.current = len;
  }, [plainText, loading]);

  // Live transparency stream from composition ops
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
          ops: ops.map((o) => ({ kind: o.kind, type: o.kind, timestamp: o.timestamp, chars: o.chars })),
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
          setMessage("Sealed — export the Veritas package to verify");
        }
      }
    } catch {
      setError("Seal failed.");
    } finally {
      setSealing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <p className="text-sm font-medium">Opening composition…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0 flex-1">
          <Link href="/app/dashboard" className="text-xs font-semibold text-cyan-700">
            ← Workspace
          </Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border-0 bg-transparent text-lg font-semibold outline-none"
            placeholder="Composition title"
          />
          <div className="mt-1 text-[11px] text-slate-500">
            {saving ? "Saving…" : message || "Autosave"}{" "}
            {sealedHash ? `· sealed ${sealedHash.slice(0, 10)}…` : ""}
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void persist()} className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-slate-100">
            Save
          </button>
          <button
            type="button"
            onClick={() => void handleSeal()}
            disabled={sealing || status === "submitted"}
            className="rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50"
          >
            {sealing ? "Sealing…" : status === "submitted" ? "Sealed" : "Seal authenticity"}
          </button>
          <Link href="/student/transparency" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold">
            Transparency
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 text-[11px]">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold">
          Risk · {health.aiRiskLabel} ({health.aiRiskScore}%)
        </span>
        <span className="text-slate-500">
          Organic {(health.organicRatio * 100).toFixed(0)}% · Paste {(health.pastedRatio * 100).toFixed(0)}%
        </span>
        {liveTransparency?.continuity ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Continuity · {liveTransparency.continuity}</span>
        ) : null}
        {liveTransparency?.sessionStructure ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Session · {liveTransparency.sessionStructure}</span>
        ) : null}
        {typeof liveTransparency?.externalBulkPastes === "number" && liveTransparency.externalBulkPastes > 0 ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-800">
            External-bulk · {liveTransparency.externalBulkPastes}
          </span>
        ) : null}
        {baselineNote ? (
          <span className="rounded-full bg-cyan-50 px-2.5 py-1 font-semibold text-cyan-800" title={baselineNote}>
            Baseline compared
          </span>
        ) : null}
        <span className="ml-auto text-slate-500">{wordCount} words</span>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 p-6">
        <textarea
          value={plainText}
          onChange={(e) => {
            const next = e.target.value;
            setContent(`<p>${next.replace(/\n/g, "</p><p>")}</p>`);
          }}
          onPaste={(e) => {
            const text = e.clipboardData?.getData("text/plain") || "";
            if (text.length > 0) {
              setOps((prev) => [...prev.slice(-400), { timestamp: Date.now(), kind: "paste", chars: text.length }]);
            }
          }}
          className="min-h-[60vh] w-full resize-y rounded-2xl border border-slate-200 bg-white p-6 text-[15px] leading-relaxed shadow-sm outline-none focus:border-cyan-400"
          placeholder="Start writing…"
        />
      </div>

      {error ? <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</div> : null}
    </div>
  );
}
