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
      setError(result.error || "Could not complete onboarding.");
      return;
    }

    setSuccess("Institution registered. Opening the admin console...");
    window.setTimeout(() => router.push("/admin/tenant"), 700);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-14 text-slate-900 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Onboarding</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Register your institution</h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Set up your campus or organization, create the primary admin, and start configuring review workflows.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Steps</p>
            <div className="mt-5 space-y-4">
              {[
                ["1", "Institution profile", "Name, domain, and sector"],
                ["2", "Primary admin", "Account that manages the tenant"],
                ["3", "Review setup", "Roles, departments, and policy"],
                ["4", "Go live", "Invite faculty and open submissions"],
              ].map(([step, title, detail]) => (
                <div key={step} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800">
                    {step}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">{title}</div>
                    <p className="text-sm text-slate-600">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Institution name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Northbridge University"
                />
              </div>

              <div>
                <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-slate-700">
                  URL slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="northbridge"
                />
              </div>

              <div>
                <label htmlFor="sector" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Sector
                </label>
                <select
                  id="sector"
                  name="sector"
                  defaultValue="Education"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                >
                  <option>Education</option>
                  <option>Healthcare</option>
                  <option>Government</option>
                  <option>Research</option>
                  <option>Publishing</option>
                </select>
              </div>

              <div>
                <label htmlFor="adminName" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Primary admin name
                </label>
                <input
                  id="adminName"
                  name="adminName"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Alicia Morgan"
                />
              </div>

              <div>
                <label htmlFor="adminEmail" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Admin email
                </label>
                <input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="admin@northbridge.edu"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="adminPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Initial admin password
                </label>
                <input
                  id="adminPassword"
                  name="adminPassword"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Create a secure password"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            ) : null}
            {success ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</div>
            ) : null}

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create institution"}
              </button>
              <Link
                href="/admin/tenant"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Admin console
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
