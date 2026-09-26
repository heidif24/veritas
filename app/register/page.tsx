"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      setError("Full name, email, and password are required.");
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
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">Register</p>
          <h1 className="mt-2 text-3xl font-black text-white">Create your account</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">For universities</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Register your institution</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Set up a university or campus account for faculty, review workflows, and submission administration.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">Faculty onboarding</div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">Submission oversight</div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">Institution-wide review controls</div>
            </div>

            <Link href="/onboarding" className="mt-8 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
              Continue as university
            </Link>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-violet-950/20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-violet-200">For journals and publishers</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Verify certificates and submitted work</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Create a journal or publisher account to validate submissions, review provenance links, and approve certificate-backed work.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">Certificate verification</div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">Submission review queue</div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">Trusted publication approval</div>
            </div>

            <Link href="/onboarding" className="mt-8 inline-flex rounded-full bg-violet-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-400">Continue as journal</Link>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-violet-950/20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-violet-200">For individuals</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Use your email to register</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Create a personal account to submit work, review outcomes, and receive confirmation quickly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Full name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  minLength={8}
                  required
                  placeholder="Create a secure password"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                />
              </div>

              {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}

              <button type="submit" disabled={loading} className="w-full rounded-full bg-violet-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-400 disabled:opacity-60">
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {submitted ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Account created for <span className="font-semibold">{email}</span>. Redirecting to login...
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
