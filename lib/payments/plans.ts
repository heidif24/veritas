/** Canonical paid plans for Veritas billing. Prices in USD cents for Stripe. */

export type PlanId = "individual" | "publisher";

export type Plan = {
  id: PlanId;
  name: string;
  priceUsd: number;
  priceCents: number;
  interval: "month";
  description: string;
  features: string[];
  /** Primary product story */
  highlight: string;
};

export const PLANS: Record<PlanId, Plan> = {
  individual: {
    id: "individual",
    name: "Individual",
    priceUsd: 15,
    priceCents: 1500,
    interval: "month",
    description: "Authors, researchers, and independent professionals.",
    highlight: "Process monitoring + cryptographic seals",
    features: [
      "Process monitoring & composition trail",
      "Cryptographic seal packages (.veritas)",
      "Plagiarism and similarity checks",
      "Public verification of sealed work",
      "Export .doc, .html, .veritas",
    ],
  },
  publisher: {
    id: "publisher",
    name: "Publisher",
    priceUsd: 40,
    priceCents: 4000,
    interval: "month",
    description: "Editorial teams and imprints — process evidence, seals, and verification queues.",
    highlight: "Process + seal primary, team queues",
    features: [
      "Process monitoring & cryptographic seals",
      "Everything in Individual + pitch queues",
      "Team seats for editors",
      "Trust badges on accepted work",
      "Priority support",
    ],
  },
};

export function getPlan(id: string): Plan | null {
  if (id === "individual" || id === "publisher") return PLANS[id];
  return null;
}
