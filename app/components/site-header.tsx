"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { VeritasLogo } from "./veritas-logo";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale } from "./locale-provider";

export function SiteHeader() {
  const { t } = useLocale();
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const items = [
    { label: t("nav.product"), href: "/platform" },
    { label: t("nav.universities"), href: "/universities" },
    { label: t("nav.pricing"), href: "/pricing" },
    { label: t("nav.verify"), href: "/verify" },
  ];

  const linkClass = isHome
    ? "rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
    : "rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--emerald-soft)] hover:text-[var(--ink)]";

  const active = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")
      ? isHome
        ? " text-white"
        : " text-[var(--ink)]"
      : "";

  return (
    <header
      className={
        isHome
          ? "sticky top-0 z-50 border-b border-white/10 bg-[#07090d]/80 backdrop-blur-xl"
          : "sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className={isHome ? "[&_span]:text-white" : ""}>
          <VeritasLogo href="/" size="md" />
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass + active(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher variant={isHome ? "dark" : "light"} />
          </div>
          <Link
            href="/login"
            className={
              isHome
                ? "hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white sm:inline-flex"
                : "v-btn v-btn-ghost hidden !py-2 !text-sm sm:inline-flex"
            }
          >
            {t("nav.signin")}
          </Link>
          <Link
            href="/onboarding?intent=institution"
            className={
              isHome
                ? "rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 sm:px-4 sm:text-sm"
                : "v-btn v-btn-primary !py-2 !text-xs sm:!text-sm"
            }
          >
            {t("nav.contactSupport")}
          </Link>
          <button
            type="button"
            className={
              isHome
                ? "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
                : "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--ink)] lg:hidden"
            }
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden className="flex flex-col gap-1">
              <span className={`block h-px w-4 ${isHome ? "bg-white" : "bg-[var(--ink)]"}`} />
              <span className={`block h-px w-4 ${isHome ? "bg-white" : "bg-[var(--ink)]"}`} />
              <span className={`block h-px w-4 ${isHome ? "bg-white" : "bg-[var(--ink)]"}`} />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav
          className={
            isHome
              ? "border-t border-white/10 px-4 py-3 lg:hidden"
              : "border-t border-[var(--line)] bg-white px-4 py-3 lg:hidden"
          }
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
            <Link href="/login" className={linkClass}>
              {t("nav.signin")}
            </Link>
            <div className="px-2.5 py-2 sm:hidden">
              <LanguageSwitcher variant={isHome ? "dark" : "light"} />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
