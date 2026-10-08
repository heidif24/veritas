"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasLogo } from "@/app/components/veritas-logo";
import { useLocale } from "@/app/components/locale-provider";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@veritas.io", password: "admin123" },
  { role: "Instructor", email: "instructor@veritas.io", password: "instructor123" },
  { role: "Student", email: "student@veritas.io", password: "student123" },
  { role: "Writing tutor", email: "tutor@veritas.io", password: "tutor123" },
];

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || t("login.error"));
      return;
    }

    const role = result.user?.role ?? "STUDENT";
    if (role === "TUTOR") router.push("/tutor");
    else if (role === "ADMIN") router.push("/admin");
    else if (role === "INSTRUCTOR") router.push("/instructor");
    else router.push("/student");
    router.refresh();
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <VeritasLogo href={undefined} size="lg" showWordmark={false} />
          <h1 className="mt-4 font-display text-3xl text-[var(--ink)]">{t("login.title")}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{t("login.sub")}</p>
        </div>

        <div className="mb-5 rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold-soft)] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#7a6220]">Demo accounts — click to fill</p>
          <div className="mt-2 space-y-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(acc.password);
                  setError("");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-left text-sm transition hover:border-[var(--gold)]"
              >
                <span className="font-semibold text-[var(--ink)]">{acc.role}</span>
                <span className="font-mono text-xs text-[var(--muted)]">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="v-card space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">{t("login.email")}</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="v-input"
              placeholder="you@institution.edu"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">{t("login.password")}</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="v-input"
              placeholder="••••••••"
            />
          </div>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">{error}</div>
          ) : null}
          <button type="submit" disabled={loading} className="v-btn v-btn-primary w-full disabled:opacity-60">
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          {t("login.new")}{" "}
          <Link href="/register" className="font-semibold text-[var(--emerald)] hover:underline">
            {t("login.create")}
          </Link>
          {" · "}
          <Link href="/tutor/onboarding" className="font-semibold text-[var(--ink)] hover:underline">
            Become a writing tutor
          </Link>
        </p>
      </div>
    </main>
  );
}
