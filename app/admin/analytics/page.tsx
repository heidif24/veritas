import { PortalShell } from "../../components/portal-shell";

export default function AdminAnalyticsPage() {
  return (
    <PortalShell
      title="Platform analytics"
      subtitle="Read campus-wide performance trends, risk volumes, and integrity adoption across all cohorts."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: true },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["Submissions", "2,184"],
          ["Verification success", "97.8%"],
          ["Risk alerts", "87"],
          ["Avg. review time", "12m"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Integrity trend</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-200">+18.4%</span>
          </div>
          <div className="flex h-64 items-end gap-3">
            {[18, 28, 34, 40, 52, 46, 64, 82, 76, 90, 96, 104].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-500/70 to-violet-500/50" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-xl font-bold text-white">Departments</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Philosophy", "94%"],
              ["Biology", "89%"],
              ["History", "91%"],
              ["Literature", "96%"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-slate-900/65 p-3">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300"><span>{label}</span><span className="text-white">{value}</span></div>
                <div className="progress-bar h-2 rounded-full bg-slate-800"><span style={{ width: value }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
