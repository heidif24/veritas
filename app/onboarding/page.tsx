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
    <main className="min-h-screen bg-[var(--paper)] px-4 py-14 text-[var(--ink)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">
            Onboarding
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">Register your institution</h1>
          <p className="mt-3 max-w-xl text-[var(--muted)]">
            Set up your campus or organization, create the primary admin, and start configuring
            review workflows. Students and instructors are provisioned under your university licence.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl border border-[var(--line)] bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Steps
            </p>
            <div className="mt-5 space-y-4">
              {[
                ["1", "Institution profile", "Name, domain, and sector"],
                ["2", "Primary admin", "Account that manages the tenant"],
                ["3", "Review setup", "Roles, departments, and policy"],
                ["4", "Go live", "Invite faculty and open submissions"],
              ].map(([step, title, detail]) => (
                <div key={step} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-soft)] text-sm font-bold text-[var(--emerald)]">
                    {step}
                  </span>
                  <div>
                    <div className="font-semibold text-[var(--ink)]">{title}</div>
                    <p className="text-sm text-[var(--muted)]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-[var(--emerald)]/20 bg-[var(--emerald-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">Prefer to talk first?</p>
              <a
                href="mailto:support@veritas.io"
                className="mt-1 block text-sm font-semibold text-[var(--emerald)] hover:underline"
              >
                support@veritas.io
              </a>
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                  Institution name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="v-input"
                  placeholder="Northbridge University"
                />
              </div>

              <div>
                <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                  URL slug
                </label>
                <input id="slug" name="slug" required className="v-input" placeholder="northbridge" />
              </div>

              <div>
                <label htmlFor="sector" className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                  Sector
                </label>
                <select id="sector" name="sector" defaultValue="Education" className="v-input">
                  <option>Education</option>
                  <option>Healthcare</option>
                  <option>Government</option>
                  <option>Research</option>
                </select>
              </div>

              <div>
                <label htmlFor="adminName" className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                  Primary admin name
                </label>
                <input
                  id="adminName"
                  name="adminName"
                  required
                  className="v-input"
                  placeholder="Alicia Morgan"
                />
              </div>

              <div>
                <label htmlFor="adminEmail" className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                  Admin email
                </label>
                <input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  required
                  className="v-input"
                  placeholder="admin@northbridge.edu"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="adminPassword"
                  className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
                >
                  Initial admin password
                </label>
                <input
                  id="adminPassword"
                  name="adminPassword"
                  type="password"
                  required
                  minLength={8}
                  className="v-input"
                  placeholder="Create a secure password"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="rounded-xl border border-emerald-200 bg-[var(--emerald-soft)] px-3 py-2 text-sm text-[var(--emerald-dark)]">
                {success}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button type="submit" disabled={loading} className="v-btn v-btn-primary disabled:opacity-60">
                {loading ? "Creating..." : "Create institution"}
              </button>
              <Link href="/admin/tenant" className="v-btn v-btn-secondary text-center">
                Admin console
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
