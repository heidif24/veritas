"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function TutorOnboardingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"register" | "profile">("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const specialties = String(fd.get("specialties") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await fetch("/api/tutors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        password: String(fd.get("password") ?? ""),
        headline: String(fd.get("headline") ?? ""),
        bio: String(fd.get("bio") ?? ""),
        specialties,
        hourlyRateCents: Math.round(Number(fd.get("hourlyRate") ?? 18) * 100),
        currency: "GBP",
        videoIntroUrl: String(fd.get("videoIntroUrl") ?? "") || null,
        calendlyUrl: String(fd.get("calendlyUrl") ?? "") || null,
        teamsMeetingUrl: String(fd.get("teamsMeetingUrl") ?? "") || null,
        capacityHoursWeek: Number(fd.get("capacity") ?? 10),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not create tutor account");
      return;
    }
    setOk("Tutor account created. Profile pending vetting. Sign in with your email.");
    setTimeout(() => router.push("/login"), 1500);
  }

  async function handleProfileUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const specialties = String(fd.get("specialties") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await fetch("/api/tutors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline: String(fd.get("headline") ?? ""),
        bio: String(fd.get("bio") ?? ""),
        specialties,
        hourlyRateCents: Math.round(Number(fd.get("hourlyRate") ?? 18) * 100),
        videoIntroUrl: String(fd.get("videoIntroUrl") ?? "") || null,
        calendlyUrl: String(fd.get("calendlyUrl") ?? "") || null,
        teamsMeetingUrl: String(fd.get("teamsMeetingUrl") ?? "") || null,
        capacityHoursWeek: Number(fd.get("capacity") ?? 10),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Update failed — are you signed in?");
      return;
    }
    setOk("Profile saved.");
    setTimeout(() => router.push("/tutor"), 800);
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-4 py-12 text-[var(--ink)]">
      <div className="mx-auto max-w-lg">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">Become a writing tutor</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">Tutor onboarding</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Profiles go through vetting before students can book you. You coach; students write.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`v-btn ${mode === "register" ? "v-btn-primary" : "v-btn-secondary"}`}
          >
            New account
          </button>
          <button
            type="button"
            onClick={() => setMode("profile")}
            className={`v-btn ${mode === "profile" ? "v-btn-primary" : "v-btn-secondary"}`}
          >
            Update profile (signed in)
          </button>
        </div>

        <form onSubmit={mode === "register" ? handleRegister : handleProfileUpdate} className="v-card mt-6 space-y-4 p-6">
          {mode === "register" ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">Full name</label>
                <input name="name" required className="v-input" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input name="email" type="email" required className="v-input" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input name="password" type="password" minLength={8} required className="v-input" />
              </div>
            </>
          ) : null}
          <div>
            <label className="mb-1 block text-sm font-medium">Headline</label>
            <input name="headline" placeholder="Academic writing coach · humanities" className="v-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea name="bio" rows={3} placeholder="How you guide students" className="v-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Specialties (comma-separated)</label>
            <input name="specialties" defaultValue="Essay structure, Citations, Revision" className="v-input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Hourly rate (£)</label>
              <input name="hourlyRate" type="number" min={10} defaultValue={18} className="v-input" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Hours / week</label>
              <input name="capacity" type="number" min={1} defaultValue={10} className="v-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Video intro URL (YouTube embed)</label>
            <input name="videoIntroUrl" placeholder="https://www.youtube.com/embed/..." className="v-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Calendly URL</label>
            <input name="calendlyUrl" placeholder="https://calendly.com/you" className="v-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Microsoft Teams URL</label>
            <input name="teamsMeetingUrl" placeholder="https://teams.microsoft.com/..." className="v-input" />
          </div>
          {error ? <div className="rounded-lg border border-red-200 bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">{error}</div> : null}
          {ok ? <div className="rounded-lg border border-emerald-200 bg-[var(--emerald-soft)] px-3 py-2 text-sm text-[var(--emerald-dark)]">{ok}</div> : null}
          <button type="submit" disabled={loading} className="v-btn v-btn-primary w-full disabled:opacity-60">
            {loading ? "Saving…" : mode === "register" ? "Create tutor account" : "Save profile"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          <Link href="/login" className="font-semibold text-[var(--emerald)]">Sign in</Link>
          {" · "}
          <Link href="/tutor" className="font-semibold text-[var(--emerald)]">Tutor dashboard</Link>
        </p>
      </div>
    </main>
  );
}
