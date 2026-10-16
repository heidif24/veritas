import { redirect } from "next/navigation";

/** Publisher product track retired — universities only. */
export default function PublisherPitchesPage() {
  redirect("/onboarding?intent=institution");
}
