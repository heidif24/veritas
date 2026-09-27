"use client";

import Link from "next/link";
import { VeritasLogo } from "./veritas-logo";
import { useLocale } from "./locale-provider";

export function SiteFooter() {
  const { t } = useLocale();

  const footerGroups = [
    {
      heading: t("footer.product"),
      links: [
        { label: t("footer.platform"), href: "/platform" },
        { label: t("nav.verify"), href: "/verify" },
        { label: t("nav.pricing"), href: "/pricing" },
      ],
    },
    {
      heading: t("footer.solutions"),
      links: [
        { label: t("nav.universities"), href: "/universities" },
        { label: t("footer.faculty"), href: "/instructor/courses" },
        { label: t("nav.publishers"), href: "/publisher/pitches" },
      ],
    },
    {
      heading: t("footer.company"),
      links: [
        { label: t("footer.onboarding"), href: "/onboarding" },
        { label: t("footer.privacy"), href: "/privacy" },
        { label: t("footer.terms"), href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 border-b border-slate-200 pb-10 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <VeritasLogo href="/" size="md" showTagline />
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">{t("footer.tagline")}</p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{group.heading}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-slate-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.rights")}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-slate-900">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-slate-900">
              {t("footer.terms")}
            </Link>
            <Link href="/verify" className="hover:text-slate-900">
              {t("nav.verify")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
