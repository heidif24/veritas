"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Tutor = {
  id: string;
  userId: string;
  name: string;
  headline: string;
  bio: string;
  specialties: string[];
  hourlyRateDisplay: string;
  hourlyRateCents: number;
  currency: string;
  videoIntroUrl: string | null;
  calendlyUrl: string | null;
  teamsMeetingUrl: string | null;
  ratingAvg: number;
  totalHours: number;
  capacityHoursWeek: number;
};

type Session = {
  id: string;
  tutorName: string;
  status: string;
  scheduledAt: string | null;
  durationMinutes: number;
  tutorPayoutCents: number;
  platformFeeCents: number;
  currency: string;
  paymentStatus: string;
};

export default function StudentCoachingPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/tutors").then((r) => r.json()),
      fetch("/api/coaching/sessions").then((r) => r.json()),
    ])
      .then(([t, s]) => {
        setTutors(t.tutors ?? []);
        setSessions(s.sessions ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function bookTutor(tutorUserId: string) {
    setBooking(tutorUserId);
    setMessage("");
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
      setMessage(data.error || "Booking failed");
      return;
    }
    setMessage("Session requested. Open the room when you and your tutor are ready.");
    setSessions((prev) => [data.session, ...prev]);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-700">Writing tutor</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Need help with your writing?</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Book a vetted writing tutor for coaching — not ghostwriting. They guide you with side comments
          while you write, on a video/audio call. You keep ownership of every word.
        </p>

        <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">
            Are you struggling with writing? Do you need help or coaching?
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            Tutors cost a fraction of ghostwriting (from ~£18/hr). The platform takes a small cut; the rest goes to your tutor.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional: what are you stuck on? (structure, citations, intro…)"
            className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400"
            rows={2}
          />
        </div>

        {message ? (
          <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{message}</div>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h2 className="text-lg font-bold text-slate-900">Available tutors</h2>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading tutors…</p>
        ) : tutors.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No approved tutors yet. Check back soon.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {tutors.map((t) => (
              <div key={t.userId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{t.name}</h3>
                    <p className="text-sm text-slate-600">{t.headline}</p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                    {t.hourlyRateDisplay}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{t.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.specialties.map((s) => (
                    <span key={s} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
                {t.videoIntroUrl ? (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
                    <iframe
                      title={`Intro ${t.name}`}
                      src={t.videoIntroUrl}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={booking === t.userId}
                    onClick={() => bookTutor(t.userId)}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {booking === t.userId ? "Booking…" : "Book 1 hour"}
                  </button>
                  {t.calendlyUrl ? (
                    <a
                      href={t.calendlyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Calendly
                    </a>
                  ) : null}
                  {t.teamsMeetingUrl ? (
                    <a
                      href={t.teamsMeetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Teams link
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-lg font-bold text-slate-900">Your coaching sessions</h2>
        {sessions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No sessions yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">{s.tutorName}</p>
                  <p className="text-xs text-slate-500">
                    {s.status} · {s.durationMinutes} min · fee {(s.platformFeeCents / 100).toFixed(0)} {s.currency} platform · payout {(s.tutorPayoutCents / 100).toFixed(0)} {s.currency} to tutor
                  </p>
                </div>
                <Link
                  href={`/student/coaching/session/${s.id}`}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                >
                  Open room
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/student" className="mt-6 inline-block text-sm font-semibold text-cyan-700 hover:text-cyan-800">
          ← Back to student home
        </Link>
      </section>
    </main>
  );
}
