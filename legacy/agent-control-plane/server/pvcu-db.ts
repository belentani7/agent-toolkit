import { and, desc, eq, isNull } from "drizzle-orm";
import { createHmac } from "node:crypto";
import {
  InsertPVCEvidence,
  InsertPVCApprovalGate,
  InsertPVCException,
  InsertPVCOutboxEvent,
  InsertPVCProfile,
  InsertPVCTenant,
  InsertPVCValidation,
  pvcApprovalGates,
  pvcEvidence,
  pvcExceptions,
  pvcOutbox,
  pvcProfiles,
  pvcTenants,
  pvcValidations,
} from "../drizzle/schema";
import { getDb } from "./db";
import { ENV } from "./_core/env";
import { evidenceHash } from "./pvcu-core";

export function canAccessPvcTenant(ownerOpenId: string, requestedOwnerOpenId: string, isAdmin: boolean) {
  return isAdmin || ownerOpenId === requestedOwnerOpenId;
}

export async function listPvcTenants(ownerOpenId: string, isAdmin: boolean) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(pvcTenants);
  return isAdmin ? query.orderBy(desc(pvcTenants.updatedAt)) : query.where(eq(pvcTenants.ownerOpenId, ownerOpenId)).orderBy(desc(pvcTenants.updatedAt));
}

export async function getPvcTenant(tenantKey: string, ownerOpenId: string, isAdmin: boolean) {
  const db = await getDb();
  if (!db) return undefined;
  const scope = isAdmin ? eq(pvcTenants.tenantKey, tenantKey) : and(eq(pvcTenants.tenantKey, tenantKey), eq(pvcTenants.ownerOpenId, ownerOpenId));
  const rows = await db.select().from(pvcTenants).where(scope).limit(1);
  return rows[0];
}

export async function createPvcTenant(input: InsertPVCTenant) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcTenants).values(input);
  return getPvcTenant(input.tenantKey, input.ownerOpenId, false);
}

export async function listPvcProfiles(tenantKey: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pvcProfiles).where(eq(pvcProfiles.tenantKey, tenantKey)).orderBy(desc(pvcProfiles.updatedAt));
}

export async function getPvcProfile(tenantKey: string, profileId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(pvcProfiles).where(and(eq(pvcProfiles.tenantKey, tenantKey), eq(pvcProfiles.profileId, profileId))).orderBy(desc(pvcProfiles.updatedAt)).limit(1);
  return rows[0];
}

export async function createPvcProfile(input: InsertPVCProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcProfiles).values(input);
  return getPvcProfile(input.tenantKey, input.profileId);
}

export async function listPvcValidations(tenantKey: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pvcValidations).where(eq(pvcValidations.tenantKey, tenantKey)).orderBy(desc(pvcValidations.createdAt)).limit(100);
}

export async function createPvcValidation(input: InsertPVCValidation) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcValidations).values(input);
  const rows = await db.select().from(pvcValidations).where(eq(pvcValidations.validationId, input.validationId)).limit(1);
  return rows[0];
}

export type CreatePvcValidationBundleInput = {
  validation: InsertPVCValidation;
  evidence: InsertPVCEvidence;
  eventId: string;
  eventType: string;
  eventPayload: Record<string, unknown>;
};

/**
 * Atomic PVC-U write boundary. Validation, immutable evidence metadata and
 * its durable domain event either commit together or none of them do.
 */
export async function createPvcValidationBundle(input: CreatePvcValidationBundleInput) {
  const { validation, evidence, eventId, eventType, eventPayload } = input;
  if (validation.tenantKey !== evidence.tenantKey) {
    throw new Error("Validation and evidence must share the same tenant scope");
  }
  if (validation.validationId !== evidence.validationId) {
    throw new Error("Validation and evidence must reference the same validation");
  }
  if (!eventId || !eventType) throw new Error("Outbox event identity is required");

  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const outbox: InsertPVCOutboxEvent = {
    eventId,
    tenantKey: validation.tenantKey,
    aggregateType: "pvc_validation",
    aggregateId: validation.validationId,
    eventType,
    payload: eventPayload,
    eventHash: evidenceHash({
      eventId,
      tenantKey: validation.tenantKey,
      aggregateType: "pvc_validation",
      aggregateId: validation.validationId,
      eventType,
      payload: eventPayload,
    }),
    status: "pending",
    attempts: 0,
  };

  return db.transaction(async (tx) => {
    await tx.insert(pvcValidations).values(validation);
    await tx.insert(pvcEvidence).values(evidence);
    await tx.insert(pvcOutbox).values(outbox);
    const rows = await tx
      .select()
      .from(pvcValidations)
      .where(eq(pvcValidations.validationId, validation.validationId))
      .limit(1);
    if (!rows[0]) throw new Error("Validation was not readable after atomic insert");
    return rows[0];
  });
}

export async function listPvcEvidence(tenantKey: string, validationId?: string) {
  const db = await getDb();
  if (!db) return [];
  const scope = validationId ? and(eq(pvcEvidence.tenantKey, tenantKey), eq(pvcEvidence.validationId, validationId)) : eq(pvcEvidence.tenantKey, tenantKey);
  return db.select().from(pvcEvidence).where(scope).orderBy(desc(pvcEvidence.createdAt)).limit(100);
}

export async function createPvcEvidence(input: InsertPVCEvidence) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcEvidence).values(input);
  const rows = await db.select().from(pvcEvidence).where(eq(pvcEvidence.evidenceId, input.evidenceId)).limit(1);
  return rows[0];
}

export async function listPvcExceptions(tenantKey: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pvcExceptions).where(eq(pvcExceptions.tenantKey, tenantKey)).orderBy(desc(pvcExceptions.createdAt)).limit(100);
}

export async function createPvcException(input: InsertPVCException) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcExceptions).values(input);
  const rows = await db.select().from(pvcExceptions).where(eq(pvcExceptions.exceptionId, input.exceptionId)).limit(1);
  return rows[0];
}

export async function listPvcOutbox(tenantKey: string, status?: "pending" | "published" | "failed") {
  const db = await getDb();
  if (!db) return [];
  const scope = status
    ? and(eq(pvcOutbox.tenantKey, tenantKey), eq(pvcOutbox.status, status))
    : eq(pvcOutbox.tenantKey, tenantKey);
  return db.select().from(pvcOutbox).where(scope).orderBy(desc(pvcOutbox.createdAt)).limit(100);
}

export async function markPvcOutboxPublished(eventId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db
    .update(pvcOutbox)
    .set({ status: "published", publishedAt: new Date() })
    .where(eq(pvcOutbox.eventId, eventId));
  const rows = await db.select().from(pvcOutbox).where(eq(pvcOutbox.eventId, eventId)).limit(1);
  return rows[0];
}

export async function quarantinePvcValidation(tenantKey: string, validationId: string, reason: string, operatorOpenId: string, eventId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  if (!reason.trim()) throw new Error("Quarantine reason is required");

  return db.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(pvcValidations)
      .where(and(eq(pvcValidations.tenantKey, tenantKey), eq(pvcValidations.validationId, validationId)))
      .limit(1);
    const validation = rows[0];
    if (!validation) throw new Error("Validation not found");
    if (validation.status === "quarantine") return validation;

    const quarantinedAt = new Date().toISOString();
    const currentMetadata = validation.metadata && typeof validation.metadata === "object" ? validation.metadata as Record<string, unknown> : {};
    const metadata = { ...currentMetadata, quarantineReason: reason, quarantinedBy: operatorOpenId, quarantinedAt };
    const updateResult = await tx
      .update(pvcValidations)
      .set({ status: "quarantine", failureReason: reason, metadata })
      .where(and(eq(pvcValidations.tenantKey, tenantKey), eq(pvcValidations.validationId, validationId), eq(pvcValidations.status, validation.status)));
    if (Number((updateResult as { affectedRows?: number }).affectedRows ?? 1) === 0) {
      throw new Error("Validation changed concurrently; retry quarantine");
    }

    const eventPayload = { tenantKey, validationId, reason, operatorOpenId, quarantinedAt, status: "quarantine" };
    await tx.insert(pvcOutbox).values({
      eventId,
      tenantKey,
      aggregateType: "pvc_validation",
      aggregateId: validationId,
      eventType: "pvc.validation.quarantined",
      payload: eventPayload,
      eventHash: evidenceHash(eventPayload),
      status: "pending",
      attempts: 0,
    });
    const updatedRows = await tx.select().from(pvcValidations).where(eq(pvcValidations.validationId, validationId)).limit(1);
    if (!updatedRows[0]) throw new Error("Quarantined validation was not readable after update");
    return updatedRows[0];
  });
}

export async function getPvcApprovalGate(tenantKey: string, validationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(pvcApprovalGates)
    .where(and(eq(pvcApprovalGates.tenantKey, tenantKey), eq(pvcApprovalGates.validationId, validationId)))
    .limit(1);
  return rows[0];
}

export async function createPvcApprovalGate(input: InsertPVCApprovalGate) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcApprovalGates).values(input);
  return getPvcApprovalGate(input.tenantKey, input.validationId);
}

export async function approvePvcApprovalGate(tenantKey: string, approvalId: string, approverOpenId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const rows = await db
    .select()
    .from(pvcApprovalGates)
    .where(and(eq(pvcApprovalGates.tenantKey, tenantKey), eq(pvcApprovalGates.approvalId, approvalId)))
    .limit(1);
  const gate = rows[0];
  if (!gate) throw new Error("Approval gate not found");
  if (gate.status !== "pending") throw new Error("Approval gate is not pending");
  if (gate.firstApprover === approverOpenId || gate.secondApprover === approverOpenId) {
    throw new Error("Dual approval requires two distinct approvers");
  }

  const now = new Date();
  if (!gate.firstApprover) {
    const result = await db
      .update(pvcApprovalGates)
      .set({ firstApprover: approverOpenId, firstApprovedAt: now })
      .where(and(eq(pvcApprovalGates.tenantKey, tenantKey), eq(pvcApprovalGates.approvalId, approvalId), eq(pvcApprovalGates.status, "pending"), isNull(pvcApprovalGates.firstApprover)));
    if (Number((result as { affectedRows?: number }).affectedRows ?? 1) === 0) {
      throw new Error("Approval gate changed concurrently; retry");
    }
  } else {
    const decisionHash = evidenceHash({
      approvalId,
      tenantKey,
      validationId: gate.validationId,
      firstApprover: gate.firstApprover,
      secondApprover: approverOpenId,
      firstApprovedAt: gate.firstApprovedAt?.toISOString() ?? null,
      secondApprovedAt: now.toISOString(),
      status: "approved",
    });
    const result = await db
      .update(pvcApprovalGates)
      .set({ secondApprover: approverOpenId, secondApprovedAt: now, decisionHash, status: "approved" })
      .where(and(eq(pvcApprovalGates.tenantKey, tenantKey), eq(pvcApprovalGates.approvalId, approvalId), eq(pvcApprovalGates.status, "pending"), isNull(pvcApprovalGates.secondApprover)));
    if (Number((result as { affectedRows?: number }).affectedRows ?? 1) === 0) {
      throw new Error("Approval gate changed concurrently; retry");
    }
  }
  return getPvcApprovalGate(tenantKey, gate.validationId);
}

export async function getPvcSignedEvidence(tenantKey: string, validationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const [validationRows, evidenceRows, gateRows] = await Promise.all([
    db.select().from(pvcValidations).where(and(eq(pvcValidations.tenantKey, tenantKey), eq(pvcValidations.validationId, validationId))).limit(1),
    db.select().from(pvcEvidence).where(and(eq(pvcEvidence.tenantKey, tenantKey), eq(pvcEvidence.validationId, validationId))).orderBy(desc(pvcEvidence.createdAt)).limit(100),
    db.select().from(pvcApprovalGates).where(and(eq(pvcApprovalGates.tenantKey, tenantKey), eq(pvcApprovalGates.validationId, validationId))).limit(1),
  ]);
  const validation = validationRows[0];
  if (!validation) return undefined;
  const payload = {
    format: "paea-pvcu-evidence-v1",
    tenantKey,
    validation,
    evidence: evidenceRows,
    approval: gateRows[0] ?? null,
  };
  const contentDigest = evidenceHash(payload);
  if (!ENV.cookieSecret) throw new Error("Evidence signing secret is not configured");
  const signature = createHmac("sha256", ENV.cookieSecret).update(contentDigest).digest("hex");
  return {
    payload,
    contentDigest,
    signature,
    signatureAlgorithm: "HMAC-SHA256",
    exportedAt: new Date().toISOString(),
  };
}

export async function getPvcOverview(tenantKey: string) {
  const [profiles, validations, evidence, exceptions] = await Promise.all([
    listPvcProfiles(tenantKey),
    listPvcValidations(tenantKey),
    listPvcEvidence(tenantKey),
    listPvcExceptions(tenantKey),
  ]);
  const approved = validations.filter((item) => item.status === "approved").length;
  const blocked = validations.filter((item) => item.status === "rejected" || item.status === "quarantine").length;
  return {
    profiles,
    validations,
    evidence,
    exceptions,
    metrics: {
      validationCount: validations.length,
      evidenceCount: evidence.length,
      exceptionCount: exceptions.length,
      approved,
      blocked,
      review: validations.filter((item) => item.status === "human_review").length,
      approvalRate: validations.length ? Math.round((approved / validations.length) * 100) : 0,
      evidenceIntegrity: validations.every((item) => Boolean(item.evidenceHash)),
    },
  };
}
