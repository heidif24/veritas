"use client";

import Link from "next/link";
import { VeritasLogo } from "./veritas-logo";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale } from "./locale-provider";

export function SiteHeader() {
  const { t } = useLocale();

  const navItems = [
    { label: t("nav.product"), href: "/platform" },
    { label: t("nav.universities"), href: "/universities" },
    { label: t("nav.authors"), href: "/authors" },
    { label: t("nav.publishers"), href: "/publishers" },
    { label: t("nav.pricing"), href: "/pricing" },
    { label: t("nav.verify"), href: "/verify" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <VeritasLogo href="/" size="md" />

        <nav className="hidden flex-1 items-center justify-center gap-0.5 text-sm text-muted-foreground lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 font-medium transition hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:text-sm"
          >
            {t("nav.signin")}
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-95 sm:px-4 sm:text-sm"
          >
            {t("nav.getstarted")}
          </Link>
        </div>
      </div>
    </header>
  );
}
