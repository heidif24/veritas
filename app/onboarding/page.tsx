"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function InstitutionOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      slug: String(formData.get("slug") ?? "").trim(),
      sector: String(formData.get("sector") ?? "Education").trim(),
      adminName: String(formData.get("adminName") ?? "").trim(),
      adminEmail: String(formData.get("adminEmail") ?? "").trim(),
      adminPassword: String(formData.get("adminPassword") ?? ""),
    };

    const response = await fetch("/api/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Institution onboarding failed.");
      return;
    }

    setSuccess("Institution successfully registered. Redirecting to the admin console...");
    window.setTimeout(() => router.push("/admin/tenant"), 700);
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">Onboarding</p>
          <h1 className="mt-2 text-3xl font-black text-white">Register a new institution</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[30px] border border-cyan-500/20 bg-cyan-500/5 p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">Operating plan</p>
            <div className="mt-5 space-y-4">
              {[
                ["01", "Complete institutional profile", "Campus, domain, and governance context"],
                ["02", "Provision identity and admin roles", "Initial admin account and SSO settings"],
                ["03", "Activate review workflows", "Departments, policies, and verification rules"],
                ["04", "Launch with confidence", "Live review lifecycle and audit readiness"],
              ].map(([step, title, detail]) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">{step}</span>
                    <span className="text-sm font-semibold text-white">{title}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{detail}</p>
                </div>
              ))}
            </div>
          </aside>

          <main className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">Institution name</label>
                  <input id="name" name="name" required className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400" placeholder="Northbridge University" />
                </div>

                <div>
                  <label htmlFor="slug" className="mb-2 block text-sm font-medium text-slate-300">Institution slug</label>
                  <input id="slug" name="slug" required className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400" placeholder="northbridge" />
                </div>

                <div>
                  <label htmlFor="sector" className="mb-2 block text-sm font-medium text-slate-300">Sector</label>
                  <select id="sector" name="sector" defaultValue="Education" className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
                    <option>Education</option>
                    <option>Healthcare</option>
                    <option>Government</option>
                    <option>Research</option>
                    <option>Publishing</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="organizationType" className="mb-2 block text-sm font-medium text-slate-300">Institution type</label>
                  <select id="organizationType" name="organizationType" defaultValue="UNIVERSITY" className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
                    <option value="UNIVERSITY">University / Campus</option>
                    <option value="PUBLISHER">Journal / Publisher</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="adminName" className="mb-2 block text-sm font-medium text-slate-300">Primary admin</label>
                  <input id="adminName" name="adminName" required className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400" placeholder="Alicia Morgan" />
                </div>

                <div>
                  <label htmlFor="adminEmail" className="mb-2 block text-sm font-medium text-slate-300">Admin email</label>
                  <input id="adminEmail" name="adminEmail" type="email" required className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400" placeholder="admin@northbridge.edu" />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="adminPassword" className="mb-2 block text-sm font-medium text-slate-300">Initial admin password</label>
                  <input id="adminPassword" name="adminPassword" type="password" required className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400" placeholder="Create a secure password" />
                </div>
              </div>

              {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}
              {success ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{success}</div> : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="submit" disabled={loading} className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60">
                  {loading ? "Creating institution..." : "Create institution"}
                </button>
                <Link href="/admin/tenant" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white">
                  View admin console
                </Link>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
