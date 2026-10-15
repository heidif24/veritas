"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasLogo } from "@/app/components/veritas-logo";
import { useLocale } from "@/app/components/locale-provider";

/** Workspace quick access — fills credentials and signs in. No demo branding on the public surface. */
const ROLE_ACCOUNTS = [
  { role: "Admin", email: "admin@veritas.io", password: "admin123" },
  { role: "Lecturer", email: "instructor@veritas.io", password: "instructor123" },
  { role: "Student", email: "student@veritas.io", password: "student123" },
  { role: "Publisher", email: "publisher@veritas.io", password: "publisher123" },
  { role: "Writing tutor", email: "tutor@veritas.io", password: "tutor123" },
];

function workspaceForRole(role: string) {
  if (role === "TUTOR") return "/tutor";
  if (role === "ADMIN") return "/admin";
  if (role === "INSTRUCTOR") return "/instructor";
  if (role === "PUBLISHER") return "/publisher";
  return "/student";
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn(nextEmail: string, nextPassword: string) {
    setLoading(true);
    setError("");
    setEmail(nextEmail);
    setPassword(nextPassword);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail, password: nextPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || t("login.error"));
        setLoading(false);
        return;
      }

      const role = result.user?.role ?? "STUDENT";
      router.push(workspaceForRole(role));
      router.refresh();
    } catch {
      setError(t("login.error"));
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signIn(email, password);
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <VeritasLogo href={undefined} size="lg" showWordmark={false} />
          <h1 className="mt-4 font-display text-3xl text-[var(--ink)]">{t("login.title")}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{t("login.sub")}</p>
        </div>

        <div className="mb-5 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Sign in by role
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Choose a workspace to continue.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ROLE_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={loading}
                onClick={() => void signIn(acc.email, acc.password)}
                className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-left text-sm transition hover:border-[var(--emerald)] hover:bg-white disabled:opacity-60"
              >
                <span className="block font-semibold text-[var(--ink)]">{acc.role}</span>
                <span className="mt-0.5 block text-[11px] text-[var(--muted)]">Open workspace</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="v-card space-y-4 p-6">
          <p className="text-xs font-medium text-[var(--muted)]">Or sign in with your institutional email</p>
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
