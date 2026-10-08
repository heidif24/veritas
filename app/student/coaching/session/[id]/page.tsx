"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Comment = {
  id: string;
  authorId: string;
  authorRole: string;
  authorName: string;
  body: string;
  anchorText: string | null;
  createdAt: string;
};

type SessionData = {
  id: string;
  studentName: string;
  tutorName: string;
  status: string;
  teamsJoinUrl: string | null;
  calendlyEventUrl: string | null;
  durationMinutes: number;
  paymentStatus: string;
  tutorPayoutCents: number;
  platformFeeCents: number;
  currency: string;
};

export default function CoachingSessionRoomPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [session, setSession] = useState<SessionData | null>(null);
  const [document, setDocument] = useState<{ id: string; title: string; content: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [commentText, setCommentText] = useState("");
  const [anchor, setAnchor] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/coaching/sessions/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load session");
      return;
    }
    setSession(data.session);
    setDocument(data.document);
    setDraft(data.document?.content ?? "");
    setComments(data.comments ?? []);
  }, [id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);

  async function postComment() {
    if (!commentText.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/coaching/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "comment", body: commentText, anchorText: anchor || null }),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok && data.comment) {
      setComments((c) => [...c, data.comment]);
      setCommentText("");
      setAnchor("");
    }
  }

  async function startSession() {
    setBusy(true);
    await fetch(`/api/coaching/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    });
    setBusy(false);
    load();
  }

  async function completeSession() {
    setBusy(true);
    const res = await fetch(`/api/coaching/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    setBusy(false);
    if (res.ok) load();
  }

  if (error) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/student/coaching" className="mt-4 inline-block text-cyan-700">Back</Link>
      </main>
    );
  }

  if (!session) {
    return <main className="px-6 py-20 text-center text-slate-500">Loading coaching room…</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Reduced telemetry banner */}
      <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-xs font-medium text-emerald-900">
        Coaching mode — integrity telemetry is reduced. Tutor guides via comments; you write the work.
      </div>

      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">Guided session</p>
            <h1 className="text-lg font-bold">
              {session.studentName} · with {session.tutorName}
            </h1>
            <p className="text-xs text-slate-500">
              Status: <span className="font-semibold">{session.status}</span>
              {session.paymentStatus === "paid" ? " · Payout complete" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {session.teamsJoinUrl ? (
              <a
                href={session.teamsJoinUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#5059C9] px-4 py-2 text-sm font-bold text-white"
              >
                Join Teams call
              </a>
            ) : null}
            {session.calendlyEventUrl ? (
              <a
                href={session.calendlyEventUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
              >
                Calendly
              </a>
            ) : null}
            {session.status !== "in_progress" && session.status !== "completed" ? (
              <button
                type="button"
                disabled={busy}
                onClick={startSession}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                Start session
              </button>
            ) : null}
            {session.status === "in_progress" ? (
              <button
                type="button"
                disabled={busy}
                onClick={completeSession}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                End &amp; pay tutor
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1fr_360px]">
        {/* Student writing surface — tutor does not co-edit; only comments */}
        <section className="min-h-[70vh] border-r border-slate-200 bg-white p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">
              {document?.title ?? "Draft (shared view)"}
            </h2>
            <span className="text-[11px] text-slate-400">Student writes · tutor guides only</span>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[55vh] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 font-serif text-base leading-7 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            placeholder="Write here. Your tutor can see this page and leave guidance in the side panel."
          />
          <p className="mt-2 text-xs text-slate-500">
            Tip: select a phrase and paste it into “Anchor” when leaving a comment so feedback is tied to a place in the draft.
          </p>
        </section>

        {/* Side chat / comments */}
        <aside className="flex min-h-[70vh] flex-col bg-slate-50">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-800">Guidance &amp; chat</h2>
            <p className="text-[11px] text-slate-500">Comments stay with the session record</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500">No comments yet. Tutor can say “here, try this…”</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    c.authorRole === "TUTOR"
                      ? "border-violet-200 bg-violet-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">{c.authorName}</span>
                    <span className="text-[10px] uppercase text-slate-400">{c.authorRole}</span>
                  </div>
                  {c.anchorText ? (
                    <p className="mt-1 rounded bg-amber-50 px-2 py-1 font-mono text-[11px] text-amber-900">
                      “{c.anchorText.slice(0, 80)}{c.anchorText.length > 80 ? "…” : "”"}
                    </p>
                  ) : null}
                  <p className="mt-1 text-slate-800">{c.body}</p>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-slate-200 bg-white p-3 space-y-2">
            <input
              value={anchor}
              onChange={(e) => setAnchor(e.target.value)}
              placeholder="Anchor text (optional)"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-violet-400"
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Guidance comment…"
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
            <button
              type="button"
              disabled={busy || !commentText.trim()}
              onClick={postComment}
              className="w-full rounded-full bg-violet-600 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              Send guidance
            </button>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-slate-500">
        Platform fee {(session.platformFeeCents / 100).toFixed(0)} {session.currency} · Tutor earns{" "}
        {(session.tutorPayoutCents / 100).toFixed(0)} {session.currency} when session is completed.{" "}
        <Link href="/student/coaching" className="font-semibold text-cyan-700">All sessions</Link>
      </div>
    </main>
  );
}
