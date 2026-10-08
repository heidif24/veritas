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
    await fetch(`/api/coaching/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    setBusy(false);
    load();
  }

  if (error && !session) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="text-[var(--danger)]">{error}</p>
        <Link href="/student/coaching" className="mt-4 inline-block text-[var(--emerald)]">
          Back
        </Link>
      </main>
    );
  }

  if (!session) {
    return <main className="px-6 py-20 text-center text-[var(--muted)]">Loading coaching room…</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="border-b border-[var(--gold)]/40 bg-[var(--gold-soft)] px-4 py-2 text-center text-xs font-medium text-[#7a6220]">
        Coaching mode — integrity telemetry is reduced. Tutor guides via comments; you write the work.
      </div>

      <header className="border-b border-[var(--line)] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--muted)]">Guided session</p>
            <h1 className="font-display text-lg text-[var(--ink)]">
              {session.studentName} · with {session.tutorName}
            </h1>
            <p className="text-xs text-[var(--muted)]">
              Status: <span className="font-semibold text-[var(--ink)]">{session.status}</span>
              {session.paymentStatus === "paid" ? " · Payout complete" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {session.teamsJoinUrl ? (
              <a
                href={session.teamsJoinUrl}
                target="_blank"
                rel="noreferrer"
                className="v-btn bg-[#5059C9] text-white hover:opacity-90"
              >
                Join Teams call
              </a>
            ) : null}
            {session.status !== "in_progress" && session.status !== "completed" ? (
              <button type="button" disabled={busy} onClick={startSession} className="v-btn v-btn-primary disabled:opacity-60">
                Start session
              </button>
            ) : null}
            {session.status === "in_progress" ? (
              <button type="button" disabled={busy} onClick={completeSession} className="v-btn v-btn-primary disabled:opacity-60">
                End &amp; pay tutor
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1fr_340px]">
        <section className="min-h-[65vh] border-r border-[var(--line)] bg-white p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--ink)]">{document?.title ?? "Draft (shared view)"}</h2>
            <span className="text-[11px] text-[var(--muted)]">Student writes · tutor guides only</span>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[55vh] w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--paper)] p-4 font-serif text-base leading-7 outline-none focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/20"
            placeholder="Write here. Your tutor can see this page and leave guidance in the side panel."
          />
        </section>

        <aside className="flex min-h-[65vh] flex-col border-l border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] px-4 py-3">
            <h2 className="text-sm font-bold text-[var(--ink)]">Guidance &amp; chat</h2>
            <p className="text-[11px] text-[var(--muted)]">Comments stay with the session record</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {comments.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No comments yet. Tutor can say “here, try this…”</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    c.authorRole === "TUTOR"
                      ? "border-[var(--emerald)]/30 bg-[var(--emerald-soft)]"
                      : "border-[var(--line)] bg-[var(--paper)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold">{c.authorName}</span>
                    <span className="text-[10px] uppercase text-[var(--muted)]">{c.authorRole}</span>
                  </div>
                  {c.anchorText ? (
                    <p className="mt-1 rounded bg-[var(--gold-soft)] px-2 py-1 font-mono text-[11px]">
                      “{c.anchorText.slice(0, 80)}{c.anchorText.length > 80 ? "…” : "”"}
                    </p>
                  ) : null}
                  <p className="mt-1">{c.body}</p>
                </div>
              ))
            )}
          </div>
          <div className="space-y-2 border-t border-[var(--line)] bg-white p-3">
            <input
              value={anchor}
              onChange={(e) => setAnchor(e.target.value)}
              placeholder="Anchor text (optional)"
              className="v-input !py-1.5 text-xs"
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Guidance comment…"
              rows={2}
              className="v-input"
            />
            <button
              type="button"
              disabled={busy || !commentText.trim()}
              onClick={postComment}
              className="v-btn v-btn-primary w-full disabled:opacity-50"
            >
              Send guidance
            </button>
            {session.status === "in_progress" ? (
              <button type="button" disabled={busy} onClick={completeSession} className="v-btn v-btn-secondary w-full disabled:opacity-60">
                End &amp; credit tutor
              </button>
            ) : session.status !== "completed" ? (
              <button type="button" disabled={busy} onClick={startSession} className="v-btn v-btn-secondary w-full disabled:opacity-60">
                Start session
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
