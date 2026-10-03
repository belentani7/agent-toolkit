import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  purpose: text("purpose").notNull(),
  status: varchar("status", { length: 40 }).default("por validar").notNull(),
  stack: text("stack").notNull(),
  source: varchar("source", { length: 40 }).default("manual").notNull(),
  sourceUrl: varchar("sourceUrl", { length: 500 }).unique(),
  externalId: varchar("externalId", { length: 180 }),
  defaultBranch: varchar("defaultBranch", { length: 120 }),
  lastSyncedAt: timestamp("lastSyncedAt"),
  syncError: text("syncError"),
  syncVersion: varchar("syncVersion", { length: 120 }),
  lastActivityAt: timestamp("lastActivityAt"),
  commits30d: int("commits30d").default(0).notNull(),
  hasDeploy: int("hasDeploy").default(0).notNull(),
  hasUsers: int("hasUsers").default(0).notNull(),
  hasDocs: int("hasDocs").default(0).notNull(),
  hasRevenue: int("hasRevenue").default(0).notNull(),
  estimated: int("estimated").default(1).notNull(),
  score: int("score").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export const pipelineRuns = mysqlTable("pipeline_runs", {
  id: int("id").autoincrement().primaryKey(),
  runKey: varchar("runKey", { length: 180 }).notNull().unique(),
  trigger: varchar("trigger", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["queued", "running", "completed", "partial", "failed"]).default("queued").notNull(),
  currentStage: varchar("currentStage", { length: 40 }).notNull().default("discovery"),
  totalItems: int("totalItems").notNull().default(0),
  processedItems: int("processedItems").notNull().default(0),
  failedItems: int("failedItems").notNull().default(0),
  error: text("error"),
  startedAt: timestamp("startedAt"),
  finishedAt: timestamp("finishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PipelineRun = typeof pipelineRuns.$inferSelect;
export type InsertPipelineRun = typeof pipelineRuns.$inferInsert;

export const pipelineSteps = mysqlTable("pipeline_steps", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  projectId: int("projectId"),
  stage: varchar("stage", { length: 40 }).notNull(),
  status: mysqlEnum("status", ["pending", "running", "completed", "failed", "skipped"]).default("pending").notNull(),
  attempts: int("attempts").notNull().default(0),
  inputHash: varchar("inputHash", { length: 64 }),
  outputHash: varchar("outputHash", { length: 64 }),
  error: text("error"),
  startedAt: timestamp("startedAt"),
  finishedAt: timestamp("finishedAt"),
});

export type PipelineStep = typeof pipelineSteps.$inferSelect;

export const auditEvents = mysqlTable("audit_events", {
  id: int("id").autoincrement().primaryKey(),
  eventHash: varchar("eventHash", { length: 64 }).notNull().unique(),
  previousHash: varchar("previousHash", { length: 64 }),
  actor: varchar("actor", { length: 120 }).notNull(),
  action: varchar("action", { length: 160 }).notNull(),
  resourceType: varchar("resourceType", { length: 80 }).notNull(),
  resourceId: varchar("resourceId", { length: 180 }),
  result: varchar("result", { length: 40 }).notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditEvent = typeof auditEvents.$inferSelect;
