import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Privacy by design</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Data, retention, and student rights</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
          <section><h2 className="font-bold text-slate-900">What we store</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account identity (name, email, role, organisation)</li>
              <li>Composition content and revision snapshots</li>
              <li>Composition event streams (type/paste/delete timings) used for evidence</li>
              <li>Similarity check results and seal packages</li>
              <li>Audit events (views, seals, decisions, appeals)</li>
            </ul>
          </section>
          <section><h2 className="font-bold text-slate-900">What we do not sell</h2>
            <p className="mt-2">Student writing and telemetry are not sold to advertisers or model-training brokers.</p>
          </section>
          <section><h2 className="font-bold text-slate-900">Retention</h2>
            <p className="mt-2">Institutional tenants control retention windows. Default pilot retention is the academic term + one year unless the integrity office places a litigation hold.</p>
          </section>
          <section><h2 className="font-bold text-slate-900">Your rights</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access: export your compositions and evidence reports</li>
              <li>Correction: update profile data via your institution</li>
              <li>Appeal: open an integrity appeal on any flagged submission</li>
              <li>Deletion: request erasure subject to institutional legal holds</li>
            </ul>
          </section>
          <section><h2 className="font-bold text-slate-900">Security</h2>
            <p className="mt-2">Sessions are cookie-bound; seals use public-key signatures; audit logs record custody-sensitive actions.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
