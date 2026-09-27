/** Point this at your deployed Veritas API (or local dev machine). */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

export type Document = {
  id: string;
  title: string;
  content: string;
  status: string;
  references?: unknown[];
};

let sessionCookie: string | null = null;

export function setSessionCookie(cookie: string | null) {
  sessionCookie = cookie;
}

export function getSessionCookie() {
  return sessionCookie;
}

async function request(path: string, method: string, body?: object): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (sessionCookie) headers.Cookie = sessionCookie;
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    sessionCookie = setCookie.split(";")[0];
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data;
}

export async function login(email: string, password: string) {
  return request("/api/auth/login", "POST", { email, password });
}

export async function listDocuments(): Promise<Document[]> {
  const data = (await request("/api/documents", "GET")) as { documents?: Document[] };
  return data.documents ?? [];
}

export async function saveDocument(
  id: string,
  payload: { title: string; content: string; references?: unknown[] },
): Promise<Document> {
  const data = (await request(`/api/documents/${id}`, "PATCH", payload)) as {
    document: Document;
  };
  return data.document;
}

export async function sealDocument(id: string) {
  return request(`/api/documents/${id}/seal`, "POST", {
    telemetry: { client: "react-native" },
  });
}
