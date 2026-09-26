import { getDb } from "@/lib/db";

/** Students whose email domain matches an onboarded organisation receive free unlimited usage. */
export function resolveEntitlement(email: string, role: string): {
  plan: "student_institutional_free" | "individual" | "publisher" | "institution_custom" | "none";
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

  if (role === "PUBLISHER") {
    return { plan: "publisher", unlimited: false, reason: "Publisher plan — $750/month." };
  }
  if (role === "ADMIN" || role === "INSTRUCTOR") {
    return { plan: "institution_custom", unlimited: true, reason: "Institutional custom agreement." };
  }

  return { plan: "individual", unlimited: false, reason: "Individual plan — $15/month." };
}
