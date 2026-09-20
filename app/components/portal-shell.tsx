import Link from "next/link";
import type { ReactNode } from "react";

type PortalShellProps = {
  title: string;
  subtitle: string;
  navItems: { label: string; href: string; active?: boolean }[];
  children: ReactNode;
};

export function PortalShell({ title, subtitle, navItems, children }: PortalShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-[30px] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/40 lg:block">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">V</span>
            Veritas
          </Link>

          <div className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? "bg-cyan-500/10 text-cyan-100 ring-1 ring-cyan-500/25 shadow-lg shadow-cyan-500/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-200">System health</div>
            <div className="mt-3 text-2xl font-black text-white">99.97%</div>
            <div className="mt-1 text-xs text-slate-400">Integrity validation</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 rounded-[30px] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm shadow-2xl shadow-slate-950/30">
          <header className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Operations</p>
              <h1 className="mt-2 text-3xl font-black text-white">{title}</h1>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-300">{subtitle}</p>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
