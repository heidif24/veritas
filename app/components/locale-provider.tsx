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

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = readCookieLocale();
    setLocaleState(initial);
    const meta = LOCALES.find((l) => l.code === initial);
    document.documentElement.lang = initial;
    document.documentElement.dir = meta?.dir || "ltr";
    setReady(true);

    function onExternal(e: Event) {
      const detail = (e as CustomEvent<Locale>).detail;
      if (detail && LOCALES.some((l) => l.code === detail)) {
        setLocaleState(detail);
        const m = LOCALES.find((l) => l.code === detail);
        document.documentElement.lang = detail;
        document.documentElement.dir = m?.dir || "ltr";
      }
    }
    window.addEventListener("veritas:locale", onExternal as EventListener);
    return () => window.removeEventListener("veritas:locale", onExternal as EventListener);
  }, []);

  const setLocale = useCallback((code: Locale) => {
    if (!LOCALES.some((l) => l.code === code)) return;
    setLocaleState(code);
    document.cookie = `veritas_locale=${code};path=/;max-age=31536000;samesite=lax`;
    const meta = LOCALES.find((l) => l.code === code);
    document.documentElement.lang = code;
    document.documentElement.dir = meta?.dir || "ltr";
    window.dispatchEvent(new CustomEvent("veritas:locale", { detail: code }));
  }, []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  const dir = LOCALES.find((l) => l.code === locale)?.dir || "ltr";

  const value = useMemo(
    () => ({ locale, setLocale, t, dir }),
    [locale, setLocale, t, dir],
  );

  // Avoid flash of wrong language after cookie read
  if (!ready) {
    return <div className="min-h-screen opacity-0">{children}</div>;
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Safe fallback for any component rendered outside the provider
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: string) => translate("en", key),
      dir: "ltr" as const,
    };
  }
  return ctx;
}
