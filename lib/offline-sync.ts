/**
 * Offline / unstable network resilience.
 * Client stores drafts in localStorage; server accepts last-write-wins with updatedAt.
 */

export type LocalDraft = {
  documentId: string;
  title: string;
  content: string;
  header?: string;
  footer?: string;
  updatedAt: string;
  clientId: string;
};

export const LOCAL_DRAFT_KEY = "veritas.local.drafts.v1";

export function mergeDraft(server: { content: string; updatedAt: string; title: string }, local: LocalDraft) {
  const serverTime = new Date(server.updatedAt).getTime();
  const localTime = new Date(local.updatedAt).getTime();
  if (localTime > serverTime) {
    return { title: local.title, content: local.content, source: "local" as const };
  }
  return { title: server.title, content: server.content, source: "server" as const };
}
