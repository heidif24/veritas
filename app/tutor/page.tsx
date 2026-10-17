import { redirect } from "next/navigation";

/** Tutor product track retired — universities only. */
export default function TutorPage() {
  redirect("/onboarding?intent=institution");
}
