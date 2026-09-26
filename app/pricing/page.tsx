import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

const tiers = [
  {
    name: "Individual",
    price: "$15",
    period: "/ month",
    blurb: "Authors, researchers, and independent professionals.",
    cta: "Start writing",
    href: "/register?plan=individual",
    featured: false,
    features: [
      "Integrity Studio writing workspace",
      "Composition evidence & seal packages",
      "Similarity checks on your drafts",
      "Public verification links",
      "Export .doc, .html, .veritas",
    ],
  },
  {
    name: "Publishing house",
    price: "$750",
    period: "/ month",
    blurb: "Editorial teams, imprints, and high-volume review desks.",
    cta: "Start publisher trial",
    href: "/register?plan=publisher",
    featured: true,
    features: [
      "Everything in Individual",
      "Pitch & manuscript queues",
      "Team seats for editors",
      "Trust badges on accepted work",
      "Priority support",
    ],
  },
  {
    name: "University & institution",
    price: "Custom",
    period: "",
    blurb: "Campuses, faculties, and research offices. Scoped to your enrolment and LMS.",
    cta: "Contact us",
    href: "/onboarding?intent=institution",
    featured: false,
    features: [
      "Unlimited student writing once onboarded",
      "Faculty assignment & review workflows",
      "LTI for Canvas, Moodle, Blackboard",
      "Institutional corpus & policy engine",
      "Integrity office case management",
      "SSO, audit trails, data retention controls",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Pricing</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Pricing that matches how integrity work is funded
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Students at onboarded institutions write free. Individuals and publishers get a clear monthly plan.
            Universities work with us on a custom agreement.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-8">
          <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-violet-50 px-6 py-5 text-left sm:text-center">
            <p className="text-sm font-semibold text-slate-900">Students: free unlimited when your university is onboarded</p>
            <p className="mt-1 text-sm text-slate-600">
              Sign in with your institutional email. If that domain belongs to an onboarded campus, Veritas unlocks full
              student access at no charge — no card required.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-[28px] border p-7 shadow-sm ${
                  tier.featured
                    ? "border-violet-300 bg-violet-50/40 ring-1 ring-violet-200"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{tier.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight text-slate-900">{tier.price}</span>
                  {tier.period ? <span className="text-sm font-medium text-slate-500">{tier.period}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tier.blurb}</p>
                <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-700">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition ${
                    tier.featured
                      ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-500/20 hover:opacity-95"
                      : tier.price === "Custom"
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50/80">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-black text-slate-900">Institutional sales</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Every campus is different — enrolment size, LMS (Canvas, Moodle, Blackboard), data residency, and policy
                thresholds. We design the agreement with your integrity office and IT team online, then onboard faculty
                and students.
              </p>
              <Link href="/onboarding?intent=institution" className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
                Schedule a discussion
              </Link>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">What is never paywalled for onboarded students</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>· Unlimited compositions in Integrity Studio</li>
                <li>· Assignment submission and evidence reports</li>
                <li>· Appeals and fairness explanations</li>
                <li>· Sealed package download for their own work</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
