export type Stat = {
  label: string;
  value: string;
  detail: string;
};

export type Feature = {
  title: string;
  description: string;
  accent: string;
};

export type Course = {
  id: string;
  title: string;
  term: string;
  submissions: number;
  risk: string;
  nextDeadline: string;
};

export type Assignment = {
  id: string;
  name: string;
  course: string;
  deadline: string;
  reviewed: number;
  total: number;
  risk: string;
};

export type Submission = {
  id: string;
  student: string;
  title: string;
  status: "Drafting" | "Needs review" | "Under review" | "Ready";
  score: number;
  timestamp: string;
};

export type Pitch = {
  title: string;
  writer: string;
  status: string;
  score: number;
};

export const metrics: Stat[] = [
  { label: "Universities", value: "430+", detail: "Campuses licensing Veritas" },
  { label: "Documents processed", value: "2.4M+", detail: "Drafts, reviews, and sealed exports" },
  { label: "Integrity accuracy", value: "99.97%", detail: "Post-export verification reliability" },
  { label: "Average verification", value: "2.1s", detail: "Time to confirm a sealed package" },
];

export const platformCapabilities = [
  { title: "Clear writing provenance", description: "Every submission carries a readable record of how the work was produced." },
  { title: "Originality that fits campus policy", description: "Similarity and authorship signals that support fair review." },
  { title: "Sealed, portable packages", description: "Export signed documents that remain verifiable outside the platform." },
  { title: "Roles that match campus teams", description: "Student, instructor, and institutional workflows in one place." },
];

export const features: Feature[] = [
  {
    title: "Provenance you can show",
    description: "Reviewers see a clear trail of drafting, sources, and revisions — not just a final file.",
    accent: "from-emerald-500/15 to-emerald-500/5",
  },
  {
    title: "Fair originality signals",
    description: "Paste patterns, similarity, and composition health surface early so writers can improve before submission.",
    accent: "from-emerald-500/10 to-transparent",
  },
  {
    title: "Cryptographic sealing",
    description: "Final work is sealed so any later change is immediately visible to verifiers.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Campus customization",
    description: "Universities brand the experience, set policy, and provision students and instructors under one licence.",
    accent: "from-amber-500/15 to-transparent",
  },
];

export const pricingTiers = [
  {
    name: "University",
    price: "Custom",
    description: "Campus licence — students write free",
    features: ["Assignment workflows", "Instructor review tools", "Branding & tenant controls", "Moodle-oriented onboarding"],
  },
];

/** Retired publisher track — kept so legacy pages compile during Next build. */
export const publisherPitches: Pitch[] = [];

export const courseCards: Course[] = [
  { id: "bio-240", title: "Biology 240", term: "Fall 2026", submissions: 33, risk: "Low", nextDeadline: "12 Nov" },
  { id: "hist-210", title: "History 210", term: "Fall 2026", submissions: 28, risk: "Moderate", nextDeadline: "16 Nov" },
  { id: "philo-101", title: "Philosophy 101", term: "Fall 2026", submissions: 41, risk: "Low", nextDeadline: "19 Nov" },
];

export const assignmentQueue: Assignment[] = [
  { id: "a-102", name: "Existentialism Term Paper", course: "Philosophy 101", deadline: "Closed in 4h", reviewed: 12, total: 41, risk: "Low" },
  { id: "a-214", name: "Comparative Literature Review", course: "English 220", deadline: "Due tomorrow", reviewed: 7, total: 18, risk: "Moderate" },
  { id: "a-401", name: "Research Ethics Brief", course: "Bio 240", deadline: "Due Tuesday", reviewed: 23, total: 33, risk: "Low" },
];

export const submissionRows: Submission[] = [
  { id: "S-101", student: "Amina R.", title: "Existentialism and Choice", status: "Ready", score: 96, timestamp: "2h ago" },
  { id: "S-102", student: "Noah L.", title: "The Ethics of a Contracted Self", status: "Needs review", score: 42, timestamp: "3h ago" },
  { id: "S-103", student: "Sofia M.", title: "Transcribed Notes Into Essay", status: "Under review", score: 58, timestamp: "5h ago" },
  { id: "S-104", student: "Leo T.", title: "Narrative Identity in Modernity", status: "Drafting", score: 94, timestamp: "7h ago" },
];

export const verificationChecks = [
  { label: "Signature", value: "Valid" },
  { label: "Content integrity", value: "Matched" },
  { label: "Tamper check", value: "Passed" },
  { label: "Provenance", value: "High confidence" },
];
