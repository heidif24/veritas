"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "../../components/portal-shell";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    documents: 0,
    users: 0,
    organizations: 0,
    verificationRate: "97.8%",
    institutionBreakdown: { university: 0, publisher: 0 },
  });

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((response) => response.json())
      .then((result) => {
        if (result.summary) setStats(result.summary);
      })
      .catch(() => undefined);
  }, []);

  return (
    <PortalShell
      role="super"
      title="Platform analytics"
      subtitle="Campus-wide trends, verification rates, and adoption across all tenants."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: true },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Submissions", String(stats.documents), "from-cyan-400 to-sky-500"],
          ["Verification success", stats.verificationRate, "from-emerald-400 to-teal-500"],
          ["Total users", String(stats.users), "from-violet-400 to-fuchsia-500"],
          ["Institutions", String(stats.organizations), "from-amber-400 to-orange-500"],
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Integrity trend</h2>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              +18.4%
            </span>
          </div>
          <div className="flex h-56 items-end gap-2.5 sm:gap-3">
            {[18, 28, 34, 40, 52, 46, 64, 82, 76, 90, 96, 100].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-500/80 via-sky-400/70 to-violet-400/60 shadow-lg shadow-cyan-500/10 transition hover:opacity-100"
                style={{ height: `${height}%`, opacity: 0.75 + index * 0.02 }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-lg font-bold text-white">Tenant mix</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Universities", String(stats.institutionBreakdown.university), "from-cyan-400 to-blue-500"],
              ["Publishers", String(stats.institutionBreakdown.publisher), "from-amber-400 to-orange-500"],
            ].map(([label, value, grad]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">{label}</span>
                  <span className="font-semibold text-white">{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <span className={`block h-full rounded-full bg-gradient-to-r ${grad}`} style={{ width: value === "0" ? "12%" : "72%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
