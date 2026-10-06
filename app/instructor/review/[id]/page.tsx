"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Comment = {
  id: string;
  quote: string;
  note: string;
  createdAt: string;
  color: "yellow" | "green" | "pink" | "blue";
};

type ActivityEvent = {
  time: string;
  kind: "type" | "paste" | "delete" | "focus" | "seal";
  detail: string;
  chars?: number;
};

const DEMO_DOC = `
<p><strong>Existentialism and Choice</strong></p>
<p>Choice is not an abstract condition but a lived pattern of decisions, revisions, and returns to unfinished thought. The writer who revises a thesis three times is not merely polishing prose; they are enacting the very freedom Sartre describes.</p>
<p>In the middle sections, the argument turns toward responsibility. Each draft branch that was abandoned leaves a trace in the composition record — a pause, a delete burst, a return. These traces matter for academic review because they show process, not only product.</p>
<p>A short quoted note was introduced with a source marker: “Man is condemned to be free” (Sartre, 1946). Surrounding paragraphs were typed in continuous bursts with minimal external paste, consistent with organic drafting.</p>
<p>Final revisions tightened transitions and sealed the composition for submission. The integrity package captures timing, focus losses, paste ratios, and the cryptographic seal for later verification.</p>
`;

const DEMO_ACTIVITIES: ActivityEvent[] = [
  { time: "08:12", kind: "type", detail: "Opening thesis drafted in short bursts", chars: 420 },
  { time: "08:29", kind: "delete", detail: "Restructured paragraph — 86 characters removed", chars: 86 },
  { time: "08:41", kind: "focus", detail: "Focus lost (tab switch) · 42s away" },
  { time: "09:14", kind: "paste", detail: "Source note pasted and marked as citation", chars: 48 },
  { time: "09:22", kind: "type", detail: "Synthesis paragraphs continued", chars: 610 },
  { time: "09:57", kind: "seal", detail: "Composition sealed for submission" },
];

const COLOR_MAP = {
  yellow: "bg-amber-200/80 ring-amber-400",
  green: "bg-emerald-200/80 ring-emerald-400",
  pink: "bg-pink-200/80 ring-pink-400",
  blue: "bg-sky-200/80 ring-sky-400",
};

export default function FacultyReviewStudio() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Submission");
  const [studentName, setStudentName] = useState("Student");
  const [html, setHtml] = useState(DEMO_DOC);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      quote: "Choice is not an abstract condition",
      note: "Strong opening — aligns with rubric criterion A (thesis clarity).",
      createdAt: new Date().toISOString(),
      color: "green",
    },
  ]);
  const [commentDraft, setCommentDraft] = useState("");
  const [selectedQuote, setSelectedQuote] = useState("");
  const [commentColor, setCommentColor] = useState<Comment["color"]>("yellow");
  const [score, setScore] = useState<number | "">("");
  const [maxScore] = useState(100);
  const [rubricNotes, setRubricNotes] = useState("");
  const [decision, setDecision] = useState<"pending" | "accepted" | "revision" | "referred">("pending");
  const [message, setMessage] = useState("");
  const [panel, setPanel] = useState<"integrity" | "comments" | "grade">("integrity");
  const docRef = useRef<HTMLDivElement | null>(null);

  const integrity = useMemo(
    () => ({
      overall: "Human-authored",
      organicRatio: 0.94,
      pastedRatio: 0.03,
      aiRiskScore: 12,
      aiRiskLabel: "Low",
      focusLosses: 3,
      activeMinutes: 86,
      wordCount: 512,
      sealStatus: "Sealed",
      similarity: 8,
      similarityThreshold: 20,
      externalBulkPastes: 0,
      continuity: "Steady",
      sessionStructure: "Multi-session with coherent return",
    }),
    [],
  );

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports/${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          const r = data.report || data;
          if (!cancelled) {
            setTitle(String(r.title || r.documentTitle || "Submission"));
            setStudentName(String(r.studentName || r.author || "Student"));
            if (r.contentHtml || r.content) setHtml(String(r.contentHtml || r.content));
          }
        }
      } catch {
        /* demo fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const captureSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (text.length < 2) return;
    setSelectedQuote(text.slice(0, 280));
    setPanel("comments");
  }, []);

  function addComment() {
    if (!commentDraft.trim() && !selectedQuote) return;
    const c: Comment = {
      id: `c-${Date.now()}`,
      quote: selectedQuote || "(general note)",
      note: commentDraft.trim() || "Highlighted for review",
      createdAt: new Date().toISOString(),
      color: commentColor,
    };
    setComments((prev) => [c, ...prev]);
    setCommentDraft("");
    setSelectedQuote("");
    setMessage("Comment added");
    setTimeout(() => setMessage(""), 2000);
  }

  function removeComment(cid: string) {
    setComments((prev) => prev.filter((c) => c.id !== cid));
  }

  async function saveGrade() {
    setMessage("Saving…");
    try {
      await fetch(`/api/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: id,
          decision,
          notes: rubricNotes,
          score: score === "" ? null : Number(score),
          maxScore,
          comments,
        }),
      });
      setMessage("Grade & decision saved");
    } catch {
      setMessage("Saved locally (demo)");
    }
    setTimeout(() => setMessage(""), 2500);
  }

  function downloadSubmissionPackage() {
    const payload = {
      submissionId: id,
      title,
      studentName,
      score: score === "" ? null : Number(score),
      maxScore,
      decision,
      comments,
      integrity,
      activities: DEMO_ACTIVITIES,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}-review-package.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
        Opening review studio…
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      {/* Top bar */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
            <Link href="/instructor" className="hover:underline">
              Lecturer
            </Link>
            <span className="text-slate-300">/</span>
            <span>Review studio</span>
          </div>
          <h1 className="truncate text-base font-bold text-slate-900">{title}</h1>
          <p className="text-xs text-slate-500">
            {studentName} · Submission {id}
            {score !== "" ? ` · Score ${score}/${maxScore}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {message ? <span className="text-xs font-medium text-emerald-700">{message}</span> : null}
          <button
            type="button"
            onClick={downloadSubmissionPackage}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
          >
            Download package
          </button>
          <button
            type="button"
            onClick={() => void saveGrade()}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-500"
          >
            Save grade
          </button>
          <Link
            href="/instructor/assignment/a-102"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Back to queue
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Document reader */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-1.5 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">Document</span>
            <span className="text-slate-300">|</span>
            <span>Select text to highlight & comment</span>
            <span className="ml-auto tabular-nums">{integrity.wordCount} words</span>
          </div>
          <div className="flex-1 overflow-auto bg-slate-200/80 p-6">
            <div className="mx-auto max-w-3xl rounded-sm bg-white shadow-lg ring-1 ring-slate-200">
              <div className="border-b border-dashed border-slate-100 px-12 py-3 text-center text-xs text-slate-400">
                {studentName} · {title}
              </div>
              <div
                ref={docRef}
                className="min-h-[70vh] px-12 py-8 text-[15px] leading-[1.75] text-slate-800"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                onMouseUp={captureSelection}
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <div className="border-t border-dashed border-slate-100 px-12 py-3 text-center text-xs text-slate-400">
                Page 1 · Sealed submission
              </div>
            </div>
          </div>
        </div>

        {/* Right panels */}
        <aside className="flex w-[380px] shrink-0 flex-col border-l border-slate-200 bg-white">
          <div className="flex shrink-0 border-b border-slate-200">
            {(
              [
                ["integrity", "Integrity"],
                ["comments", "Comments"],
                ["grade", "Grade"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPanel(key)}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wide ${
                  panel === key
                    ? "border-b-2 border-violet-600 text-violet-700"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {panel === "integrity" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Verdict</div>
                  <div className="mt-1 text-xl font-black text-slate-900">{integrity.overall}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Risk {integrity.aiRiskLabel} ({integrity.aiRiskScore}%) · Seal {integrity.sealStatus}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ["Organic drafting", `${Math.round(integrity.organicRatio * 100)}%`],
                    ["Direct pastes", `${Math.round(integrity.pastedRatio * 100)}%`],
                    ["Similarity", `${integrity.similarity}% / ${integrity.similarityThreshold}%`],
                    ["Focus losses", String(integrity.focusLosses)],
                    ["Active writing", `${integrity.activeMinutes} min`],
                    ["External bulk", String(integrity.externalBulkPastes)],
                    ["Continuity", integrity.continuity],
                    ["Session", integrity.sessionStructure],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
                      <div className="mt-0.5 font-semibold text-slate-900">{value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Composition timeline
                  </div>
                  <ul className="space-y-2">
                    {DEMO_ACTIVITIES.map((ev) => (
                      <li
                        key={ev.time + ev.detail}
                        className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                      >
                        <span className="w-10 shrink-0 font-mono text-slate-500">{ev.time}</span>
                        <div className="min-w-0">
                          <span
                            className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              ev.kind === "paste"
                                ? "bg-amber-100 text-amber-800"
                                : ev.kind === "delete"
                                  ? "bg-rose-100 text-rose-800"
                                  : ev.kind === "seal"
                                    ? "bg-violet-100 text-violet-800"
                                    : ev.kind === "focus"
                                      ? "bg-slate-200 text-slate-700"
                                      : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {ev.kind}
                          </span>
                          <p className="mt-1 text-slate-700">{ev.detail}</p>
                          {ev.chars != null ? (
                            <p className="text-[10px] text-slate-400">{ev.chars} chars</p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[11px] leading-5 text-slate-500">
                  Process evidence supports fair review. Veritas does not auto-issue misconduct findings — the lecturer
                  decides using full context.
                </p>
              </div>
            ) : null}

            {panel === "comments" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    New comment
                  </p>
                  {selectedQuote ? (
                    <blockquote className="mt-2 rounded-lg border-l-2 border-violet-400 bg-white px-3 py-2 text-xs italic text-slate-600">
                      “{selectedQuote}”
                    </blockquote>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">Select text in the document to attach a highlight.</p>
                  )}
                  <div className="mt-2 flex gap-1">
                    {(["yellow", "green", "pink", "blue"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCommentColor(c)}
                        className={`h-6 w-6 rounded-full ring-2 ring-offset-1 ${
                          COLOR_MAP[c]
                        } ${commentColor === c ? "ring-slate-600" : "ring-transparent"}`}
                        title={c}
                      />
                    ))}
                  </div>
                  <textarea
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    placeholder="Your review comment…"
                    className="mt-2 min-h-[72px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300"
                  />
                  <button
                    type="button"
                    onClick={addComment}
                    className="mt-2 w-full rounded-lg bg-violet-600 py-2 text-xs font-bold text-white hover:bg-violet-500"
                  >
                    Add comment
                  </button>
                </div>

                <div className="space-y-2">
                  {comments.length === 0 ? (
                    <p className="text-xs text-slate-400">No comments yet.</p>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c.id}
                        className={`rounded-xl border border-slate-100 px-3 py-2.5 text-xs ring-1 ring-inset ${COLOR_MAP[c.color]}`}
                      >
                        <p className="font-medium text-slate-800">“{c.quote}”</p>
                        <p className="mt-1 text-slate-700">{c.note}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{new Date(c.createdAt).toLocaleString()}</span>
                          <button type="button" onClick={() => removeComment(c.id)} className="hover:text-rose-600">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}

            {panel === "grade" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Score
                  </label>
                  <div className="mt-2 flex items-end gap-2">
                    <input
                      type="number"
                      min={0}
                      max={maxScore}
                      value={score}
                      onChange={(e) =>
                        setScore(e.target.value === "" ? "" : Math.min(maxScore, Math.max(0, Number(e.target.value))))
                      }
                      className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-2xl font-black tabular-nums outline-none focus:border-violet-400"
                      placeholder="—"
                    />
                    <span className="pb-2 text-sm text-slate-500">/ {maxScore}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={maxScore}
                    value={score === "" ? 0 : score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="mt-3 w-full accent-violet-600"
                  />
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Decision</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(
                      [
                        ["accepted", "Accept"],
                        ["revision", "Request revision"],
                        ["referred", "Refer to integrity"],
                        ["pending", "Pending"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDecision(value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                          decision === value
                            ? "bg-violet-600 text-white ring-violet-600"
                            : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Rubric / feedback
                  </label>
                  <textarea
                    value={rubricNotes}
                    onChange={(e) => setRubricNotes(e.target.value)}
                    placeholder="Overall feedback visible to the student…"
                    className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => void saveGrade()}
                  className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white hover:bg-violet-500"
                >
                  Save grade & decision
                </button>

                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Comments on this paper</span>
                    <span className="font-semibold">{comments.length}</span>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span>Integrity risk</span>
                    <span className="font-semibold">
                      {integrity.aiRiskLabel} ({integrity.aiRiskScore}%)
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
