import Link from "next/link";

const capabilities = [
  { title: "Secure review workspace", detail: "Give teams a protected space to draft, comment, and manage document versions with predictable access controls." },
  { title: "Document history ledger", detail: "Every revision, approval, and policy decision is stored in a clear timeline for operational accountability." },
  { title: "Verification engine", detail: "Public and institutional verifiers can confirm authenticity, detect tampering, and validate signed exports in seconds." },
  { title: "Review workflows", detail: "Instructors and editors can monitor decisions, approvals, and export readiness from one central evidence interface." },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">The platform</p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">A trust architecture for operational document workflows.</h1>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((capability) => (
            <div key={capability.title} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
              <div className="mb-4 h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20" />
              <h2 className="text-xl font-bold text-white">{capability.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{capability.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-200">System flow</p>
            <h2 className="mt-3 text-3xl font-bold text-white">From draft creation to trusted verification.</h2>
            <div className="mt-8 space-y-5">
              {[
                "Teams draft and manage content in a secure workspace with role-aware permissions and collaboration.",
                "Every review step, version change, and approval is recorded in the document history ledger.",
                "Exported files are sealed and any local tampering breaks the chain of trust.",
                "Verifiers review the integrity state and approval trail in one operational portal.",
              ].map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-200">{index + 1}</div>
                  <p className="text-base leading-7 text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">What institutions gain</p>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              {[
                "Faster review loops with clearer ownership and sign-off paths.",
                "Lower operational friction through structured policy and approval checkpoints.",
                "Stronger public trust through certificate-backed evidence and review history.",
                "Improved compliance and defensible institutional process.",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/45 px-4 py-3">{item}</div>
              ))}
            </div>
            <Link href="/verify" className="mt-8 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">Try verification</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
