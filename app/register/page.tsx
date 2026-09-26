"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      role: "STUDENT",
    };

    if (!payload.name || !payload.email || !payload.password) {
      setError("Name, email, and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Registration failed.");
      return;
    }

    setSubmitted(true);
    setEmail(payload.email);
    setTimeout(() => router.push("/login"), 1200);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-14 text-slate-900 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center md:text-left">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Get started</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Create your Veritas account</h1>
          <p className="mt-3 max-w-xl text-slate-600">
            For individuals, institutions, and publishers who need trusted writing and verification.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">Institutions</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Register your campus</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Faculty onboarding, review workflows, and institutional policy in one place.
            </p>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Institution setup
            </Link>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">Publishers</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Verify submissions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Check provenance and sealed packages before you accept work for publication.
            </p>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              Publisher setup
            </Link>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Individuals</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Personal account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Draft, seal, and share verified work with a personal login.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  minLength={8}
                  required
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
              ) : null}
              {submitted ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  Account created for {email}. Redirecting to sign in...
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
