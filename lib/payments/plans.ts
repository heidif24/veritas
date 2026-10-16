/** Institutional licensing only — no individual or publisher self-serve plans. */

export type PlanId = "institution";

export type Plan = {
  id: PlanId;
  name: string;
  priceUsd: number | null;
  priceCents: number | null;
  interval: "custom";
  description: string;
  features: string[];
  highlight: string;
};

export const PLANS: Record<PlanId, Plan> = {
  institution: {
    id: "institution",
    name: "University & institution",
    priceUsd: null,
    priceCents: null,
    interval: "custom",
    description: "Campus licence sold only to universities. Students write free under the institutional agreement.",
    highlight: "Process monitoring + cryptographic seals + campus customization",
    features: [
      "Student writing, submissions, and process trails",
      "Instructor assignment and review workflows",
      "Cryptographic seal packages (.veritas)",
      "Institutional branding and tenant controls",
      "Moodle / LMS-oriented onboarding",
      "Students covered at no individual cost",
    ],
  },
};

export function getPlan(id: string): Plan | null {
  if (id === "institution") return PLANS.institution;
  return null;
}
