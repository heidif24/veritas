"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LOCALES, t as translate, type Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (code: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)veritas_locale=([a-z]{2})/);
  const code = (match?.[1] || "en") as Locale;
  return LOCALES.some((l) => l.code === code) ? code : "en";
}

function applyDocumentLocale(code: Locale) {
  if (typeof document === "undefined") return;
  const meta = LOCALES.find((l) => l.code === code);
  document.documentElement.lang = code;
  document.documentElement.dir = meta?.dir || "ltr";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = readCookieLocale();
    setLocaleState(initial);
    applyDocumentLocale(initial);
    setHydrated(true);

    function onExternal(e: Event) {
      const detail = (e as CustomEvent<Locale>).detail;
      if (detail && LOCALES.some((l) => l.code === detail)) {
        setLocaleState(detail);
        applyDocumentLocale(detail);
      }
    }
    window.addEventListener("veritas:locale", onExternal as EventListener);
    return () => window.removeEventListener("veritas:locale", onExternal as EventListener);
  }, []);

  const setLocale = useCallback((code: Locale) => {
    if (!LOCALES.some((l) => l.code === code)) return;
    setLocaleState(code);
    try {
      document.cookie = `veritas_locale=${code};path=/;max-age=31536000;samesite=lax`;
      localStorage.setItem("veritas_locale", code);
    } catch {
      /* ignore storage errors */
    }
    applyDocumentLocale(code);
    window.dispatchEvent(new CustomEvent("veritas:locale", { detail: code }));
  }, []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);
  const dir = LOCALES.find((l) => l.code === locale)?.dir || "ltr";

  const value = useMemo(
    () => ({ locale, setLocale, t, dir }),
    [locale, setLocale, t, dir],
  );

  // Always provide context. key={locale} remounts the tree so every page
  // that captured strings in useState / module scope still refreshes.
  return (
    <LocaleContext.Provider value={value}>
      <div key={hydrated ? locale : "boot"} className="contents">
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: string) => translate("en", key),
      dir: "ltr" as const,
    };
  }
  return ctx;
}
