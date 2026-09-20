"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "../../components/portal-shell";

type InstitutionRecord = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export default function AdminOnboardingPage() {
  const [institutions, setInstitutions] = useState<InstitutionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/institutions", { cache: "no-store" });
        const result = await response.json();
        setInstitutions(result.institutions ?? []);
      } catch {
        setInstitutions([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <PortalShell
      title="Institution onboarding"
      subtitle="Track new tenant registrations, onboarding health, and activation progress across the global network."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: true },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["New registrations", "18"],
          ["Awaiting setup", "06"],
          ["Identity verified", "11"],
          ["Live tenants", "08"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[22px] border border-white/10 bg-slate-950/40 p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Onboarding pipeline</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-cyan-200">Live</span>
          </div>

          <div className="space-y-4">
            {[
              ["Profile review", "Completed", "02 institutions"],
              ["Admin provisioning", "In progress", "04 institutions"],
              ["Department mapping", "Pending", "06 institutions"],
              ["Go-live approval", "Queued", "03 institutions"],
            ].map(([step, status, detail]) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{step}</span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-200">{status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-xl font-bold text-white">Recent institutions</h2>
          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">Loading institutions...</div>
            ) : institutions.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">No institutions registered yet.</div>
            ) : (
              institutions.slice(0, 5).map((institution) => (
                <div key={institution.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <div>
                    <div className="font-medium text-white">{institution.name}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{institution.slug}</div>
                  </div>
                  <span className="text-xs text-cyan-200">{new Date(institution.created_at).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
