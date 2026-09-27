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
        { label: "Detect AI & plagiarism", href: "/platform" },
        { label: t("nav.verify"), href: "/verify" },
        { label: t("nav.pricing"), href: "/pricing" },
      ],
    },
    {
      heading: t("footer.solutions"),
      links: [
        { label: "Education & schools", href: "/universities" },
        { label: t("footer.faculty"), href: "/instructor/courses" },
        { label: "Enterprise & publishers", href: "/publishers" },
        { label: t("nav.authors"), href: "/authors" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: t("footer.onboarding"), href: "/onboarding" },
        { label: "Public verification", href: "/verify" },
        { label: t("footer.privacy"), href: "/privacy" },
        { label: t("footer.terms"), href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="[&_span]:text-white">
              <VeritasLogo href="/" size="md" showTagline />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">{t("footer.tagline")}</p>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
              Secure · Authentic · Verified
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{group.heading}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-slate-300 transition hover:text-white">
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
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-slate-300">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              {t("footer.terms")}
            </Link>
            <Link href="/verify" className="hover:text-slate-300">
              {t("nav.verify")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
