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
      role="super"
      title="Institution onboarding"
      subtitle="Track new registrations, activation progress, and go-live status."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: true },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["New registrations", "18", "from-cyan-400 to-sky-500"],
          ["Awaiting setup", "6", "from-amber-400 to-orange-500"],
          ["Identity verified", "11", "from-emerald-400 to-teal-500"],
          ["Live tenants", "8", "from-violet-400 to-fuchsia-500"],
        ].map(([label, value, grad]) => (
          <div key={label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${grad} opacity-25 blur-2xl`} />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
              <div className={`mt-2 bg-gradient-to-r ${grad} bg-clip-text text-3xl font-black text-transparent`}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Pipeline</h2>
            <span className="rounded-full bg-cyan-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-300 ring-1 ring-cyan-500/30">
              Live
            </span>
          </div>
          <div className="space-y-3">
            {[
              ["Profile review", "Completed", "2 institutions"],
              ["Admin provisioning", "In progress", "4 institutions"],
              ["Department mapping", "Pending", "6 institutions"],
              ["Go-live approval", "Queued", "3 institutions"],
            ].map(([step, status, detail]) => (
              <div key={step} className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{step}</span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-500/30">
                    {status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-lg font-bold text-white">Recent institutions</h2>
          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">Loading…</div>
            ) : institutions.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">No institutions yet.</div>
            ) : (
              institutions.slice(0, 5).map((institution) => (
                <div key={institution.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">
                  <div>
                    <div className="font-medium text-white">{institution.name}</div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{institution.slug}</div>
                  </div>
                  <span className="text-xs text-cyan-300">{new Date(institution.created_at).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
