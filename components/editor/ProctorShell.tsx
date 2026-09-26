"use client";

import { useEffect, useRef, useState } from "react";
import {
  createProctorSession,
  proctorRiskScore,
  requestSecureFullscreen,
  exitSecureFullscreen,
  type ProctorEvent,
  type ProctorSession,
} from "@/lib/proctor";

type Props = {
  enabled: boolean;
  title?: string;
  onSessionUpdate?: (session: ProctorSession) => void;
  children: React.ReactNode;
};

export function ProctorShell({ enabled, title, onSessionUpdate, children }: Props) {
  const [session, setSession] = useState<ProctorSession>(() => createProctorSession());
  const [started, setStarted] = useState(false);
  const [warning, setWarning] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  function pushEvent(type: ProctorEvent["type"], detail?: string) {
    setSession((prev) => {
      const next: ProctorSession = {
        ...prev,
        events: [...prev.events, { type, at: Date.now(), detail }].slice(-200),
      };
      if (type === "visibility_hidden") {
        next.hiddenCount += 1;
        next.currentHiddenSince = Date.now();
      }
      if (type === "visibility_visible" && prev.currentHiddenSince) {
        const dur = Date.now() - prev.currentHiddenSince;
        next.maxHiddenMs = Math.max(prev.maxHiddenMs, dur);
        next.currentHiddenSince = null;
      }
      if (type === "blur") next.blurCount += 1;
      if (type === "fullscreen_exit") next.fullscreenExitCount += 1;
      onSessionUpdate?.(next);
      return next;
    });
  }

  useEffect(() => {
    if (!enabled || !started) return;

    const onVis = () => {
      if (document.hidden) {
        pushEvent("visibility_hidden");
        setWarning("Secure session: you left this tab. This is recorded for your instructor.");
      } else {
        pushEvent("visibility_visible");
      }
    };
    const onBlur = () => {
      pushEvent("blur");
      setWarning("Focus left the secure writing window.");
    };
    const onFs = () => {
      if (!document.fullscreenElement) {
        pushEvent("fullscreen_exit");
        setWarning("Fullscreen ended. Return to fullscreen to continue under secure conditions.");
      } else {
        pushEvent("fullscreen_enter");
      }
    };

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFs);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [enabled, started]);

  async function startSession() {
    const ok = await requestSecureFullscreen(rootRef.current);
    setSession((s) => ({
      ...s,
      active: true,
      startedAt: Date.now(),
      events: [...s.events, { type: "start", at: Date.now() }],
    }));
    setStarted(true);
    if (!ok) setWarning("Fullscreen could not be entered. Session still monitors tab focus.");
  }

  async function endSession() {
    pushEvent("end");
    await exitSecureFullscreen();
    setStarted(false);
    setSession((s) => ({ ...s, active: false }));
  }

  if (!enabled) return <>{children}</>;

  const risk = proctorRiskScore(session);

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">Veritas Secure Session</p>
        <h1 className="mt-3 max-w-lg text-3xl font-black tracking-tight">{title || "Proctored assignment"}</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
          When you start, Veritas requests fullscreen and records tab switches, focus loss, and fullscreen exits.
          This is evidence for your instructor — not a claim of perfect lockdown.
        </p>
        <ul className="mt-6 max-w-md space-y-2 text-left text-xs text-slate-400">
          <li>· Stay on this tab until you submit or end the session</li>
          <li>· Avoid minimizing or switching applications</li>
          <li>· Interruptions are logged on your integrity report</li>
        </ul>
        <button type="button" onClick={() => void startSession()} className="mt-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30">
          Start secure session
        </button>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative flex min-h-screen flex-col bg-slate-100">
      <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950">
        <span className="font-bold">Secure session active · interruptions: {session.hiddenCount + session.blurCount}</span>
        <span className="font-semibold capitalize">Integrity signal: {risk.label}</span>
        <button type="button" onClick={() => void endSession()} className="rounded-full bg-amber-900 px-3 py-1 text-[11px] font-bold text-white">
          End session
        </button>
      </div>
      {warning ? <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-800">{warning}</div> : null}
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
