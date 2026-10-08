"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Session = {
  id: string;
  studentName: string;
  status: string;
  durationMinutes: number;
  tutorPayoutCents: number;
  currency: string;
  paymentStatus: string;
  scheduledAt: string | null;
};

export default function TutorDashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coaching/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []))
      .finally(() => setLoading(false));
  }, []);

  const earned = sessions
    .filter((s) => s.paymentStatus === "paid")
    .reduce((sum, s) => sum + s.tutorPayoutCents, 0);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-violet-700">Writing tutor</p>
        <h1 className="mt-2 text-3xl font-black">Tutor dashboard</h1>
        <p className="mt-2 text-slate-600">
          Guide students with side comments and video — never write the assignment for them.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-xs uppercase text-slate-500">Sessions</p>
            <p className="mt-1 text-2xl font-black">{sessions.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-xs uppercase text-slate-500">Paid out</p>
            <p className="mt-1 text-2xl font-black">£{(earned / 100).toFixed(0)}</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <p className="text-xs uppercase text-violet-700">Profile</p>
            <Link href="/tutor/onboarding" className="mt-2 inline-block text-sm font-bold text-violet-800">
              Edit profile →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-lg font-bold">Your sessions</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading…</p>
        ) : sessions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No bookings yet. Complete your profile so students can find you.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="font-semibold">{s.studentName}</p>
                  <p className="text-xs text-slate-500">
                    {s.status} · {s.durationMinutes} min · earn {(s.tutorPayoutCents / 100).toFixed(0)} {s.currency}
                    {s.paymentStatus === "paid" ? " · paid" : ""}
                  </p>
                </div>
                <Link
                  href={`/student/coaching/session/${s.id}`}
                  className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Open room
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
