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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="[&_span]:text-white">
          <VeritasLogo href="/" size="md" />
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-0.5 text-sm text-zinc-400 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 font-medium transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white sm:text-sm"
          >
            {t("nav.signin")}
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 sm:px-4 sm:text-sm"
          >
            {t("nav.getstarted")}
          </Link>
        </div>
      </div>
    </header>
  );
}
