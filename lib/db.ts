import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { buildWindowHashes } from "@/lib/plagiarism/chunker";

// On Vercel the filesystem is read-only except /tmp (ephemeral per instance).
// Locally keep the original data/ path so structure and behaviour stay the same.
const dbDir = process.env.VERCEL
  ? path.join("/tmp", "veritas-data")
  : path.join(process.cwd(), "data");
fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, "veritas.db"));
db.pragma("journal_mode = WAL");
