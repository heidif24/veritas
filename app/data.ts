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
  { label: "Documents reviewed", value: "2.4M", detail: "Across campuses and independent studios" },
  { label: "Average verification latency", value: "8.2s", detail: "From upload to trust verdict" },
  { label: "Tamper detection precision", value: "99.97%", detail: "Offline-export integrity checks" },
  { label: "Institutional onboarding", value: "430+", detail: "Schools and departments live" },
];

export const platformCapabilities = [
  { title: "Review workspace", description: "Give teams a secure place to draft, manage versions, and track approvals with role-based access." },
  { title: "Document timeline", description: "Every revision, decision, and review note is captured in a clear, time-stamped operational history." },
  { title: "Signed export verification", description: "Downloadable secure bundles detect tampering and confirm integrity before external sharing." },
  { title: "Collaboration workflow", description: "Multi-user review sessions keep commentary, approvals, and ownership aligned across the document lifecycle." },
];

export const features: Feature[] = [
  {
    title: "Secure review workspace",
    description: "A shared drafting environment for teams to organize content, comments, and approvals without losing accountability.",
    accent: "from-cyan-500/30 to-blue-500/30",
  },
  {
    title: "Immutable document history",
    description: "Every update and review decision is preserved in a tamper-evident timeline that supports audit readiness.",
    accent: "from-violet-500/30 to-purple-500/30",
  },
  {
    title: "Operational assurance",
    description: "Faculty, editors, and administrators review version status, audit records, and final sign-off in one dashboard.",
    accent: "from-emerald-500/30 to-teal-500/30",
  },
  {
    title: "Trust certificates",
    description: "Independent teams share signed evidence and verification records with clients, partners, and stakeholders.",
    accent: "from-orange-500/30 to-amber-500/30",
  },
];

export const pricingTiers = [
  { name: "Starter", price: "$39", description: "For freelancers and pitch submissions", features: ["1 workspace", "Public verification certs", "Secure export bundles"] },
  { name: "Institutional", price: "$2,400", description: "For academic departments and campuses", features: ["LMS integrations", "Assignment review queues", "Faculty and role controls"] },
  { name: "Enterprise", price: "Custom", description: "For publishers and large organizations", features: ["Custom SSO", "Priority support", "Advanced audit controls"] },
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
  { label: "Document status", value: "Verified" },
  { label: "Review queue", value: "2 pending" },
  { label: "Offline tamper check", value: "Passed" },
  { label: "Integrity confidence", value: "High" },
];

export const publisherPitches = [
  { title: "Allegory of the Edge", writer: "Mira S.", status: "Verified", score: 97 },
  { title: "The Quiet Infrastructure", writer: "Eli B.", status: "Verified", score: 94 },
  { title: "Weathering the Long Shift", writer: "Rae K.", status: "Review", score: 81 },
];
