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
        { label: t("nav.universities"), href: "/universities" },
        { label: "Writing Tutor", href: "/student/coaching" },
        { label: t("nav.verify"), href: "/verify" },
        { label: t("nav.pricing"), href: "/pricing" },
      ],
    },
    {
      heading: t("footer.solutions"),
      links: [
        { label: t("nav.universities"), href: "/universities" },
        { label: t("footer.faculty"), href: "/instructor/courses" },
        { label: t("nav.publishers"), href: "/publishers" },
        { label: t("nav.authors"), href: "/authors" },
        { label: "Become a tutor", href: "/tutor/onboarding" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Copyrights Notice", href: "/copyrights" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Refund Policy", href: "/refund" },
        { label: t("footer.terms"), href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#101815] text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="[&_span]:text-white">
              <VeritasLogo href="/" size="md" showTagline />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">{t("footer.tagline")}</p>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A34B]">
              Secure · Authentic · Verified
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/student/coaching" className="rounded-full border border-[#167451]/40 bg-[#167451]/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-[#167451]/30">
                Writing Tutor
              </Link>
              <Link href="/tutor/onboarding" className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5">
                Become a tutor
              </Link>
            </div>
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

        <div className="mt-8 flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.rights")}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/copyrights" className="hover:text-slate-300">
              Copyrights Notice
            </Link>
            <Link href="/cookies" className="hover:text-slate-300">
              Cookie Policy
            </Link>
            <Link href="/refund" className="hover:text-slate-300">
              Refund Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
