"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasMark } from "@/app/components/veritas-logo";
import { useLocale } from "@/app/components/locale-provider";

type AssignmentKind = "essay" | "timed_essay" | "objective";

type ObjectiveItem = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

export default function NewAssignmentPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [kind, setKind] = useState<AssignmentKind>("essay");
  const [instructions, setInstructions] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [genre, setGenre] = useState("essay");
  const [requireSeal, setRequireSeal] = useState(true);
  const [similarityThreshold, setSimilarityThreshold] = useState(20);
  const [pasteThreshold, setPasteThreshold] = useState(15);
  const [studentEmails, setStudentEmails] = useState("");
  const [rubricText, setRubricText] = useState("Clarity (25%)\nEvidence (25%)\nStructure (25%)\nIntegrity (25%)");
  const [objectives, setObjectives] = useState<ObjectiveItem[]>([
    { prompt: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function addObjective() {
    setObjectives((o) => [...o, { prompt: "", options: ["", "", "", ""], correctIndex: 0 }]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const rubric = { lines: rubricText.split("\n").map((l) => l.trim()).filter(Boolean) };
      const body = {
        courseId: courseId || "default-course",
        title,
        instructions,
        dueAt: dueAt || null,
        maxAttempts,
        genre,
        requireSeal,
        similarityThreshold: similarityThreshold / 100,
        pasteThreshold: pasteThreshold / 100,
        kind,
        timeLimitMinutes: kind === "timed_essay" ? timeLimitMinutes : null,
        objectives: kind === "objective" ? objectives : [],
        rubric,
        studentEmails: studentEmails.split(/[\n,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean),
      };

      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Could not create assignment");
        return;
      }

      if (body.studentEmails.length) {
        await fetch("/api/assignments/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignmentId: data.assignment?.id, emails: body.studentEmails }),
        });
      }

      setMessage("Assignment created and students notified.");
      if (data.assignment?.id) router.push(`/instructor/assignment/${data.assignment.id}`);
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <VeritasMark />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700">{t("faculty.badge")}</p>
              <h1 className="text-lg font-semibold">{t("assignment.title")}</h1>
            </div>
          </div>
          <Link href="/instructor/courses" className="text-xs font-semibold text-slate-600 hover:underline">
            ← {t("faculty.title")}
          </Link>
        </div>
      </header>

      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600 mb-4">{t("assignment.sub")}</p>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("assignment.name")}
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold" placeholder="e.g. Week 6 reflective essay" />
          </label>
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("assignment.course")}
            <input value={courseId} onChange={(e) => setCourseId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Optional — auto-created if empty" />
          </label>
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Instructions
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="mt-2 min-h-[100px] w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Assignment type</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {([["essay", "Open essay"], ["timed_essay", "Timed writing"], ["objective", "Objective / MCQ"]] as const).map(([value, label]) => (
              <button key={value} type="button" onClick={() => setKind(value)} className={`rounded-full px-4 py-2 text-xs font-semibold ring-1 ${kind === value ? "bg-violet-600 text-white ring-violet-600" : "bg-white text-slate-700 ring-slate-200"}`}>
                {label}
              </button>
            ))}
          </div>
          {kind === "timed_essay" ? (
            <label className="mt-4 block text-xs font-semibold text-slate-600">
              Time limit (minutes)
              <input type="number" min={5} max={480} value={timeLimitMinutes} onChange={(e) => setTimeLimitMinutes(Number(e.target.value))} className="mt-1 w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
          ) : null}
          {kind === "objective" ? (
            <div className="mt-6 space-y-6">
              {objectives.map((q, qi) => (
                <div key={qi} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <label className="block text-xs font-semibold text-slate-600">
                    Question {qi + 1}
                    <input value={q.prompt} onChange={(e) => { const next = [...objectives]; next[qi] = { ...next[qi], prompt: e.target.value }; setObjectives(next); }} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
                  </label>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-2 text-xs text-slate-600">
                        <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => { const next = [...objectives]; next[qi] = { ...next[qi], correctIndex: oi }; setObjectives(next); }} />
                        <input value={opt} onChange={(e) => { const next = [...objectives]; const options = [...next[qi].options]; options[oi] = e.target.value; next[qi] = { ...next[qi], options }; setObjectives(next); }} className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm" placeholder={`Option ${oi + 1}`} />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addObjective} className="text-xs font-semibold text-violet-700 hover:underline">+ Add question</button>
            </div>
          ) : null}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Schedule & attempts</p>
            <label className="mt-3 block text-xs font-semibold text-slate-600">{t("assignment.due")}<input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
            <label className="mt-3 block text-xs font-semibold text-slate-600">Max attempts<input type="number" min={1} max={10} value={maxAttempts} onChange={(e) => setMaxAttempts(Number(e.target.value))} className="mt-1 w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
            <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={requireSeal} onChange={(e) => setRequireSeal(e.target.checked)} />{t("assignment.proctored")}</label>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Integrity policy</p>
            <label className="mt-3 block text-xs font-semibold text-slate-600">Genre
              <select value={genre} onChange={(e) => setGenre(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="essay">Essay</option><option value="lab">Lab report</option><option value="reflection">Reflection</option><option value="exam">Exam</option>
              </select>
            </label>
            <label className="mt-3 block text-xs font-semibold text-slate-600">Max similarity %<input type="number" min={0} max={100} value={similarityThreshold} onChange={(e) => setSimilarityThreshold(Number(e.target.value))} className="mt-1 w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
            <label className="mt-3 block text-xs font-semibold text-slate-600">Max paste %<input type="number" min={0} max={100} value={pasteThreshold} onChange={(e) => setPasteThreshold(Number(e.target.value))} className="mt-1 w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rubric</p>
          <textarea value={rubricText} onChange={(e) => setRubricText(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Invite students by email</p>
          <p className="mt-1 text-xs text-slate-500">One per line or comma-separated.</p>
          <textarea value={studentEmails} onChange={(e) => setStudentEmails(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm" placeholder="student1@university.edu" />
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-500 disabled:opacity-60">
            {saving ? "…" : t("assignment.save")}
          </button>
          <Link href="/instructor/courses" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700">
            {t("assignment.cancel")}
          </Link>
          {message ? <span className="text-sm text-slate-600">{message}</span> : null}
        </div>
      </form>
    </div>
  );
}
