"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
      setError(result.error || "Sign-in failed. Check your email and password.");
      return;
    }

    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-lg font-black text-white">
            V
          </div>
          <h1 className="mt-5 text-2xl font-black text-slate-900">Sign in to Veritas</h1>
          <p className="mt-2 text-sm text-slate-600">Access your workspace and documents</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="you@institution.edu"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="Your password"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to Veritas?{" "}
          <Link href="/register" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
