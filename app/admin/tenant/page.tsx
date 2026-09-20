import Link from "next/link";
import { PortalShell } from "../../components/portal-shell";

export default function AdminTenantPage() {
  return (
    <PortalShell
      title="Tenant operations overview"
      subtitle="Monitor institutional health, role distribution, office workflows, and system-wide trust indicators across the organization."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: true },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["Departments", "12"],
          ["Faculty seats", "184"],
          ["SSO integrations", "04"],
          ["Active tenants", "08"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[22px] border border-white/10 bg-slate-950/40 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-cyan-500/20 bg-cyan-500/5 p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">Faculty onboarding</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Add professors and assign their review domains</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-200">
            {[
              "Invite professors by department and role",
              "Configure assignment review pools and policies",
              "Track school-by-school onboarding completion",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-violet-200">Institutional workflow</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Student-to-professor submission flow</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {[
              "Student submits assignment directly into faculty queue",
              "Professor reviews evidence, comments, and approval history",
              "Sealed export is returned with verification certificate",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-xl font-bold text-white">LMS and identity setup</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {[
              "Canvas LTI 1.3 health: Connected",
              "Moodle SSO: Enabled",
              "Blackboard webhooks: Synced",
              "Google Workspace provisioning: Running",
            ].map((entry) => (
              <div key={entry} className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">{entry}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-xl font-bold text-white">Usage analytics</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Submission volume", "2,184"],
              ["Integrity trend", "+18.4%"],
              ["Pending reviews", "64"],
              ["Published auth certs", "341"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                <span className="text-sm text-slate-300">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Department performance</h2>
            <Link href="/admin/analytics" className="text-sm text-cyan-200">View reports</Link>
          </div>
          <div className="space-y-4">
            {[
              ["Philosophy", "96%"],
              ["History", "92%"],
              ["Biology", "89%"],
              ["English", "94%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300"><span>{label}</span><span className="font-semibold text-white">{value}</span></div>
                <div className="progress-bar h-2.5 rounded-full bg-slate-800"><span style={{ width: value }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-xl font-bold text-white">Operational notes</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {[
              "Review latency is down 11% this month.",
              "42 new secure export bundles processed today.",
              "One department requires MS Entra revalidation.",
            ].map((note) => (
              <div key={note} className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">{note}</div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
