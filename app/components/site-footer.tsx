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
        { label: t("nav.verify"), href: "/verify" },
        { label: "Methodology", href: "/methodology" },
        { label: "Student fairness", href: "/fairness" },
      ],
    },
    {
      heading: t("footer.solutions"),
      links: [
        { label: t("nav.pricing"), href: "/pricing" },
        { label: t("footer.faculty"), href: "/login" },
        { label: t("footer.onboarding"), href: "/onboarding?intent=institution" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Copyrights Notice", href: "/copyrights" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Refund Policy", href: "/refund" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#0b100e] text-slate-300">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="[&_span]:text-white">
              <VeritasLogo href="/" size="md" showTagline />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">{t("footer.tagline")}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A34B]">
              Universities only
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/onboarding?intent=institution"
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Contact support
              </Link>
              <a
                href="mailto:support@veritas.io"
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
              >
                support@veritas.io
              </a>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
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
          <p>Licensed to universities. Students write under a campus account.</p>
        </div>
      </div>
    </footer>
  );
}
