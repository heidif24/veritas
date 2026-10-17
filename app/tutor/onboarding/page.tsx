import { redirect } from "next/navigation";

/** Tutor onboarding retired — universities contact support. */
export default function TutorOnboardingPage() {
  redirect("/onboarding?intent=institution");
}
