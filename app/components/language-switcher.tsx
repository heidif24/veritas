"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)veritas_locale=([a-z]{2})/);
    if (match && LOCALES.some((l) => l.code === match[1])) {
      setLocale(match[1] as Locale);
    }
  }, []);

  function change(code: Locale) {
    setLocale(code);
    document.cookie = `veritas_locale=${code};path=/;max-age=31536000;samesite=lax`;
    const meta = LOCALES.find((l) => l.code === code);
    document.documentElement.lang = code;
    document.documentElement.dir = meta?.dir || "ltr";
    window.dispatchEvent(new CustomEvent("veritas:locale", { detail: code }));
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => change(e.target.value as Locale)}
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
