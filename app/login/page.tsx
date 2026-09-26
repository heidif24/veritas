"use client";

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
      setError(result.error || "Login failed.");
      return;
    }

    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/40">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-xl font-black text-slate-950">V</div>
          <h1 className="mt-4 text-3xl font-black text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your Veritas workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input name="email" type="email" defaultValue="admin@veritas.io" className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input name="password" type="password" defaultValue="admin123" className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0" />
          </div>

          {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}

          <button type="submit" disabled={loading} className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in to Veritas"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Secure access for your institution’s writing and review workflows.
        </div>
      </div>
    </div>
  );
}
