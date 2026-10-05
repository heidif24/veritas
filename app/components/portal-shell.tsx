"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale } from "./locale-provider";
import { VeritasLogo, VeritasMark } from "./veritas-logo";

export type AdminRole = "super" | "institutional" | "publisher" | "instructor";

type PortalShellProps = {
  title: string;
  subtitle: string;
  navItems: { label: string; href: string; active?: boolean }[];
  children: ReactNode;
  role?: AdminRole;
};

const roleConfig: Record<
  AdminRole,
  { labelKey: string; badge: string; accent: string; glow: string }
> = {
  super: {
    labelKey: "portal.role.super",
    badge: "bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 text-fuchsia-100 ring-fuchsia-400/30",
    accent: "from-fuchsia-500 via-violet-500 to-cyan-400",
    glow: "shadow-fuchsia-500/20",
  },
  institutional: {
    labelKey: "portal.role.institutional",
    badge: "bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-100 ring-cyan-400/30",
    accent: "from-cyan-400 via-sky-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  publisher: {
    labelKey: "portal.role.publisher",
    badge: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-100 ring-amber-400/30",
    accent: "from-amber-400 via-orange-500 to-rose-500",
    glow: "shadow-amber-500/20",
  },
  instructor: {
    labelKey: "portal.role.instructor",
    badge: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-100 ring-emerald-400/30",
    accent: "from-emerald-400 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/20",
  },
};

export function PortalShell({
  title,
  subtitle,
  navItems,
  children,
  role = "institutional",
}: PortalShellProps) {
  const { t } = useLocale();
  const cfg = roleConfig[role];
  const roleLabel = t(cfg.labelKey);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-24 top-24 h-[380px] w-[380px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[280px] w-[480px] rounded-full bg-fuchsia-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-72 shrink-0 flex-col rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl lg:flex">
          <VeritasLogo href="/" size="md" className="text-white" />

          <div className={`mt-5 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ring-1 ${cfg.badge}`}>
            {roleLabel}
          </div>

          <nav className="mt-8 flex-1 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? `bg-gradient-to-r ${cfg.accent} text-white shadow-lg ${cfg.glow}`
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{t("portal.health")}</div>
            <div className="mt-2 bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-2xl font-black text-transparent">
              99.97%
            </div>
            <div className="mt-1 text-xs text-slate-500">{t("portal.integrity")}</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 rounded-[28px] border border-white/10 bg-slate-900/50 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-7">
          <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/90">{t("portal.operations")}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">{title}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{subtitle}</p>
            </div>

            <div className="flex shrink-0 items-center gap-3 self-end sm:self-start">
              <LanguageSwitcher variant="dark" />
              <div className={`hidden rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 sm:block ${cfg.badge}`}>
                {roleLabel}
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 backdrop-blur-sm">
                <VeritasMark />
                <div className="hidden text-left sm:block">
                  <div className="text-xs font-semibold text-white">Veritas</div>
                  <div className="text-[10px] text-slate-400">{t("portal.console")}</div>
                </div>
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
