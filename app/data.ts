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

export const metrics: Stat[] = [
  { label: "Institutions & teams", value: "430+", detail: "Campuses and editorial organizations" },
  { label: "Documents processed", value: "2.4M+", detail: "Drafts, reviews, and sealed exports" },
  { label: "Integrity accuracy", value: "99.97%", detail: "Post-export verification reliability" },
  { label: "Average verification", value: "2.1s", detail: "Time to confirm a sealed package" },
];

export const platformCapabilities = [
  { title: "Clear writing provenance", description: "Every submission carries a readable record of how the work was produced." },
  { title: "Originality that fits campus policy", description: "Similarity and authorship signals that support fair review." },
  { title: "Sealed, portable packages", description: "Export signed documents that remain verifiable outside the platform." },
  { title: "Roles that match real teams", description: "Student, faculty, and institutional workflows in one place." },
];

export const features: Feature[] = [
  {
    title: "Provenance you can show",
    description: "Reviewers see a clear trail of drafting, sources, and revisions — not just a final file.",
    accent: "from-cyan-500/30 to-blue-500/30",
  },
  {
    title: "Fair originality signals",
    description: "Paste patterns, similarity, and composition health surface early so writers can improve before submission.",
    accent: "from-violet-500/30 to-purple-500/30",
  },
  {
    title: "Cryptographic sealing",
    description: "Final work is sealed so any later change is immediately visible to verifiers.",
    accent: "from-emerald-500/30 to-teal-500/30",
  },
  {
    title: "Shareable trust",
    description: "Writers and institutions can share verification links with external reviewers and publishers.",
    accent: "from-orange-500/30 to-amber-500/30",
  },
];

export const pricingTiers = [
  { name: "Writer", price: "$19", description: "For independent authors and freelancers", features: ["Authorship certificates", "Sealed exports", "Public verification links"] },
  { name: "Institutional", price: "$2,400", description: "For departments and campuses", features: ["Assignment workflows", "Faculty review tools", "SSO and compliance controls"] },
  { name: "Publisher", price: "Custom", description: "For editorial and high-volume teams", features: ["Pitch queues", "Trust badges", "Advanced policy controls"] },
];

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

export const publisherPitches = [
  { title: "Allegory of the Edge", writer: "Mira S.", status: "Verified", score: 97 },
  { title: "The Quiet Infrastructure", writer: "Eli B.", status: "Verified", score: 94 },
  { title: "Weathering the Long Shift", writer: "Rae K.", status: "Needs review", score: 81 },
];
