import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  approvePvcApprovalGate,
  createPvcApprovalGate,
  createPvcException,
  createPvcValidationBundle,
  createPvcProfile,
  createPvcTenant,
  createPvcValidation,
  getPvcApprovalGate,
  getPvcOverview,
  getPvcSignedEvidence,
  getPvcTenant,
  listPvcEvidence,
  listPvcExceptions,
  listPvcOutbox,
  listPvcProfiles,
  listPvcTenants,
  listPvcValidations,
  quarantinePvcValidation,
} from "../pvcu-db";
import { defaultPvcProfile, validatePvc } from "../pvcu-core";

const riskClass = z.enum(["low", "medium", "high", "critical"]);
const artifactType = z.enum(["request", "event", "response", "action", "model"]);
const profileDefinition = z.object({
  allowedTools: z.array(z.string()).default([]),
  maxAutonomy: z.number().int().min(0).max(5).default(2),
  requireHumanReviewFor: z.array(riskClass).default(["high", "critical"]),
  allowExternalEffects: z.boolean().default(false),
  allowPii: z.boolean().default(false),
  requireGrounding: z.boolean().default(true),
});

async function requireTenant(tenantKey: string, user: { openId: string; role: string }) {
  const tenant = await getPvcTenant(tenantKey, user.openId, user.role === "admin");
  if (!tenant) throw new TRPCError({ code: "FORBIDDEN", message: "Tenant scope is not available" });
  return tenant;
}

export const pvcuRouter = router({
  tenants: protectedProcedure.query(({ ctx }) => listPvcTenants(ctx.user.openId, ctx.user.role === "admin")),

  createTenant: protectedProcedure.input(z.object({
    tenantKey: z.string().min(3).max(64).regex(/^[a-z0-9-]+$/),
    name: z.string().min(1).max(255),
    tier: z.enum(["individual", "business", "enterprise"]).default("business"),
  })).mutation(({ ctx, input }) => createPvcTenant({
    tenantKey: input.tenantKey,
    ownerOpenId: ctx.user.openId,
    name: input.name,
    tier: input.tier,
    status: "active",
    config: { version: "pvcu.v1" },
  })),

  profiles: protectedProcedure.input(z.object({ tenantKey: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcProfiles(input.tenantKey))),

  createProfile: protectedProcedure.input(z.object({
    tenantKey: z.string(),
    profileId: z.string().min(2).max(128),
    version: z.string().min(1).max(32).default("1.0.0"),
    riskClass,
    domain: z.string().min(1).max(64).default("universal"),
    definition: profileDefinition.default({ allowedTools: [], maxAutonomy: 2, requireHumanReviewFor: ["high", "critical"], allowExternalEffects: false, allowPii: false, requireGrounding: true }),
  })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    return createPvcProfile({ ...input, status: "active" });
  }),

  validations: protectedProcedure.input(z.object({ tenantKey: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcValidations(input.tenantKey))),

  evidence: protectedProcedure.input(z.object({ tenantKey: z.string(), validationId: z.string().optional() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcEvidence(input.tenantKey, input.validationId))),

  outbox: protectedProcedure.input(z.object({ tenantKey: z.string(), status: z.enum(["pending", "published", "failed"]).optional() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcOutbox(input.tenantKey, input.status))),

  exceptions: protectedProcedure.input(z.object({ tenantKey: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcExceptions(input.tenantKey))),

  createException: protectedProcedure.input(z.object({
    tenantKey: z.string(),
    profileId: z.string().min(2).max(128),
    reason: z.string().min(1).max(2000),
    compensatingControls: z.string().min(1).max(4000),
    expiresAt: z.coerce.date(),
  })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    if (input.expiresAt.getTime() <= Date.now()) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Exception must expire in the future" });
    }
    return createPvcException({
      exceptionId: `exc-${nanoid(12)}`,
      tenantKey: input.tenantKey,
      profileId: input.profileId,
      reason: input.reason,
      compensatingControls: input.compensatingControls,
      expiresAt: input.expiresAt,
      approvedBy: ctx.user.openId,
      status: "active",
    });
  }),

  overview: protectedProcedure.input(z.object({ tenantKey: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => getPvcOverview(input.tenantKey))),

  approvalGate: protectedProcedure.input(z.object({ tenantKey: z.string(), validationId: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => getPvcApprovalGate(input.tenantKey, input.validationId))),

  createApprovalGate: protectedProcedure.input(z.object({ tenantKey: z.string(), validationId: z.string() })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    return createPvcApprovalGate({
      approvalId: `apr-${nanoid(12)}`,
      tenantKey: input.tenantKey,
      validationId: input.validationId,
      requiredApprovals: 2,
      status: "pending",
    });
  }),

  approve: protectedProcedure.input(z.object({ tenantKey: z.string(), approvalId: z.string() })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    try {
      return await approvePvcApprovalGate(input.tenantKey, input.approvalId, ctx.user.openId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Approval failed";
      if (message.includes("not found")) throw new TRPCError({ code: "NOT_FOUND", message });
      if (message.includes("distinct") || message.includes("pending") || message.includes("concurrently")) {
        throw new TRPCError({ code: "BAD_REQUEST", message });
      }
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Approval could not be persisted" });
    }
  }),

  exportEvidence: protectedProcedure.input(z.object({ tenantKey: z.string(), validationId: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => getPvcSignedEvidence(input.tenantKey, input.validationId))),

  quarantine: protectedProcedure.input(z.object({ tenantKey: z.string(), validationId: z.string(), reason: z.string().min(5).max(2000) })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    try {
      return await quarantinePvcValidation(input.tenantKey, input.validationId, input.reason, ctx.user.openId, `evt-${nanoid(16)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Quarantine failed";
      if (message.includes("not found")) throw new TRPCError({ code: "NOT_FOUND", message });
      if (message.includes("reason") || message.includes("concurrently")) throw new TRPCError({ code: "BAD_REQUEST", message });
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Quarantine could not be persisted" });
    }
  }),

  validate: protectedProcedure.input(z.object({
    tenantKey: z.string(),
    operationId: z.string().min(3).max(128),
    profileId: z.string().min(2).max(128),
    artifactType,
    riskClass,
    payload: z.unknown(),
    toolName: z.string().max(128).optional(),
    autonomyLevel: z.number().int().min(0).max(5).optional(),
    hasGrounding: z.boolean().optional(),
    externalEffect: z.boolean().optional(),
  })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    const profile = await listPvcProfiles(input.tenantKey);
    const selected = profile.find((item) => item.profileId === input.profileId);
    const definition = (selected?.definition ?? defaultPvcProfile()) as Record<string, unknown>;
    const result = validatePvc(input, definition);
    const validationId = `${result.validationId}-${nanoid(6)}`;
    const evidenceId = `evi-${nanoid(12)}`;
    const generatedAt = new Date().toISOString();
    return createPvcValidationBundle({
      validation: {
        validationId,
        tenantKey: input.tenantKey,
        profileId: input.profileId,
        artifactType: input.artifactType,
        riskClass: result.riskClass,
        status: result.status,
        spheresPassed: result.spheresPassed,
        failedSphere: result.failedSphere,
        failureReason: result.failureReason,
        evidenceHash: result.evidenceHash,
        metadata: result.metadata,
      },
      evidence: {
        evidenceId,
        validationId,
        tenantKey: input.tenantKey,
        evidenceHash: result.evidenceHash,
        algorithm: "sha256",
        provenance: {
          operationId: input.operationId,
          artifactType: input.artifactType,
          profileId: input.profileId,
          generatedAt,
        },
      },
      eventId: `evt-${nanoid(16)}`,
      eventType: "pvc.validation.recorded",
      eventPayload: {
        operationId: input.operationId,
        validationId,
        evidenceId,
        status: result.status,
        riskClass: result.riskClass,
        evidenceHash: result.evidenceHash,
        generatedAt,
      },
    });
  }),
});
