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
        onChange={(e) => setLocale(e.target.value as Locale)}
        className={
          isDark
            ? "appearance-none rounded-full border border-white/15 bg-white/5 py-1.5 pl-3 pr-7 text-xs font-semibold text-zinc-200 outline-none hover:bg-white/10"
            : "appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        }
        aria-label="Select language"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code} className="bg-slate-900 text-white">
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
