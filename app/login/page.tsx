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

    const payload = { email, password };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || t("login.error"));
      return;
    }

    router.push("/app/dashboard");
    router.refresh();
  }

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[0]) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <VeritasLogo href={undefined} size="lg" showWordmark={false} />
          <h1 className="mt-4 text-2xl font-black text-slate-900">{t("login.title")}</h1>
          <p className="mt-1.5 text-sm text-slate-600">{t("login.sub")}</p>
        </div>

        {/* DEMO credentials panel — clear for meeting demos */}
        <div className="mb-4 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Demo accounts — click to fill
            </span>
          </div>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc)}
                className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2 text-left text-sm transition hover:border-amber-400 hover:bg-amber-50"
              >
                <span className="font-semibold text-slate-800">{acc.role}</span>
                <span className="font-mono text-xs text-slate-600">{acc.email}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] text-amber-700">
            Passwords: admin123 · instructor123 · student123
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("login.email")}</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="you@institution.edu"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("login.password")}</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          {t("login.new")}{" "}
          <Link href="/register" className="font-semibold text-cyan-700 hover:text-cyan-800">
            {t("login.create")}
          </Link>
        </p>
      </div>
    </main>
  );
}
