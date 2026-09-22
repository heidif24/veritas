import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { buildWindowHashes } from "./plagiarism/chunker";

const dbDir = path.join(process.cwd(), "data");
fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, "veritas.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sector TEXT NOT NULL DEFAULT 'Education',
    organization_type TEXT NOT NULL DEFAULT 'UNIVERSITY',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    organization_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    document_type TEXT NOT NULL DEFAULT 'essay',
    owner_id TEXT NOT NULL,
    organization_id TEXT,
    sealed_hash TEXT,
    sealed_signature TEXT,
    telemetry_json TEXT,
    references_json TEXT NOT NULL DEFAULT '[]',
    integrity_status TEXT NOT NULL DEFAULT 'verified',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS document_revisions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    references_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );

  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actor_id TEXT,
    document_id TEXT,
    FOREIGN KEY (actor_id) REFERENCES users(id),
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );

  CREATE TABLE IF NOT EXISTS plagiarism_checks (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    organization_id TEXT,
    overall_score INTEGER NOT NULL DEFAULT 0,
    matched_segments_json TEXT NOT NULL DEFAULT '[]',
    checked_words INTEGER NOT NULL DEFAULT 0,
    provider TEXT NOT NULL DEFAULT 'institutional-index',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS plagiarism_chunks (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    hash TEXT NOT NULL,
    window_index INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (document_id, hash, window_index),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE INDEX IF NOT EXISTS plagiarism_chunks_lookup ON plagiarism_chunks (organization_id, hash);
`);

for (const statement of [
  "ALTER TABLE organizations ADD COLUMN sector TEXT NOT NULL DEFAULT 'Education'",
  "ALTER TABLE organizations ADD COLUMN organization_type TEXT NOT NULL DEFAULT 'UNIVERSITY'",
  "ALTER TABLE documents ADD COLUMN sealed_signature TEXT",
  "ALTER TABLE documents ADD COLUMN telemetry_json TEXT",
  "ALTER TABLE documents ADD COLUMN references_json TEXT NOT NULL DEFAULT '[]'",
  "CREATE TABLE IF NOT EXISTS document_revisions (id TEXT PRIMARY KEY, document_id TEXT NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, references_json TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (document_id) REFERENCES documents(id))",
]) {
  try {
    db.exec(statement);
  } catch {
    // Existing installations already have the column.
  }
}

export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT" | "PUBLISHER";

export type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
  sector: string;
  organization_type: string;
  created_at: string;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  organization_id: string | null;
  created_at: string;
};

export type SessionRow = {
  id: string;
  token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
};

export type DocumentRow = {
  id: string;
  title: string;
  content: string;
  status: string;
  document_type: string;
  owner_id: string;
  organization_id: string | null;
  sealed_hash: string | null;
  sealed_signature: string | null;
  telemetry_json: string | null;
  references_json: string;
  integrity_status: string;
  created_at: string;
  updated_at: string;
};

export type PlagiarismCheckRow = {
  id: string;
  document_id: string;
  organization_id: string | null;
  overall_score: number;
  matched_segments_json: string;
  checked_words: number;
  provider: string;
  created_at: string;
};

export function getDb() {
  return db;
}

export function getUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
}

export function getUserById(id: string) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
}

export function getOrganizationBySlug(slug: string) {
  return db.prepare("SELECT * FROM organizations WHERE slug = ?").get(slug) as OrganizationRow | undefined;
}

export function getSessionByToken(token: string) {
  return db.prepare("SELECT * FROM sessions WHERE token = ?").get(token) as SessionRow | undefined;
}

export function createSession(token: string, userId: string, expiresAt: Date) {
  const id = cryptoRandomId();
  db.prepare("INSERT INTO sessions (id, token, user_id, expires_at) VALUES (?, ?, ?, ?)").run(id, token, userId, expiresAt.toISOString());
}

export function deleteSessionByToken(token: string) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function createUser(input: { name: string; email: string; passwordHash: string; role: Role; organizationId?: string | null }): UserRow {
  const id = cryptoRandomId();
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, organization_id) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, input.name, input.email, input.passwordHash, input.role, input.organizationId ?? null);
  const created = getUserById(id);
  if (!created) {
    throw new Error("Failed to create user");
  }
  return created;
}

export function createOrganization(name: string, slug: string, sector = "Education", organizationType = "UNIVERSITY"): OrganizationRow {
  const id = cryptoRandomId();
  db.prepare("INSERT INTO organizations (id, name, slug, sector, organization_type) VALUES (?, ?, ?, ?, ?)").run(id, name, slug, sector, organizationType);
  const created = getOrganizationBySlug(slug);
  if (!created) {
    throw new Error("Failed to create organization");
  }
  return created;
}

export function listDocumentsForUser(user: { id: string; role: Role; organizationId?: string | null }) {
  if (user.role === "ADMIN") {
    return db.prepare("SELECT * FROM documents WHERE organization_id = ? ORDER BY updated_at DESC").all(user.organizationId ?? "") as DocumentRow[];
  }
  return db.prepare("SELECT * FROM documents WHERE owner_id = ? ORDER BY updated_at DESC").all(user.id) as DocumentRow[];
}

export function getDocumentById(id: string) {
  return db.prepare("SELECT * FROM documents WHERE id = ?").get(id) as DocumentRow | undefined;
}

export function createDocument(input: { title: string; content: string; status: string; documentType: string; ownerId: string; organizationId?: string | null; }): DocumentRow {
  const id = cryptoRandomId();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO documents (id, title, content, status, document_type, owner_id, organization_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(id, input.title, input.content, input.status, input.documentType, input.ownerId, input.organizationId ?? null, now, now);
  const created = getDocumentById(id);
  if (!created) {
    throw new Error("Failed to create document");
  }
  return created;
}

export function createDocumentRevision(documentId: string, title: string, content: string, references: unknown[] = []) {
  const id = cryptoRandomId();
  db.prepare(
    "INSERT INTO document_revisions (id, document_id, title, content, references_json) VALUES (?, ?, ?, ?, ?)",
  ).run(id, documentId, title, content, JSON.stringify(references));
  return { id };
}

export function listDocumentRevisions(documentId: string) {
  return db.prepare("SELECT * FROM document_revisions WHERE document_id = ? ORDER BY created_at DESC").all(documentId) as Array<{
    id: string;
    document_id: string;
    title: string;
    content: string;
    references_json: string;
    created_at: string;
  }>;
}

export function createPlagiarismCheck(input: {
  documentId: string;
  organizationId?: string | null;
  overallScore: number;
  matchedSegments: unknown[];
  checkedWords: number;
  provider: string;
}) {
  const id = cryptoRandomId();
  db.prepare(
    "INSERT INTO plagiarism_checks (id, document_id, organization_id, overall_score, matched_segments_json, checked_words, provider) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(
    id,
    input.documentId,
    input.organizationId ?? null,
    input.overallScore,
    JSON.stringify(input.matchedSegments),
    input.checkedWords,
    input.provider,
  );
  return id;
}

export function listSubmittedDocumentsForOrganization(organizationId: string) {
  return db.prepare(
    "SELECT * FROM documents WHERE organization_id = ? AND status = 'submitted' ORDER BY updated_at DESC",
  ).all(organizationId) as DocumentRow[];
}

export function replacePlagiarismChunks(documentId: string, organizationId: string, hashes: string[]) {
  const replace = db.transaction(() => {
    db.prepare("DELETE FROM plagiarism_chunks WHERE document_id = ?").run(documentId);
    const insert = db.prepare(
      "INSERT OR IGNORE INTO plagiarism_chunks (id, document_id, organization_id, hash, window_index) VALUES (?, ?, ?, ?, ?)",
    );
    hashes.forEach((hash, index) => insert.run(cryptoRandomId(), documentId, organizationId, hash, index));
  });
  replace();
}

export function backfillSubmittedPlagiarismChunks() {
  const submitted = db.prepare(
    "SELECT id, organization_id, content FROM documents WHERE status = 'submitted' AND organization_id IS NOT NULL",
  ).all() as Array<{ id: string; organization_id: string; content: string }>;

  for (const document of submitted) {
    replacePlagiarismChunks(document.id, document.organization_id, buildWindowHashes(document.content, 5));
  }
}

export function listSubmittedDocumentsByHashes(organizationId: string, hashes: string[]) {
  if (!hashes.length) return [] as DocumentRow[];

  const placeholders = hashes.map(() => "?").join(", ");
  return db.prepare(
    `SELECT DISTINCT documents.* FROM documents INNER JOIN plagiarism_chunks ON plagiarism_chunks.document_id = documents.id WHERE documents.organization_id = ? AND documents.status = 'submitted' AND plagiarism_chunks.organization_id = ? AND plagiarism_chunks.hash IN (${placeholders}) ORDER BY documents.updated_at DESC`,
  ).all(organizationId, organizationId, ...hashes) as DocumentRow[];
}

export function updateDocument(id: string, updates: Partial<{
  title: string;
  content: string;
  status: string;
  documentType: string;
  sealedHash: string;
  sealedSignature: string;
  telemetryJson: string;
  references: unknown[];
  integrityStatus: string;
}>) {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.content !== undefined) {
    fields.push("content = ?");
    values.push(updates.content);
  }
  if (updates.status !== undefined) {
    fields.push("status = ?");
    values.push(updates.status);
  }
  if (updates.documentType !== undefined) {
    fields.push("document_type = ?");
    values.push(updates.documentType);
  }
  if (updates.sealedHash !== undefined) {
    fields.push("sealed_hash = ?");
    values.push(updates.sealedHash);
  }
  if (updates.sealedSignature !== undefined) {
    fields.push("sealed_signature = ?");
    values.push(updates.sealedSignature);
  }
  if (updates.telemetryJson !== undefined) {
    fields.push("telemetry_json = ?");
    values.push(updates.telemetryJson);
  }
  if (updates.references !== undefined) {
    fields.push("references_json = ?");
    values.push(JSON.stringify(updates.references));
  }
  if (updates.integrityStatus !== undefined) {
    fields.push("integrity_status = ?");
    values.push(updates.integrityStatus);
  }

  fields.push("updated_at = ?");
  values.push(new Date().toISOString(), id);

  db.prepare(`UPDATE documents SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return getDocumentById(id);
}

export function countRows(table: "users" | "documents" | "organizations") {
  return db.prepare(`SELECT COUNT(*) as total FROM ${table}`).get() as { total: number };
}

export function getAdminOverview() {
  const users = countRows("users");
  const documents = countRows("documents");
  const organizations = countRows("organizations");
  return {
    users: users.total,
    documents: documents.total,
    organizations: organizations.total,
    verificationRate: "97.8%",
  };
}

function normalizeUser(row: UserRow | undefined) {
  if (!row) return null;

  return {
    ...row,
    passwordHash: row.password_hash,
    organizationId: row.organization_id,
    createdAt: new Date(row.created_at),
  };
}

function normalizeSession(row: SessionRow | undefined, user?: ReturnType<typeof normalizeUser>) {
  if (!row) return null;

  return {
    ...row,
    userId: row.user_id,
    expiresAt: new Date(row.expires_at),
    createdAt: new Date(row.created_at),
    user,
  };
}

function normalizeDocument(row: DocumentRow | undefined) {
  if (!row) return null;

  return {
    ...row,
    ownerId: row.owner_id,
    organizationId: row.organization_id,
    documentType: row.document_type,
    sealedHash: row.sealed_hash,
    sealedSignature: row.sealed_signature,
    telemetryJson: row.telemetry_json,
    references: JSON.parse(row.references_json || "[]"),
    integrityStatus: row.integrity_status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const prisma = {
  organization: {
    async findMany() {
      return db.prepare("SELECT * FROM organizations ORDER BY created_at DESC").all() as OrganizationRow[];
    },
    async count() {
      return countRows("organizations").total;
    },
  },
  user: {
    async findUnique({ where }: { where?: { email?: string; id?: string } } = {}) {
      if (!where) return null;
      if (where.email) return normalizeUser(getUserByEmail(where.email));
      if (where.id) return normalizeUser(getUserById(where.id));
      return null;
    },
    async count() {
      return countRows("users").total;
    },
  },
  session: {
    async findUnique({ where, include }: { where?: { token?: string; id?: string }; include?: { user?: boolean } } = {}) {
      if (!where) return null;
      const row = where.token ? getSessionByToken(where.token) : undefined;
      if (!row) return null;
      const user = include?.user ? normalizeUser(getUserById(row.user_id)) : undefined;
      return normalizeSession(row, user);
    },
    async create({ data }: { data: { token: string; userId: string; expiresAt: Date } }) {
      createSession(data.token, data.userId, data.expiresAt);
      const created = getSessionByToken(data.token);
      return normalizeSession(created, normalizeUser(getUserById(data.userId)) ?? undefined);
    },
    async deleteMany({ where }: { where: { token?: string } }) {
      if (where.token) {
        deleteSessionByToken(where.token);
      }
      return { count: 1 };
    },
  },
  document: {
    async findMany({ where, orderBy, include }: { where?: { organizationId?: string | null; ownerId?: string }; orderBy?: { updatedAt?: "desc" | "asc" }; include?: { owner?: boolean } } = {}) {
      let rows: DocumentRow[] = [];

      if (where && typeof where.ownerId === "string") {
        rows = db.prepare("SELECT * FROM documents WHERE owner_id = ? ORDER BY updated_at DESC").all(where.ownerId) as DocumentRow[];
      } else if (where && Object.prototype.hasOwnProperty.call(where, "organizationId")) {
        rows = db.prepare("SELECT * FROM documents WHERE organization_id = ? ORDER BY updated_at DESC").all(where.organizationId ?? "") as DocumentRow[];
      } else {
        rows = db.prepare("SELECT * FROM documents ORDER BY updated_at DESC").all() as DocumentRow[];
      }

      if (orderBy?.updatedAt) {
        const dir = orderBy.updatedAt === "asc" ? 1 : -1;
        rows = [...rows].sort((a, b) => dir * (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()));
      }

      return rows.map((row) => {
        const doc = normalizeDocument(row);
        if (!doc) return null;
        return include?.owner ? { ...doc, owner: normalizeUser(getUserById(doc.ownerId)) } : doc;
      }).filter(Boolean);
    },
    async findUnique({ where, include }: { where: { id: string }; include?: { owner?: boolean } }) {
      const row = getDocumentById(where.id);
      if (!row) return null;
      const doc = normalizeDocument(row);
      if (!doc) return null;
      return include?.owner ? { ...doc, owner: normalizeUser(getUserById(doc.ownerId)) } : doc;
    },
    async create({ data }: { data: { title: string; content: string; status?: string; documentType?: string; ownerId: string; organizationId?: string | null } }) {
      const created = createDocument({
        title: data.title,
        content: data.content,
        status: data.status ?? "draft",
        documentType: data.documentType ?? "essay",
        ownerId: data.ownerId,
        organizationId: data.organizationId ?? null,
      });
      return normalizeDocument(created);
    },
    async update({ where, data }: { where: { id: string }; data: Record<string, unknown> }) {
      const current = getDocumentById(where.id);
      if (!current) return null;

          const next = updateDocument(where.id, {
        title: typeof data.title === "string" ? data.title : undefined,
        content: typeof data.content === "string" ? data.content : undefined,
        status: typeof data.status === "string" ? data.status : undefined,
        documentType: typeof data.documentType === "string" ? data.documentType : undefined,
        sealedHash: typeof data.sealedHash === "string" ? data.sealedHash : undefined,
        integrityStatus: typeof data.integrityStatus === "string" ? data.integrityStatus : undefined,
        sealedSignature: typeof data.sealedSignature === "string" ? data.sealedSignature : undefined,
        telemetryJson: typeof data.telemetryJson === "string" ? data.telemetryJson : undefined,
        references: Array.isArray(data.references) ? data.references : undefined,
      });
      return normalizeDocument(next);
    },
    async count() {
      return countRows("documents").total;
    },
  },
  documentRevision: {
    async findMany({ where }: { where: { documentId: string } }) {
      return listDocumentRevisions(where.documentId);
    },
  },
};

function cryptoRandomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function seedDemoData() {
  const organization = getOrganizationBySlug("veritas-labs");
  if (!organization) {
    const org = createOrganization("Veritas Labs", "veritas-labs");

    const admin = createUser({
      name: "Avery Stone",
      email: "admin@veritas.io",
      passwordHash: bcrypt.hashSync("admin123", 10),
      role: "ADMIN",
      organizationId: org.id,
    });

    const instructor = createUser({
      name: "Dr. Nia Ross",
      email: "instructor@veritas.io",
      passwordHash: bcrypt.hashSync("instructor123", 10),
      role: "INSTRUCTOR",
      organizationId: org.id,
    });

    const student = createUser({
      name: "Milo Hart",
      email: "student@veritas.io",
      passwordHash: bcrypt.hashSync("student123", 10),
      role: "STUDENT",
      organizationId: org.id,
    });

    createDocument({
      title: "Existentialism and Choice",
      content: "The authentic writer is not defined by the speed of output but by the discipline of revision. A living argument is built under pressure, uncertainty, and the willingness to admit complexity.",
      status: "submitted",
      documentType: "essay",
      ownerId: student.id,
      organizationId: org.id,
    });

    return { org, admin, instructor, student };
  }

  return { organization };
}

seedDemoData();
backfillSubmittedPlagiarismChunks();
