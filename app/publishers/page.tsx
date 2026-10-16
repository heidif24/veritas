import { redirect } from "next/navigation";

/** Publisher marketing page retired — universities only. */
export default function PublishersPage() {
  redirect("/onboarding?intent=institution");
}
