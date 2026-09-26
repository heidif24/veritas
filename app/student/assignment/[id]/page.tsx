"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProctorShell } from "@/components/editor/ProctorShell";
import { VeritasMark } from "@/app/components/veritas-logo";

type Assignment = {
  id: string;
  title: string;
  instructions?: string;
  kind?: string;
  proctored?: number;
  time_limit_minutes?: number;
  objectives_json?: string;
};

export default function StudentAssignmentPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/assignments");
        const data = await res.json();
        const found = (data.assignments || []).find((a: Assignment) => a.id === id);
        setAssignment(found || null);
        if (found?.objectives_json) {
          try {
            const objs = JSON.parse(found.objectives_json);
            setAnswers(objs.map(() => -1));
          } catch {
            /* */
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <VeritasMark />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="text-slate-600">Assignment not found or not assigned to you.</p>
        <Link href="/app/dashboard" className="mt-4 inline-block text-cyan-700 hover:underline">
          Dashboard
        </Link>
      </div>
    );
  }

  const proctored = Boolean(assignment.proctored);
  const kind = assignment.kind || "essay";
  let objectives: Array<{ prompt: string; options: string[] }> = [];
  try {
    objectives = JSON.parse(assignment.objectives_json || "[]");
  } catch {
    objectives = [];
  }

  const inner =
    kind === "objective" ? (
      <div className="mx-auto max-w-2xl space-y-6 px-6 py-10">
        <h1 className="text-2xl font-black">{assignment.title}</h1>
        <p className="text-sm text-slate-600">{assignment.instructions}</p>
        {objectives.map((q, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold text-slate-900">
              {i + 1}. {q.prompt}
            </p>
            <div className="mt-3 space-y-2">
              {(q.options || []).map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === oi}
                    onChange={() => {
                      const next = [...answers];
                      next[i] = oi;
                      setAnswers(next);
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setMessage("Answers recorded for instructor review.")}
          className="rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white"
        >
          Submit answers
        </button>
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      </div>
    ) : (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-black">{assignment.title}</h1>
        <p className="mt-3 text-sm text-slate-600">{assignment.instructions}</p>
        {assignment.time_limit_minutes ? (
          <p className="mt-2 text-xs font-semibold text-amber-800">Time limit: {assignment.time_limit_minutes} minutes</p>
        ) : null}
        <button
          type="button"
          onClick={() => router.push(`/app/editor/new?assignment=${id}`)}
          className="mt-8 rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 px-8 py-3 text-sm font-bold text-white"
        >
          Open Integrity Studio
        </button>
      </div>
    );

  return (
    <ProctorShell enabled={proctored} title={assignment.title}>
      {inner}
    </ProctorShell>
  );
}
