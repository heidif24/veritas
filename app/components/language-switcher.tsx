"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "./locale-provider";

export function LanguageSwitcher({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { locale, setLocale } = useLocale();
  const isDark = variant === "dark";

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          setLocale(next);
        }}
        className={
          isDark
            ? "cursor-pointer appearance-none rounded-full border border-white/20 bg-white/10 py-1.5 pl-3 pr-8 text-xs font-semibold text-white outline-none hover:bg-white/15 focus:ring-2 focus:ring-cyan-400/40"
            : "cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-800 outline-none hover:bg-slate-50 focus:ring-2 focus:ring-cyan-400/30"
        }
        aria-label="Select language"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code} className="bg-slate-900 text-white">
            {l.native}
          </option>
        ))}
      </select>
      <span
        className={`pointer-events-none absolute right-2.5 text-[10px] ${isDark ? "text-zinc-300" : "text-slate-500"}`}
        aria-hidden
      >
        ▾
      </span>
    </label>
  );
}
