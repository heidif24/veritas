import { redirect } from "next/navigation";

/** Individual self-serve track retired — universities only. */
export default function IndividualPage() {
  redirect("/onboarding?intent=institution");
}
