"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasLogo } from "@/app/components/veritas-logo";
import { useLocale } from "@/app/components/locale-provider";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

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

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <VeritasLogo href={undefined} size="lg" showWordmark={false} />
          <h1 className="mt-4 text-2xl font-black text-slate-900">{t("login.title")}</h1>
          <p className="mt-1.5 text-sm text-slate-600">{t("login.sub")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("login.email")}</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
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
