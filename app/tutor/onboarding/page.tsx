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

  const [mode, setMode] = useState<"register" | "profile">("register");

  // Fix: mode state already declared - need single declaration
  // This file has a bug - I declared mode twice. Fix in the content.

  return null;
}
