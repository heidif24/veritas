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

type TimelineItem = {
  label: string;
  detail: string;
  severity: string;
};

const COLOR_MAP = {
  yellow: "bg-amber-200/80 ring-amber-400",
  green: "bg-emerald-200/80 ring-emerald-400",
  pink: "bg-pink-200/80 ring-pink-400",
  blue: "bg-sky-200/80 ring-sky-400",
};

function asHtml(content: string) {
  if (!content) return "<p></p>";
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  return content
    .split(/\n+/)
    .map((p) => `<p>${p.replace(/</g, "<").replace(/>/g, ">")}</p>`)
    .join("");
}

export default function FacultyReviewStudio() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("Submission");
  const [studentName, setStudentName] = useState("Student");
  const [html, setHtml] = useState("<p></p>");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [selectedQuote, setSelectedQuote] = useState("");
  const [commentColor, setCommentColor] = useState<Comment["color"]>("yellow");
  const [score, setScore] = useState<number | "">("");
  const [maxScore, setMaxScore] = useState(100);
  const [rubricNotes, setRubricNotes] = useState("");
  const [decision, setDecision] = useState<"pending" | "accepted" | "revision" | "referred" | "revision_requested">(
    "pending",
  );
  const [message, setMessage] = useState("");
  const [panel, setPanel] = useState<"integrity" | "comments" | "grade">("integrity");
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const docRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [docRes, reportRes, caseRes] = await Promise.all([
          fetch(`/api/documents/${encodeURIComponent(id)}`),
          fetch(`/api/reports/${encodeURIComponent(id)}`),
          fetch(`/api/cases?documentId=${encodeURIComponent(id)}`),
        ]);

        if (docRes.ok) {
          const docData = await docRes.json();
          const doc = docData.document ?? docData;
          if (!cancelled) {
            setTitle(String(doc.title || "Submission"));
            setHtml(asHtml(String(doc.content || "")));
            setStudentName(String(doc.owner?.name || doc.ownerName || "Student"));
          }
        }

        if (reportRes.ok) {
          const repData = await reportRes.json();
          const r = repData.report ?? repData;
          if (!cancelled) {
            setReport(r);
            if (r.title) setTitle(String(r.title));
          }
        }

        if (caseRes.ok) {
          const caseData = await caseRes.json();
          const c = caseData.case;
          if (c && !cancelled) {
            if (c.score != null) setScore(Number(c.score));
            if (c.max_score != null) setMaxScore(Number(c.max_score));
            if (c.notes) setRubricNotes(String(c.notes));
            if (c.decision) setDecision(c.decision);
            try {
              const parsed = JSON.parse(c.comments_json || "[]");
              if (Array.isArray(parsed)) setComments(parsed);
            } catch {
              /* ignore */
            }
          }
        }

        if (!docRes.ok && !reportRes.ok) {
          if (!cancelled) setError("Could not load this submission. Check that the document id is valid.");
        }
      } catch {
        if (!cancelled) setError("Failed to load review data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const integrity = useMemo(() => {
    const composition = (report?.composition || {}) as Record<string, unknown>;
    const summary = (report?.summary || {}) as Record<string, unknown>;
    const similarity = (report?.similarity || {}) as Record<string, unknown>;
    const continuity = (report?.continuity || {}) as Record<string, unknown>;
    const pasteOrigin = (report?.pasteOrigin || {}) as Record<string, unknown>;
    const session = (report?.session || {}) as Record<string, unknown>;
    const plain = String(html).replace(/<[^>]+>/g, " ").trim();
    const words = plain ? plain.split(/\s+/).length : 0;

    const organicRatio =
      typeof composition.organicRatio === "number"
        ? composition.organicRatio
        : typeof composition.organic === "number"
          ? composition.organic
          : 0.9;
    const pastedRatio =
      typeof composition.pastedRatio === "number"
        ? composition.pastedRatio
        : typeof composition.pasteRatio === "number"
          ? composition.pasteRatio
          : 0.05;
    const aiRiskScore =
      typeof composition.aiRiskScore === "number"
        ? composition.aiRiskScore
        : typeof summary.sessionRisk === "number"
          ? summary.sessionRisk
          : 15;

    return {
      overall: String(summary.overall || summary.headline || "Review"),
      headline: String(summary.headline || ""),
      organicRatio,
      pastedRatio,
      aiRiskScore,
      aiRiskLabel: String(composition.aiRiskLabel || (aiRiskScore < 25 ? "Low" : aiRiskScore < 50 ? "Moderate" : "High")),
      focusLosses: Number(composition.focusLosses ?? session.focusLosses ?? 0),
      wordCount: words,
      sealStatus: summary.sealed ? "Sealed" : "Not sealed",
      sealedHash: summary.sealedHash ? String(summary.sealedHash) : "",
      similarity: Number(similarity.score ?? 0),
      similarityThreshold: Number(similarity.threshold ?? 20),
      externalBulkPastes: Number(pasteOrigin.externalBulkEvents ?? 0),
      continuity: String(continuity.label || continuity.notes?.[0] || "—"),
      sessionStructure: String(session.structuralLabel || session.notes?.[0] || "—"),
      timeline: (Array.isArray(report?.timeline) ? report?.timeline : []) as TimelineItem[],
      plainLanguageWhy: Array.isArray(report?.plainLanguageWhy) ? (report?.plainLanguageWhy as string[]) : [],
      factors: Array.isArray(report?.factors) ? (report?.factors as Array<{ label?: string; detail?: string }>) : [],
    };
  }, [report, html]);

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
    setMessage("Comment added — save grade to persist");
    setTimeout(() => setMessage(""), 2500);
  }

  function removeComment(cid: string) {
    setComments((prev) => prev.filter((c) => c.id !== cid));
  }

  async function saveGrade() {
    setMessage("Saving…");
    try {
      const res = await fetch(`/api/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: id,
          decision: decision === "revision" ? "revision_requested" : decision,
          notes: rubricNotes,
          score: score === "" ? null : Number(score),
          maxScore,
          comments,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMessage(data.error || "Could not save");
      else setMessage("Grade, comments & decision saved");
    } catch {
      setMessage("Save failed — check connection");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  function downloadSubmissionPackage() {
    const payload = {
      documentId: id,
      title,
      studentName,
      score: score === "" ? null : Number(score),
      maxScore,
      decision,
      comments,
      rubricNotes,
      integrity,
      report,
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
            {studentName} · {id.slice(0, 12)}
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
          <Link href="/instructor" className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
            Dashboard
          </Link>
        </div>
      </header>

      {error ? (
        <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">{error}</div>
      ) : null}

      <div className="flex min-h-0 flex-1 overflow-hidden">
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
                {integrity.sealStatus}
                {integrity.sealedHash ? ` · ${integrity.sealedHash.slice(0, 12)}…` : ""}
              </div>
            </div>
          </div>
        </div>

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
                  <div className="mt-1 text-xl font-black capitalize text-slate-900">{integrity.overall}</div>
                  {integrity.headline ? (
                    <p className="mt-1 text-xs leading-5 text-slate-600">{integrity.headline}</p>
                  ) : null}
                  <div className="mt-2 text-xs text-slate-600">
                    Risk {integrity.aiRiskLabel} ({integrity.aiRiskScore}%) · {integrity.sealStatus}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ["Organic drafting", `${Math.round(integrity.organicRatio * 100)}%`],
                    ["Direct pastes", `${Math.round(integrity.pastedRatio * 100)}%`],
                    ["Similarity", `${integrity.similarity}% / ${integrity.similarityThreshold}%`],
                    ["Focus losses", String(integrity.focusLosses)],
                    ["External bulk", String(integrity.externalBulkPastes)],
                    ["Continuity", integrity.continuity],
                    ["Session", integrity.sessionStructure],
                    ["Words", String(integrity.wordCount)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
                      <div className="mt-0.5 font-semibold capitalize text-slate-900">{value}</div>
                    </div>
                  ))}
                </div>

                {integrity.timeline.length > 0 ? (
                  <div>
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Evidence timeline
                    </div>
                    <ul className="space-y-2">
                      {integrity.timeline.map((ev, i) => (
                        <li
                          key={i}
                          className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-slate-800">{ev.label}</span>
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                ev.severity === "critical"
                                  ? "bg-rose-100 text-rose-800"
                                  : ev.severity === "warn"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {ev.severity}
                            </span>
                          </div>
                          <p className="mt-1 text-slate-600">{ev.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {integrity.plainLanguageWhy.length > 0 ? (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <div className="mb-1 font-semibold text-slate-800">Why this assessment</div>
                    <ul className="list-disc space-y-1 pl-4">
                      {integrity.plainLanguageWhy.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <p className="text-[11px] leading-5 text-slate-500">
                  Process evidence supports fair review. Veritas does not auto-issue misconduct findings — the lecturer
                  decides with full context.
                </p>
              </div>
            ) : null}

            {panel === "comments" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">New comment</p>
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
                        className={`h-6 w-6 rounded-full ring-2 ring-offset-1 ${COLOR_MAP[c]} ${
                          commentColor === c ? "ring-slate-600" : "ring-transparent"
                        }`}
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Score</label>
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
                        ["revision_requested", "Request revision"],
                        ["referred", "Refer to integrity"],
                        ["pending", "Pending"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDecision(value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                          decision === value || (decision === "revision" && value === "revision_requested")
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
                    placeholder="Overall feedback visible in the case record…"
                    className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => void saveGrade()}
                  className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white hover:bg-violet-500"
                >
                  Save grade, comments & decision
                </button>

                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Comments</span>
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
