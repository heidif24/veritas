import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { buildWindowHashes } from "@/lib/plagiarism/chunker";

// Lazy init: better-sqlite3 is a native addon. Opening it at module load
// causes SIGSEGV during Next.js "Collecting page data" on Vercel builds.
let _db: Database.Database | null = null;

function ensureColumn(db: Database.Database, tableName: string, columnName: string, definition: string) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  if (!columns.some((column) => column.name === columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN "${columnName}" ${definition};`);
  }
}

export function getDb(): Database.Database {
  if (_db) return _db;

  // On Vercel the filesystem is read-only except /tmp (ephemeral per instance).
  // Locally keep the original data/ path so structure and behaviour stay the same.
  const dbDir = process.env.VERCEL
    ? path.join("/tmp", "veritas-data")
    : path.join(process.cwd(), "data");
  fs.mkdirSync(dbDir, { recursive: true });

  const db = new Database(path.join(dbDir, "veritas.db"));
  db.pragma("journal_mode = WAL");

  db.exec(`
  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    domain TEXT,
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
    integrity_status TEXT NOT NULL DEFAULT 'verified',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    join_code TEXT NOT NULL,
    instructor_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, user_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT,
    paste_threshold REAL NOT NULL DEFAULT 0.15,
    similarity_threshold REAL NOT NULL DEFAULT 0.25,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    assignment_id TEXT NOT NULL,
    document_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    health_score REAL,
    similarity_score REAL,
    sealed_hash TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS corpus (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    title TEXT NOT NULL,
    source_url TEXT,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS tenant_keys (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL UNIQUE,
    public_key_pem TEXT NOT NULL,
    private_key_pem TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS tenant_settings (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL UNIQUE,
    branding_json TEXT,
    lti_config TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
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

  CREATE TABLE IF NOT EXISTS document_revisions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "references" TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );

  CREATE TABLE IF NOT EXISTS plagiarism_checks (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    overall_score REAL NOT NULL DEFAULT 0,
    matched_segments TEXT NOT NULL DEFAULT '[]',
    checked_words INTEGER NOT NULL DEFAULT 0,
    provider TEXT NOT NULL DEFAULT 'institutional-submission-index',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );
`);

  ensureColumn(db, "organizations", "domain", "TEXT");
  ensureColumn(db, "documents", "references", "TEXT NOT NULL DEFAULT '[]'");
  ensureColumn(db, "documents", "sealed_signature", "TEXT");
  ensureColumn(db, "documents", "telemetry_json", "TEXT DEFAULT '{}'");

  _db = db;
  try {
    seedDemoData();
  } catch (e) {
    console.error("seedDemoData failed", e);
  }
  return _db;
}

export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT" | "PUBLISHER";

export type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  organization_type?: string | null;
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
  integrity_status: string;
  references?: string | null;
  created_at: string;
  updated_at: string;
};

export function getUserByEmail(email: string) {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
}

export function getUserById(id: string) {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
}

export function getOrganizationBySlug(slug: string) {
  return getDb().prepare("SELECT * FROM organizations WHERE slug = ?").get(slug) as OrganizationRow | undefined;
}

export function getOrganizationById(id: string) {
  return getDb().prepare("SELECT * FROM organizations WHERE id = ?").get(id) as OrganizationRow | undefined;
}

export function getSessionByToken(token: string) {
  return getDb().prepare("SELECT * FROM sessions WHERE token = ?").get(token) as SessionRow | undefined;
}

export function createSession(token: string, userId: string, expiresAt: Date) {
  const id = cryptoRandomId();
  getDb().prepare("INSERT INTO sessions (id, token, user_id, expires_at) VALUES (?, ?, ?, ?)").run(id, token, userId, expiresAt.toISOString());
}

export function deleteSessionByToken(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function createUser(input: { name: string; email: string; passwordHash: string; role: Role; organizationId?: string | null }): UserRow {
  const id = cryptoRandomId();
  getDb().prepare(
    "INSERT INTO users (id, name, email, password_hash, role, organization_id) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, input.name, input.email, input.passwordHash, input.role, input.organizationId ?? null);
  const created = getUserById(id);
  if (!created) {
    throw new Error("Failed to create user");
  }
  return created;
}

export function createOrganization(name: string, slug: string, domain?: string | null, _organizationType?: string | null): OrganizationRow {
  const id = cryptoRandomId();
  getDb().prepare("INSERT INTO organizations (id, name, slug, domain) VALUES (?, ?, ?, ?)").run(id, name, slug, domain ?? null);
  const created = getOrganizationBySlug(slug);
  if (!created) {
    throw new Error("Failed to create organization");
  }
  return created;
}

export function createCourse(input: { organizationId: string; title: string; code: string; joinCode: string; instructorId: string }) {
  const id = cryptoRandomId();
  getDb().prepare(
    "INSERT INTO courses (id, organization_id, title, code, join_code, instructor_id) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, input.organizationId, input.title, input.code, input.joinCode, input.instructorId);
  return getDb().prepare("SELECT * FROM courses WHERE id = ?").get(id) as Record<string, unknown> | undefined;
}

export function createAssignment(input: { courseId: string; title: string; instructions?: string; pasteThreshold?: number; similarityThreshold?: number }) {
  const id = cryptoRandomId();
  getDb().prepare(
    "INSERT INTO assignments (id, course_id, title, instructions, paste_threshold, similarity_threshold) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, input.courseId, input.title, input.instructions ?? "", input.pasteThreshold ?? 0.15, input.similarityThreshold ?? 0.25);
  return getDb().prepare("SELECT * FROM assignments WHERE id = ?").get(id) as Record<string, unknown> | undefined;
}

export function createSubmission(input: { assignmentId: string; documentId: string; authorId: string; status?: string; healthScore?: number; similarityScore?: number; sealedHash?: string }) {
  const id = cryptoRandomId();
  getDb().prepare(
    "INSERT INTO submissions (id, assignment_id, document_id, author_id, status, health_score, similarity_score, sealed_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(id, input.assignmentId, input.documentId, input.authorId, input.status ?? "submitted", input.healthScore ?? 0, input.similarityScore ?? 0, input.sealedHash ?? null);
  return getDb().prepare("SELECT * FROM submissions WHERE id = ?").get(id) as Record<string, unknown> | undefined;
}

export function createCorpusEntry(input: { organizationId: string; title: string; sourceUrl?: string; body: string }) {
  const id = cryptoRandomId();
  getDb().prepare("INSERT INTO corpus (id, organization_id, title, source_url, body) VALUES (?, ?, ?, ?, ?)").run(
    id,
    input.organizationId,
    input.title,
    input.sourceUrl ?? null,
    input.body,
  );
  return getDb().prepare("SELECT * FROM corpus WHERE id = ?").get(id) as Record<string, unknown> | undefined;
}

export function listDocumentsForUser(user: { id: string; role: Role; organizationId?: string | null }) {
  if (user.role === "ADMIN") {
    return getDb().prepare("SELECT * FROM documents WHERE organization_id = ? ORDER BY updated_at DESC").all(user.organizationId ?? "") as DocumentRow[];
  }
  return getDb().prepare("SELECT * FROM documents WHERE owner_id = ? ORDER BY updated_at DESC").all(user.id) as DocumentRow[];
}

export function getDocumentById(id: string) {
  return getDb().prepare("SELECT * FROM documents WHERE id = ?").get(id) as DocumentRow | undefined;
}

export function createDocument(input: { title: string; content: string; status: string; documentType: string; ownerId: string; organizationId?: string | null; }): DocumentRow {
  const id = cryptoRandomId();
  const now = new Date().toISOString();
  getDb().prepare(
    "INSERT INTO documents (id, title, content, status, document_type, owner_id, organization_id, \"references\", created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(id, input.title, input.content, input.status, input.documentType, input.ownerId, input.organizationId ?? null, JSON.stringify([]), now, now);
  const created = getDocumentById(id);
  if (!created) {
    throw new Error("Failed to create document");
  }
  return created;
}

export function createDocumentRevision(documentId: string, title: string, content: string, references: unknown[] = []) {
  const id = cryptoRandomId();
  getDb().prepare(
    "INSERT INTO document_revisions (id, document_id, title, content, \"references\") VALUES (?, ?, ?, ?, ?)",
  ).run(id, documentId, title, content, JSON.stringify(references ?? []));
  return { id, documentId, title, content, references };
}

export function createPlagiarismCheck(input: { documentId: string; organizationId: string; overallScore: number; matchedSegments: unknown[]; checkedWords: number; provider: string }) {
  const id = cryptoRandomId();
  getDb().prepare(
    "INSERT INTO plagiarism_checks (id, document_id, organization_id, overall_score, matched_segments, checked_words, provider) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(
    id,
    input.documentId,
    input.organizationId,
    input.overallScore,
    JSON.stringify(input.matchedSegments ?? []),
    input.checkedWords,
    input.provider,
  );
  return { id, ...input };
}

export function listSubmittedDocumentsByHashes(organizationId: string, hashes: string[]) {
  const rows = getDb().prepare("SELECT id, title, content FROM documents WHERE organization_id = ? AND status = 'submitted' ORDER BY updated_at DESC").all(organizationId) as Array<{ id: string; title: string; content: string }>;
  if (!hashes.length) return rows;

  const hashSet = new Set(hashes);
  return rows.filter((row) => {
    const rowHashes = new Set(buildWindowHashes(row.content, 5));
    return [...hashSet].some((hash) => rowHashes.has(hash));
  });
}

export function updateDocument(id: string, updates: Partial<{ title: string; content: string; status: string; documentType: string; sealedHash: string; integrityStatus: string; references: unknown[] }>) {
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
  if (updates.integrityStatus !== undefined) {
    fields.push("integrity_status = ?");
    values.push(updates.integrityStatus);
  }
  if (updates.references !== undefined) {
    fields.push("\"references\" = ?");
    values.push(JSON.stringify(updates.references ?? []));
  }

  fields.push("updated_at = ?");
  values.push(new Date().toISOString(), id);

  getDb().prepare(`UPDATE documents SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return getDocumentById(id);
}

export function countRows(table: "users" | "documents" | "organizations") {
  return getDb().prepare(`SELECT COUNT(*) as total FROM ${table}`).get() as { total: number };
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
    integrityStatus: row.integrity_status,
    references: Array.isArray(JSON.parse(row.references ?? "[]")) ? JSON.parse(row.references ?? "[]") : [],
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const prisma = {
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
    async count() {
      return countRows("documents").total;
    },
    async findMany({
      where,
      orderBy,
      include,
    }: {
      where?: { organizationId?: string | null; ownerId?: string };
      orderBy?: { updatedAt?: "desc" | "asc" };
      include?: { owner?: boolean };
    } = {}) {
      let rows: DocumentRow[] = [];
      if (where && typeof where.ownerId === "string") {
        rows = getDb().prepare("SELECT * FROM documents WHERE owner_id = ? ORDER BY updated_at DESC").all(where.ownerId) as DocumentRow[];
      } else if (where && Object.prototype.hasOwnProperty.call(where, "organizationId")) {
        rows = getDb().prepare("SELECT * FROM documents WHERE organization_id = ? ORDER BY updated_at DESC").all(where.organizationId ?? "") as DocumentRow[];
      } else {
        rows = getDb().prepare("SELECT * FROM documents ORDER BY updated_at DESC").all() as DocumentRow[];
      }

      if (orderBy?.updatedAt === "asc") {
        rows = [...rows].reverse();
      }

      return rows.map((r) => {
        const doc = normalizeDocument(r);
        if (!doc) return null;
        if (include?.owner) {
          return { ...doc, owner: normalizeUser(getUserById(r.owner_id)) };
        }
        return doc;
      }).filter(Boolean);
    },
    async findUnique({
      where,
      include,
    }: {
      where?: { id?: string };
      include?: { owner?: boolean };
    } = {}) {
      if (!where?.id) return null;
      const row = getDocumentById(where.id);
      const doc = normalizeDocument(row);
      if (!doc) return null;
      if (include?.owner && row) {
        return { ...doc, owner: normalizeUser(getUserById(row.owner_id)) };
      }
      return doc;
    },
    async create({
      data,
    }: {
      data: {
        title: string;
        content: string;
        status?: string;
        documentType?: string;
        ownerId: string;
        organizationId?: string | null;
      };
    }) {
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
    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<{
        title: string;
        content: string;
        status: string;
        documentType: string;
        sealedHash: string;
        integrityStatus: string;
        references: unknown[];
      }>;
    }) {
      const updated = updateDocument(where.id, data);
      return normalizeDocument(updated);
    },
  },
  organization: {
    async count() {
      return countRows("organizations").total;
    },
    async findMany() {
      return getDb().prepare("SELECT * FROM organizations ORDER BY created_at DESC").all() as OrganizationRow[];
    },
  },
};

function cryptoRandomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function seedDemoData() {
  const organization = getOrganizationBySlug("unijos") ?? getOrganizationBySlug("university-of-jos");
  if (!organization) {
    const org = createOrganization("University of Jos", "unijos", "unijos.edu.ng");

    const admin = getUserByEmail("admin@veritas.io") ?? createUser({
      name: "Avery Stone",
      email: "admin@veritas.io",
      passwordHash: bcrypt.hashSync("admin123", 10),
      role: "ADMIN",
      organizationId: org.id,
    });

    const instructor = getUserByEmail("instructor@veritas.io") ?? createUser({
      name: "Dr. Nia Ross",
      email: "instructor@veritas.io",
      passwordHash: bcrypt.hashSync("instructor123", 10),
      role: "INSTRUCTOR",
      organizationId: org.id,
    });

    const student = getUserByEmail("student@veritas.io") ?? createUser({
      name: "Milo Hart",
      email: "student@veritas.io",
      passwordHash: bcrypt.hashSync("student123", 10),
      role: "STUDENT",
      organizationId: org.id,
    });

    const existingCourse = getDb().prepare("SELECT * FROM courses WHERE join_code = ?").get("JOS2025") as Record<string, unknown> | undefined;
    const course = existingCourse ?? createCourse({
      organizationId: org.id,
      title: "Academic Integrity Studio",
      code: "AIS 101",
      joinCode: "JOS2025",
      instructorId: instructor.id,
    });

    if (!getDb().prepare("SELECT 1 FROM assignments WHERE course_id = ? LIMIT 1").get((course as Record<string, unknown>)?.id ?? "")) {
      createAssignment({
        courseId: String((course as Record<string, unknown>)?.id ?? ""),
        title: "Research Reflection Essay",
        instructions: "Write a reflective essay that demonstrates original thinking and proper citation.",
        pasteThreshold: 0.15,
        similarityThreshold: 0.25,
      });
    }

    if (!getDb().prepare("SELECT 1 FROM corpus WHERE title = ? LIMIT 1").get("Academic Integrity Code")) {
      createCorpusEntry({
        organizationId: org.id,
        title: "Academic Integrity Code",
        sourceUrl: "https://example.edu/academic-integrity",
        body: "Students must produce original work, cite all sources accurately, and disclose all academic assistance received.",
      });
    }

    if (!getDb().prepare("SELECT 1 FROM documents WHERE owner_id = ? AND title = ? LIMIT 1").get(student.id, "Existentialism and Choice")) {
      createDocument({
        title: "Existentialism and Choice",
        content: "The authentic writer is not defined by the speed of output but by the discipline of revision. A living argument is built under pressure, uncertainty, and the willingness to admit complexity.",
        status: "submitted",
        documentType: "essay",
        ownerId: student.id,
        organizationId: org.id,
      });
    }

    return { org, admin, instructor, student, course };
  }

  return { organization };
}
