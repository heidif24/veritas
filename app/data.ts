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
  { label: "Composition events sealed", value: "2.4M", detail: "Keystrokes, edits, focus changes, and paste events" },
  { label: "Verifier response time", value: "2.1s", detail: "Public certificate and bundle checks" },
  { label: "Tamper detection precision", value: "99.97%", detail: "Post-export hash break detection" },
  { label: "Institutions and publishers", value: "430+", detail: "Campuses, departments, and editorial teams live" },
];

export const platformCapabilities = [
  { title: "Browser-native telemetry", description: "Capture keystroke cadence, pause intervals, focus loss, and paste events while writers draft in the editor." },
  { title: "Append-only lineage", description: "Record inserts, deletes, and structural changes as a replayable document history instead of a final-text guess." },
  { title: "Signed export bundles", description: "Seal text hashes, telemetry summaries, and author metadata into tamper-evident .veritas submissions." },
  { title: "Institutional review", description: "Route assignments into professor queues with verdict cards, heatmaps, and LMS-ready audit records." },
];

export const features: Feature[] = [
  {
    title: "Cognitive drafting proof",
    description: "Organic writing is measured through rhythm, revision behavior, and natural pause patterns captured during composition.",
    accent: "from-cyan-500/30 to-blue-500/30",
  },
  {
    title: "Paste and transcription flags",
    description: "Large pasted blocks, automated-looking bursts, and state changes are surfaced directly in the lineage report.",
    accent: "from-violet-500/30 to-purple-500/30",
  },
  {
    title: "Cryptographic sealing",
    description: "Final submissions are signed as secure bundles, making offline edits immediately visible in the verifier.",
    accent: "from-emerald-500/30 to-teal-500/30",
  },
  {
    title: "Public trust certificates",
    description: "Writers can share human-authorship certificates with professors, editors, publishers, and readers.",
    accent: "from-orange-500/30 to-amber-500/30",
  },
];

export const pricingTiers = [
  { name: "Writer", price: "$19", description: "For independent creators and freelance pitches", features: ["Human-authorship certificates", "Secure export bundles", "Public verifier links"] },
  { name: "Institutional", price: "$2,400", description: "For academic departments and campuses", features: ["LMS dropboxes", "Assignment replay reports", "SSO and FERPA controls"] },
  { name: "Publisher", price: "Custom", description: "For editorial teams and high-volume verification", features: ["Pitch queues", "Embeddable trust badges", "Advanced review policy controls"] },
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
  { label: "Signature", value: "Platform key valid" },
  { label: "Raw text hash", value: "Matched" },
  { label: "Offline tamper check", value: "Passed" },
  { label: "Lineage confidence", value: "High" },
];

export const publisherPitches = [
  { title: "Allegory of the Edge", writer: "Mira S.", status: "Human-authored", score: 97 },
  { title: "The Quiet Infrastructure", writer: "Eli B.", status: "Human-authored", score: 94 },
  { title: "Weathering the Long Shift", writer: "Rae K.", status: "Needs lineage review", score: 81 },
];
