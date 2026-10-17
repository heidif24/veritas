import { redirect } from "next/navigation";

/** Authors / individual marketing track retired — universities only. */
export default function AuthorsPage() {
  redirect("/onboarding?intent=institution");
}
