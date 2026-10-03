import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, auditEvents, conversations, githubConnections, messages, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date(); updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return rows[0];
}

export async function listConnections(userId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({ id: githubConnections.id, label: githubConnections.label, scopes: githubConnections.scopes, createdAt: githubConnections.createdAt }).from(githubConnections).where(eq(githubConnections.userId, userId)).orderBy(desc(githubConnections.updatedAt));
}

export async function getConnection(userId: number, id: number) {
  const db = await getDb(); if (!db) return undefined;
  const rows = await db.select().from(githubConnections).where(and(eq(githubConnections.userId, userId), eq(githubConnections.id, id))).limit(1); return rows[0];
}

export async function addConnection(input: { userId: number; label: string; tokenCiphertext: string; scopes: string }) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const result = await db.insert(githubConnections).values(input); return Number(result[0].insertId);
}

export async function saveConversation(input: { userId: number; title: string; provider: string; model: string; repository?: string; activeFile?: string }) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const result = await db.insert(conversations).values(input); return Number(result[0].insertId);
}

export async function listConversations(userId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({ id: conversations.id, title: conversations.title, provider: conversations.provider, model: conversations.model, repository: conversations.repository, activeFile: conversations.activeFile, updatedAt: conversations.updatedAt }).from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.updatedAt)).limit(30);
}

export async function addMessage(input: { conversationId: number; userId: number; role: "user" | "assistant" | "system"; content: string }) {
  const db = await getDb(); if (!db) return;
  await db.insert(messages).values(input);
}

export async function getRecentAudit(userId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(auditEvents).where(eq(auditEvents.userId, userId)).orderBy(desc(auditEvents.createdAt)).limit(40);
}

export async function recordAudit(input: { userId: number; action: string; target?: string; status: "allowed" | "blocked" | "pending"; detail?: string }) {
  const db = await getDb(); if (!db) return;
  await db.insert(auditEvents).values(input);
}
