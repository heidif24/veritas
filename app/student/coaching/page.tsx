"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleShell, STUDENT_NAV } from "@/app/components/role-shell";

type Tutor = {
  id: string;
  userId: string;
  name: string;
  headline: string;
  bio: string;
  specialties: string[];
  hourlyRateDisplay: string;
  videoIntroUrl: string | null;
  calendlyUrl: string | null;
  teamsMeetingUrl: string | null;
};

type Session = {
  id: string;
  tutorName: string;
  status: string;
  durationMinutes: number;
  tutorPayoutCents: number;
  platformFeeCents: number;
  currency: string;
};

export default function StudentCoachingPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/tutors").then((r) => r.json()),
      fetch("/api/coaching/sessions").then((r) => r.json()),
    ])
      .then(([t, s]) => {
        setTutors(t.tutors ?? []);
        setSessions(s.sessions ?? []);
      })
      .catch(() => setError("Could not load tutors. Try again."))
      .finally(() => setLoading(false));
  }, []);

  async function bookTutor(tutorUserId: string) {
    setBooking(tutorUserId);
    setMessage("");
    setError("");
    const res = await fetch("/api/coaching/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorId: tutorUserId,
        assignmentTitle: "Writing coaching session",
        durationMinutes: 60,
        studentNotes: notes || "Need help structuring my draft.",
      }),
    });
    const data = await res.json();
    setBooking(null);
    if (!res.ok) {
      setError(data.error || "Booking failed");
      return;
    }
    setMessage("Session requested. Open the room when you and your tutor are ready.");
    setSessions((prev) => [data.session, ...prev]);
  }

  return (
    <RoleShell roleLabel="Student" title="Writing tutor" nav={STUDENT_NAV}>
      <p className="mb-6 max-w-2xl text-[var(--muted)]">
        Book a vetted writing tutor for coaching — not ghostwriting. They guide with side comments while you write, on video or audio.
      </p>

      <div className="mb-8 rounded-2xl border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] p-5">
        <h2 className="font-display text-xl text-[var(--ink)]">Are you struggling with writing?</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          From ~£18/hr. Platform takes a small cut; the rest goes to your tutor when the session ends.
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional: what are you stuck on? (structure, citations, intro…)"
          className="v-input mt-3"
          rows={2}
        />
      </div>

      {message ? (
        <div className="mb-4 rounded-xl border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] px-4 py-3 text-sm text-[var(--emerald-dark)]">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <h2 className="font-display text-xl text-[var(--ink)]">Available tutors</h2>
      {loading ? (
        <div className="v-empty mt-4">Loading tutors…</div>
      ) : tutors.length === 0 ? (
        <div className="v-empty mt-4">No approved tutors yet. Check back soon.</div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {tutors.map((t) => (
            <article key={t.userId} className="v-card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl text-[var(--ink)]">{t.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{t.headline}</p>
                </div>
                <span className="v-badge v-badge-gold shrink-0">{t.hourlyRateDisplay}</span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">{t.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.specialties.map((s) => (
                  <span key={s} className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-2.5 py-0.5 text-xs text-[var(--ink)]">
                    {s}
                  </span>
                ))}
              </div>
              {t.videoIntroUrl ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-[var(--line)]">
                  <iframe title={`Intro ${t.name}`} src={t.videoIntroUrl} className="aspect-video w-full" allowFullScreen />
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={booking === t.userId}
                  onClick={() => bookTutor(t.userId)}
                  className="v-btn v-btn-primary disabled:opacity-60"
                >
                  {booking === t.userId ? "Booking…" : "Book 1 hour"}
                </button>
                {t.calendlyUrl ? (
                  <a href={t.calendlyUrl} target="_blank" rel="noreferrer" className="v-btn v-btn-secondary">
                    Calendly
                  </a>
                ) : null}
                {t.teamsMeetingUrl ? (
                  <a href={t.teamsMeetingUrl} target="_blank" rel="noreferrer" className="v-btn v-btn-secondary">
                    Teams
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-display text-xl text-[var(--ink)]">Your sessions</h2>
      {sessions.length === 0 ? (
        <div className="v-empty mt-4">No sessions yet.</div>
      ) : (
        <div className="mt-4 overflow-x-auto v-card">
          <table className="v-table">
            <thead>
              <tr>
                <th>Tutor</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Fees</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.tutorName}</td>
                  <td>
                    <span className="v-badge v-badge-emerald">{s.status}</span>
                  </td>
                  <td>{s.durationMinutes} min</td>
                  <td className="text-[var(--muted)]">
                    Platform {(s.platformFeeCents / 100).toFixed(0)} {s.currency} · Tutor {(s.tutorPayoutCents / 100).toFixed(0)}{" "}
                    {s.currency}
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
