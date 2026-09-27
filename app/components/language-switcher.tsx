"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "./locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        aria-label="Select language"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
