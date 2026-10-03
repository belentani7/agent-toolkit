import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import {
  approvePvcApprovalGate,
  canAccessPvcTenant,
  createPvcException,
  createPvcProfile,
  createPvcTenant,
  createPvcApprovalGate,
  createPvcValidationBundle,
  getPvcApprovalGate,
  getPvcSignedEvidence,
  getPvcTenant,
  listPvcEvidence,
  listPvcProfiles,
  quarantinePvcValidation,
} from "./pvcu-db";

vi.mock("./pvcu-db", async () => {
  const actual = await vi.importActual<typeof import("./pvcu-db")>("./pvcu-db");
  return {
    ...actual,
    getPvcTenant: vi.fn(),
    getPvcApprovalGate: vi.fn(),
    createPvcApprovalGate: vi.fn(),
    approvePvcApprovalGate: vi.fn(),
    getPvcSignedEvidence: vi.fn(),
    listPvcProfiles: vi.fn(),
    createPvcValidationBundle: vi.fn(),
    listPvcEvidence: vi.fn(),
    quarantinePvcValidation: vi.fn(),
    createPvcException: vi.fn(),
    createPvcProfile: vi.fn(),
    createPvcTenant: vi.fn(),
  };
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(openId: string, role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: role === "admin" ? 2 : 1,
    openId,
    email: `${openId}@example.com`,
    name: openId,
    loginMethod: "test",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("PVC-U tenant isolation", () => {
  it("enforces owner matching unless the caller is an administrator", () => {
    expect(canAccessPvcTenant("owner-a", "owner-a", false)).toBe(true);
    expect(canAccessPvcTenant("owner-a", "owner-b", false)).toBe(false);
    expect(canAccessPvcTenant("owner-a", "owner-b", true)).toBe(true);
  });

  it("rejects a user trying to read a tenant outside their owner scope", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce(undefined);
    const caller = appRouter.createCaller(createContext("owner-b"));

    await expect(caller.pvcu.profiles({ tenantKey: "tenant-a" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("creates scoped tenants, profiles and future-dated exceptions", async () => {
    const tenant = {
      id: 1,
      tenantKey: "tenant-new",
      ownerOpenId: "owner-a",
      name: "Tenant New",
      tier: "business" as const,
      status: "active" as const,
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(getPvcTenant).mockResolvedValue(tenant);
    vi.mocked(createPvcTenant).mockResolvedValue(tenant);
    vi.mocked(createPvcProfile).mockResolvedValue({ id: 1, tenantKey: "tenant-new", profileId: "profile-a", version: "1.0.0", riskClass: "low", domain: "universal", definition: {}, status: "active", createdAt: new Date(), updatedAt: new Date() });
    vi.mocked(createPvcException).mockResolvedValue({ id: 1, exceptionId: "exc-a", tenantKey: "tenant-new", profileId: "profile-a", reason: "Temporary review", compensatingControls: "Dual approval", expiresAt: new Date(Date.now() + 60_000), approvedBy: "owner-a", status: "active", createdAt: new Date() });
    const caller = appRouter.createCaller(createContext("owner-a"));

    await expect(caller.pvcu.createTenant({ tenantKey: "tenant-new", name: "Tenant New" })).resolves.toMatchObject({ tenantKey: "tenant-new" });
    await expect(caller.pvcu.createProfile({ tenantKey: "tenant-new", profileId: "profile-a", riskClass: "low" })).resolves.toMatchObject({ profileId: "profile-a" });
    await expect(caller.pvcu.createException({ tenantKey: "tenant-new", profileId: "profile-a", reason: "Temporary review", compensatingControls: "Dual approval", expiresAt: new Date(Date.now() + 60_000) })).resolves.toMatchObject({ exceptionId: "exc-a" });
    await expect(caller.pvcu.createException({ tenantKey: "tenant-new", profileId: "profile-a", reason: "Expired", compensatingControls: "None", expiresAt: new Date(Date.now() - 60_000) })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(createPvcTenant).toHaveBeenCalledWith(expect.objectContaining({ tenantKey: "tenant-new", ownerOpenId: "owner-a" }));
    expect(createPvcProfile).toHaveBeenCalledWith(expect.objectContaining({ tenantKey: "tenant-new", profileId: "profile-a", status: "active" }));
    expect(createPvcException).toHaveBeenCalledWith(expect.objectContaining({ tenantKey: "tenant-new", approvedBy: "owner-a", status: "active" }));
  });

  it("allows a user to read profiles only after tenant scope is confirmed", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce({
      id: 1,
      tenantKey: "tenant-a",
      ownerOpenId: "owner-a",
      name: "Tenant A",
      tier: "business",
      status: "active",
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(listPvcProfiles).mockResolvedValueOnce([]);
    const caller = appRouter.createCaller(createContext("owner-a"));

    await expect(caller.pvcu.profiles({ tenantKey: "tenant-a" })).resolves.toEqual([]);
    expect(getPvcTenant).toHaveBeenCalledWith("tenant-a", "owner-a", false);
    expect(listPvcProfiles).toHaveBeenCalledWith("tenant-a");
  });

  it("allows admin scope while preserving the requested tenant key", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce({
      id: 1,
      tenantKey: "tenant-a",
      ownerOpenId: "owner-a",
      name: "Tenant A",
      tier: "business",
      status: "active",
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(listPvcEvidence).mockResolvedValueOnce([]);
    const caller = appRouter.createCaller(createContext("admin", "admin"));

    await expect(caller.pvcu.evidence({ tenantKey: "tenant-a" })).resolves.toEqual([]);
    expect(getPvcTenant).toHaveBeenCalledWith("tenant-a", "admin", true);
    expect(listPvcEvidence).toHaveBeenCalledWith("tenant-a", undefined);
  });
});

describe("PVC-U evidence persistence", () => {
  it("persists an evidence record for a successful validation", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce({
      id: 1,
      tenantKey: "tenant-a",
      ownerOpenId: "owner-a",
      name: "Tenant A",
      tier: "business",
      status: "active",
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(listPvcProfiles).mockResolvedValueOnce([]);
    vi.mocked(createPvcValidationBundle).mockResolvedValueOnce({
      id: 1,
      validationId: "val-1",
      tenantKey: "tenant-a",
      profileId: "universal",
      artifactType: "request",
      riskClass: "low",
      status: "approved",
      spheresPassed: null,
      failedSphere: null,
      failureReason: null,
      evidenceHash: "a".repeat(64),
      metadata: null,
      createdAt: new Date(),
    });
    const caller = appRouter.createCaller(createContext("owner-a"));
    const result = await caller.pvcu.validate({
      tenantKey: "tenant-a",
      operationId: "op-1",
      profileId: "universal",
      artifactType: "request",
      riskClass: "low",
      payload: { ok: true },
    });

    expect(result.validationId).toBe("val-1");
    expect(createPvcValidationBundle).toHaveBeenCalledOnce();
    expect(vi.mocked(createPvcValidationBundle).mock.calls[0]?.[0]).toMatchObject({
      validation: {
        tenantKey: "tenant-a",
        validationId: expect.any(String),
        evidenceHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      },
      evidence: {
        tenantKey: "tenant-a",
        validationId: expect.any(String),
        algorithm: "sha256",
      },
      eventType: "pvc.validation.recorded",
    });
  });
});


describe("PVC-U human approval and signed evidence", () => {
  it("requires tenant scope before reading an approval gate", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce(undefined);
    const caller = appRouter.createCaller(createContext("owner-a"));

    await expect(caller.pvcu.approvalGate({ tenantKey: "tenant-outside", validationId: "val-1" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(getPvcApprovalGate).not.toHaveBeenCalled();
  });

  it("maps approval and quarantine persistence failures to stable tRPC errors", async () => {
    vi.mocked(getPvcTenant).mockResolvedValue({
      id: 1,
      tenantKey: "tenant-a",
      ownerOpenId: "owner-a",
      name: "Tenant A",
      tier: "business",
      status: "active",
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const caller = appRouter.createCaller(createContext("owner-a"));

    vi.mocked(approvePvcApprovalGate).mockRejectedValueOnce(new Error("Approval gate not found"));
    await expect(caller.pvcu.approve({ tenantKey: "tenant-a", approvalId: "missing" })).rejects.toMatchObject({ code: "NOT_FOUND" });
    vi.mocked(approvePvcApprovalGate).mockRejectedValueOnce(new Error("Approval gate is not pending"));
    await expect(caller.pvcu.approve({ tenantKey: "tenant-a", approvalId: "closed" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    vi.mocked(approvePvcApprovalGate).mockRejectedValueOnce(new Error("Database unavailable"));
    await expect(caller.pvcu.approve({ tenantKey: "tenant-a", approvalId: "db-error" })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });

    vi.mocked(quarantinePvcValidation).mockRejectedValueOnce(new Error("Validation not found"));
    await expect(caller.pvcu.quarantine({ tenantKey: "tenant-a", validationId: "missing", reason: "Needs review" })).rejects.toMatchObject({ code: "NOT_FOUND" });
    vi.mocked(quarantinePvcValidation).mockRejectedValueOnce(new Error("Quarantine reason is required"));
    await expect(caller.pvcu.quarantine({ tenantKey: "tenant-a", validationId: "bad-reason", reason: "Valid reason" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    vi.mocked(quarantinePvcValidation).mockRejectedValueOnce(new Error("Database unavailable"));
    await expect(caller.pvcu.quarantine({ tenantKey: "tenant-a", validationId: "db-error", reason: "Valid reason" })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });

  it("records two distinct human approvals and returns the signed export contract", async () => {
    vi.mocked(getPvcTenant).mockResolvedValue({
      id: 1,
      tenantKey: "tenant-a",
      ownerOpenId: "owner-a",
      name: "Tenant A",
      tier: "business",
      status: "active",
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(createPvcApprovalGate).mockResolvedValueOnce({
      id: 1,
      approvalId: "apr-1",
      tenantKey: "tenant-a",
      validationId: "val-1",
      requiredApprovals: 2,
      status: "pending",
      firstApprover: null,
      firstApprovedAt: null,
      secondApprover: null,
      secondApprovedAt: null,
      decisionHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(approvePvcApprovalGate).mockResolvedValueOnce({
      id: 1,
      approvalId: "apr-1",
      tenantKey: "tenant-a",
      validationId: "val-1",
      requiredApprovals: 2,
      status: "approved",
      firstApprover: "owner-a",
      firstApprovedAt: new Date(),
      secondApprover: "owner-b",
      secondApprovedAt: new Date(),
      decisionHash: "e".repeat(64),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(getPvcSignedEvidence).mockResolvedValueOnce({
      payload: { format: "paea-pvcu-evidence-v1", tenantKey: "tenant-a" },
      contentDigest: "f".repeat(64),
      signature: "g".repeat(64),
      signatureAlgorithm: "HMAC-SHA256",
      exportedAt: new Date().toISOString(),
    });

    const caller = appRouter.createCaller(createContext("owner-a"));
    await expect(caller.pvcu.createApprovalGate({ tenantKey: "tenant-a", validationId: "val-1" })).resolves.toMatchObject({ approvalId: "apr-1" });
    await expect(caller.pvcu.approve({ tenantKey: "tenant-a", approvalId: "apr-1" })).resolves.toMatchObject({ status: "approved" });
    await expect(caller.pvcu.exportEvidence({ tenantKey: "tenant-a", validationId: "val-1" })).resolves.toMatchObject({ signatureAlgorithm: "HMAC-SHA256", contentDigest: expect.stringMatching(/^[a-f0-9]{64}$/) });

    expect(createPvcApprovalGate).toHaveBeenCalledWith(expect.objectContaining({ tenantKey: "tenant-a", validationId: "val-1", requiredApprovals: 2 }));
    expect(approvePvcApprovalGate).toHaveBeenCalledWith("tenant-a", "apr-1", "owner-a");
    expect(getPvcSignedEvidence).toHaveBeenCalledWith("tenant-a", "val-1");
  });
});


describe("PVC-U router defensive branches", () => {
  it("maps non-Error approval and quarantine failures to internal errors", async () => {
    vi.mocked(getPvcTenant).mockResolvedValue({ id: 1, tenantKey: "tenant-a", ownerOpenId: "owner-a", name: "Tenant A", tier: "business", status: "active", config: null, createdAt: new Date(), updatedAt: new Date() });
    const caller = appRouter.createCaller(createContext("owner-a"));

    vi.mocked(approvePvcApprovalGate).mockRejectedValueOnce("approval failure" as never);
    await expect(caller.pvcu.approve({ tenantKey: "tenant-a", approvalId: "apr-string" })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    vi.mocked(quarantinePvcValidation).mockRejectedValueOnce("quarantine failure" as never);
    await expect(caller.pvcu.quarantine({ tenantKey: "tenant-a", validationId: "val-string", reason: "Valid reason" })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });

  it("uses a selected tenant profile definition when validating", async () => {
    vi.mocked(getPvcTenant).mockResolvedValue({ id: 1, tenantKey: "tenant-a", ownerOpenId: "owner-a", name: "Tenant A", tier: "business", status: "active", config: null, createdAt: new Date(), updatedAt: new Date() });
    vi.mocked(listPvcProfiles).mockResolvedValueOnce([{ id: 1, tenantKey: "tenant-a", profileId: "custom", version: "1.0.0", riskClass: "low", domain: "custom", definition: { allowedTools: [], maxAutonomy: 1, allowPii: true, requireGrounding: false }, status: "active", createdAt: new Date(), updatedAt: new Date() }]);
    vi.mocked(createPvcValidationBundle).mockResolvedValueOnce({ id: 1, validationId: "val-custom", tenantKey: "tenant-a", profileId: "custom", artifactType: "request", riskClass: "low", status: "approved", spheresPassed: [], failedSphere: null, failureReason: null, evidenceHash: "a".repeat(64), metadata: null, createdAt: new Date() });
    const caller = appRouter.createCaller(createContext("owner-a"));

    await expect(caller.pvcu.validate({ tenantKey: "tenant-a", operationId: "op-custom", profileId: "custom", artifactType: "request", riskClass: "low", payload: { ok: true }, autonomyLevel: 1 })).resolves.toMatchObject({ validationId: "val-custom" });
    expect(vi.mocked(createPvcValidationBundle).mock.calls.at(-1)?.[0]).toMatchObject({ validation: { profileId: "custom" } });
  });
});
