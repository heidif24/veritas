/**
 * Veritas Secure Session (proctored writing) — original browser evidence layer.
 * Honest limits: web apps cannot block second devices or OS screenshots.
 */

export type ProctorEvent = {
  type: "start" | "visibility_hidden" | "visibility_visible" | "blur" | "focus" | "fullscreen_exit" | "fullscreen_enter" | "copy" | "paste" | "end";
  at: number;
  detail?: string;
};

export type ProctorSession = {
  active: boolean;
  startedAt: number | null;
  events: ProctorEvent[];
  hiddenCount: number;
  blurCount: number;
  fullscreenExitCount: number;
  maxHiddenMs: number;
  currentHiddenSince: number | null;
};

export function createProctorSession(): ProctorSession {
  return {
    active: false,
    startedAt: null,
    events: [],
    hiddenCount: 0,
    blurCount: 0,
    fullscreenExitCount: 0,
    maxHiddenMs: 0,
    currentHiddenSince: null,
  };
}

export function proctorRiskScore(session: ProctorSession): {
  score: number;
  label: "clean" | "minor" | "elevated" | "severe";
  notes: string[];
} {
  const notes: string[] = [];
  let score = 0;
  if (session.hiddenCount >= 1) {
    score += Math.min(40, session.hiddenCount * 12);
    notes.push(`${session.hiddenCount} time(s) the session left the visible tab.`);
  }
  if (session.blurCount >= 2) {
    score += Math.min(25, session.blurCount * 5);
    notes.push(`${session.blurCount} focus losses recorded.`);
  }
  if (session.fullscreenExitCount >= 1) {
    score += Math.min(20, session.fullscreenExitCount * 10);
    notes.push(`Fullscreen exited ${session.fullscreenExitCount} time(s).`);
  }
  if (session.maxHiddenMs > 15_000) {
    score += 15;
    notes.push(`Longest absence ${(session.maxHiddenMs / 1000).toFixed(0)}s.`);
  }
  score = Math.min(100, score);
  const label = score < 15 ? "clean" : score < 35 ? "minor" : score < 60 ? "elevated" : "severe";
  if (!notes.length) notes.push("No material session interruptions recorded.");
  return { score, label, notes };
}

export async function requestSecureFullscreen(el?: HTMLElement | null) {
  const target = el || document.documentElement;
  try {
    if (target.requestFullscreen) await target.requestFullscreen();
    return true;
  } catch {
    return false;
  }
}

export async function exitSecureFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {
    /* */
  }
}
