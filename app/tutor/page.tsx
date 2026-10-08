"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleShell, TUTOR_NAV } from "@/app/components/role-shell";

type Session = {
  id: string;
  studentName: string;
  status: string;
  durationMinutes: number;
  tutorPayoutCents: number;
  currency: string;
  paymentStatus: string;
};

export default function TutorDashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/coaching/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []))
      .catch(() => setError("Could not load sessions."))
      .finally(() => setLoading(false));
  }, []);

  const earned = sessions
    .filter((s) => s.paymentStatus === "paid")
    .reduce((sum, s) => sum + s.tutorPayoutCents, 0);

  return (
    <RoleShell
      roleLabel="Writing tutor"
      title="Tutor dashboard"
      nav={TUTOR_NAV}
      actions={
        <Link href="/tutor/onboarding" className="v-btn v-btn-secondary">
          Edit profile
        </Link>
      }
    >
      <p className="mb-6 max-w-2xl text-[var(--muted)]">
        Guide students with side comments and video — never write the assignment for them.
      </p>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="v-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Sessions</p>
          <p className="mt-1 font-display text-3xl text-[var(--ink)]">{sessions.length}</p>
        </div>
        <div className="v-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Paid out</p>
          <p className="mt-1 font-display text-3xl text-[var(--ink)]">£{(earned / 100).toFixed(0)}</p>
        </div>
        <div className="v-card border-[var(--emerald)]/20 bg-[var(--emerald-soft)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--emerald-dark)]">Profile</p>
          <Link href="/tutor/onboarding" className="mt-2 inline-block text-sm font-semibold text-[var(--emerald)]">
            Update capacity & rates →
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">{error}</div>
      ) : null}

      <h2 className="font-display text-xl text-[var(--ink)]">Your sessions</h2>
      {loading ? (
        <div className="v-empty mt-4">Loading…</div>
      ) : sessions.length === 0 ? (
        <div className="v-empty mt-4">
          No bookings yet. Complete your profile so students can find you.
          <div className="mt-3">
            <Link href="/tutor/onboarding" className="v-btn v-btn-primary">
              Complete profile
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto v-card">
          <table className="v-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Payout</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.studentName}</td>
                  <td>
                    <span className="v-badge v-badge-emerald">{s.status}</span>
                    {s.paymentStatus === "paid" ? (
                      <span className="v-badge v-badge-gold ml-1">paid</span>
                    ) : null}
                  </td>
                  <td>{s.durationMinutes} min</td>
                  <td>
                    {(s.tutorPayoutCents / 100).toFixed(0)} {s.currency}
                  </td>
                  <td>
                    <Link href={`/student/coaching/session/${s.id}`} className="v-btn v-btn-primary !py-1.5 !px-3 text-xs">
                      Open room
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RoleShell>
  );
}
