"use client";

import { useMemo, useState } from "react";

const initialDraft = `Leadership teams are judged not only by the decisions they make, but by the rigor with which those decisions are documented, reviewed, and defended.

This briefing outlines the operating risks, stakeholder expectations, and approval pathways required to move from concept to execution. It is not enough to state the objective; teams must also demonstrate the review logic that shaped the final version.

The purpose of a trusted brief is clarity under pressure. Each section should capture the context, the decision, the evidence behind it, and the accountability chain that makes the outcome defensible to both internal and external stakeholders.`;

type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending";
};

type ReferenceItem = {
  id: string;
  title: string;
  type: string;
  note: string;
  status: "Saved" | "Quoted" | "Cited" | "Needs check";
  pages: string;
};

const initialCollaborators: Collaborator[] = [
  { id: "1", name: "Ava Lee", email: "ava@northbridge.edu", role: "Owner", status: "active" },
  { id: "2", name: "Noah Singh", email: "noah@northbridge.edu", role: "Reviewer", status: "active" },
];

const initialReferences: ReferenceItem[] = [
  {
    id: "ref-1",
    title: "Academic Integrity Framework",
    type: "Policy",
    note: "Core standard for traceability and submission accountability.",
    status: "Cited",
    pages: "pp. 12-18",
  },
  {
    id: "ref-2",
    title: "Review Practices in Higher Education",
    type: "Journal",
    note: "Useful for framing fair, transparent review workflows.",
    status: "Quoted",
    pages: "pp. 34-41",
  },
  {
    id: "ref-3",
    title: "Evidence and Defensibility in Writing",
    type: "Book",
    note: "Supports the argument around review trails and accountability.",
    status: "Needs check",
    pages: "pp. 63-72",
  },
];

const documentSections = ["Introduction", "Context", "Evidence", "Conclusion"];

export default function EditorPage({ params }: { params: { id: string } }) {
  const [draft, setDraft] = useState(initialDraft);
  const [activeTab, setActiveTab] = useState("Draft");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const [references, setReferences] = useState<ReferenceItem[]>(initialReferences);

  const draftHealth = useMemo(() => {
    const words = draft.trim().split(/\s+/).length;
    const chars = draft.length;
    return Math.min(98, Math.max(72, Math.round((chars / Math.max(words, 1)) * 4 + 64)));
  }, [draft]);

  const citedCount = references.filter((item) => item.status === "Cited").length;
  const title = decodeURIComponent(params.id).replace(/-/g, " ");

  function handleInvite() {
    const trimmedEmail = inviteEmail.trim();
    if (!trimmedEmail) {
      setInviteMessage("Enter an email to send the invitation.");
      return;
    }

    const exists = collaborators.some(
      (person) => person.email.toLowerCase() === trimmedEmail.toLowerCase(),
    );

    if (exists) {
      setInviteMessage("This person is already part of this document.");
      return;
    }

    const inviteLink = `https://veritas.local/invite?doc=${encodeURIComponent(params.id)}&email=${encodeURIComponent(trimmedEmail)}`;
    setCollaborators((current) => [
      {
        id: `pending-${Date.now()}`,
        name: "Pending invite",
        email: trimmedEmail,
        role: "Collaborator",
        status: "pending",
      },
      ...current,
    ]);
    setInviteEmail("");
    setInviteMessage(`Invite link prepared for ${trimmedEmail}. Share this link to let them join this document only: ${inviteLink}`);
  }

  function acceptInvite(email: string) {
    setCollaborators((current) =>
      current.map((person) =>
        person.email.toLowerCase() === email.toLowerCase() && person.status === "pending"
          ? { ...person, name: person.email.split("@")[0], role: "Contributor", status: "active" }
          : person,
      ),
    );
    setInviteMessage(`Confirmed: ${email} has been added to this document.`);
  }

  function updateReferenceStatus(id: string, status: ReferenceItem["status"]) {
    setReferences((current) =>
      current.map((ref) => (ref.id === id ? { ...ref, status } : ref)),
    );
  }

  const tabs = ["Draft", "Notes", "References", "Review"];

  return (
    <div className="min-h-screen bg-[#050b16] px-4 py-6 text-slate-100 md:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 rounded-[26px] border border-white/10 bg-slate-900/80 px-4 py-4 shadow-2xl shadow-cyan-950/10 backdrop-blur-sm md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200">Academic writing workspace</p>
              <h1 className="mt-2 text-2xl font-black text-white md:text-3xl">{title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFocusMode((current) => !current)}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {focusMode ? "Exit focus" : "Focus mode"}
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                Save
              </button>
              <button className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
                Submit
              </button>
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-3 py-1.5 ${activeTab === tab ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-slate-900/70 text-slate-300"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[220px_1.5fr_320px]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Structure</p>
            <div className="mt-4 space-y-2">
              {documentSections.map((section, index) => (
                <button
                  key={section}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${index === 0 ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-slate-950/40 text-slate-300"}`}
                >
                  <span>{section}</span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{index + 1}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Progress</p>
              <div className="mt-3 text-2xl font-black text-white">{draftHealth}%</div>
              <div className="mt-3 h-2.5 rounded-full bg-slate-800">
                <span className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${draftHealth}%` }} />
              </div>
            </div>
          </aside>

          <section className={`rounded-[28px] border border-white/10 bg-slate-900/75 p-4 ${focusMode ? "xl:col-span-2" : ""}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                <span>Draft</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{draft.length} chars</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{draft.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>

              <div className="flex gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-slate-200">B</button>
                <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-slate-200 italic">I</button>
                <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-slate-200">•</button>
                <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-slate-200">1.</button>
              </div>
            </div>

            {activeTab === "Draft" ? (
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="h-[620px] w-full resize-none rounded-[22px] border border-white/10 bg-slate-950/60 p-5 text-base leading-8 text-slate-100 outline-none ring-0 placeholder:text-slate-500"
                placeholder="Write your document here..."
              />
            ) : activeTab === "Notes" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Working notes</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                    <li>• Clarify the decision context before the recommendation section.</li>
                    <li>• Include evidence of review accountability in the final summary.</li>
                    <li>• Keep the outcome measurable and defensible to stakeholders.</li>
                  </ul>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Reflection</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Keep the writing clear and direct. The document should explain why the decision was made, what was reviewed, and how this outcome can be defended when others check the record.
                  </p>
                </div>
              </div>
            ) : activeTab === "References" ? (
              <div className="space-y-4">
                {references.map((reference) => (
                  <div key={reference.id} className="rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">{reference.title}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">{reference.type} • {reference.pages}</p>
                      </div>
                      <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-cyan-200">
                        {reference.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{reference.note}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(["Saved", "Quoted", "Cited", "Needs check"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateReferenceStatus(reference.id, status)}
                          className={`rounded-full border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.14em] ${reference.status === status ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-slate-900/70 text-slate-300"}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Checklist</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                    <li>• Evidence is clearly connected to conclusions.</li>
                    <li>• The argument stays focused and verifiable.</li>
                    <li>• Each claim has a traceable reference or note.</li>
                  </ul>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Outcome</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Final review is ready when the argument is accurate, aligned to evidence, and clearly supported by the reference list.
                  </p>
                </div>
              </div>
            )}
          </section>

          {!focusMode ? (
            <aside className="space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Status</p>
                <div className="mt-4 text-4xl font-black text-white">{draftHealth}%</div>
                <div className="mt-4 h-2.5 rounded-full bg-slate-800">
                  <span className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${draftHealth}%` }} />
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between"><span>Draft</span><span className="font-semibold text-white">{draftHealth}%</span></div>
                  <div className="flex items-center justify-between"><span>References</span><span className="font-semibold text-white">{citedCount}/{references.length}</span></div>
                  <div className="flex items-center justify-between"><span>Review trail</span><span className="font-semibold text-white">Ready</span></div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Add collaborator</p>
                <div className="mt-4 flex gap-2">
                  <input
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    type="email"
                    placeholder="Colleague email"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
                  />
                  <button type="button" onClick={handleInvite} className="rounded-xl bg-cyan-400 px-3 py-2.5 text-sm font-bold text-slate-950">
                    Invite
                  </button>
                </div>

                {inviteMessage ? (
                  <div className="mt-3 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-3 text-xs leading-6 text-cyan-100">
                    {inviteMessage}
                  </div>
                ) : null}

                <div className="mt-5 space-y-3">
                  {collaborators.map((person) => (
                    <div key={person.id} className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">{person.name}</p>
                          <p className="text-[11px] text-slate-400">{person.email}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-[9px] uppercase tracking-[0.14em] ${person.status === "active" ? "bg-emerald-500/10 text-emerald-200" : "bg-amber-500/10 text-amber-200"}`}
                        >
                          {person.status}
                        </span>
                      </div>

                      {person.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => acceptInvite(person.email)}
                          className="mt-3 w-full rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100"
                        >
                          Accept invite
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
