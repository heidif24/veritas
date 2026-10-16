import { getDb } from "@/lib/db";

/** Universities license Veritas. Students at onboarded institutions get free unlimited usage. */
export function resolveEntitlement(email: string, role: string): {
  plan: "student_institutional_free" | "institution_custom" | "none";
  unlimited: boolean;
  reason: string;
} {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  if (!domain) return { plan: "none", unlimited: false, reason: "Invalid email" };

  const db = getDb();
  const org = db
    .prepare("SELECT id, name, domain FROM organizations WHERE lower(domain) = ? OR lower(slug) = ?")
    .get(domain, domain.split(".")[0]) as { id: string; name: string; domain?: string } | undefined;

  if (org && (role === "STUDENT" || role === "student")) {
    return {
      plan: "student_institutional_free",
      unlimited: true,
      reason: `Covered by ${org.name} institutional licence — unlimited free usage.`,
    };
  }

  if (role === "ADMIN" || role === "INSTRUCTOR") {
    return { plan: "institution_custom", unlimited: true, reason: "Institutional licence." };
  }

  return {
    plan: "none",
    unlimited: false,
    reason: "Veritas is licensed to universities only. Contact support to onboard your institution.",
  };
}
