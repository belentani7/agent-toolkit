import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));
vi.mock("./db", () => ({ getDb: getDbMock }));

import {
  createPvcEvidence,
  createPvcException,
  createPvcProfile,
  createPvcTenant,
  getPvcProfile,
  getPvcTenant,
  createPvcValidation,
  createPvcValidationBundle,
  listPvcEvidence,
  listPvcExceptions,
  listPvcProfiles,
  listPvcTenants,
  listPvcValidations,
} from "./pvcu-db";

function createDbDouble() {
  let selectedRows: unknown[] = [];
  const insertedRows: unknown[] = [];

  const selectBuilder = () => {
    const builder = {
      from: () => builder,
      where: () => builder,
      orderBy: () => builder,
      limit: () => builder,
      then: (resolve: (value: unknown[]) => unknown, reject?: (reason: unknown) => unknown) =>
        Promise.resolve(selectedRows).then(resolve, reject),
    };
    return builder;
  };

  const db = {
    select: () => selectBuilder(),
    insert: () => ({
      values: async (input: unknown) => {
        insertedRows.push(input);
        selectedRows = [input];
      },
    }),
  };

  return {
    db,
    setRows: (rows: unknown[]) => {
      selectedRows = rows;
    },
    insertedRows,
  };
}

function createTransactionalDbDouble(failOnInsert?: number, selected: unknown[] = [{ validationId: "val-atomic-1", tenantKey: "tenant-atomic" }]) {
  const events: string[] = [];
  const insertedRows: unknown[] = [];
  const selectedRows = selected;
  let insertCount = 0;

  const selectBuilder = () => {
    const builder = {
      from: () => builder,
      where: () => builder,
      limit: () => builder,
      then: (resolve: (value: unknown[]) => unknown, reject?: (reason: unknown) => unknown) =>
        Promise.resolve(selectedRows).then(resolve, reject),
    };
    return builder;
  };

  const tx = {
    insert: () => ({
      values: async (input: unknown) => {
        insertCount += 1;
        events.push(`insert:${insertCount}`);
        if (failOnInsert === insertCount) throw new Error("forced insert failure");
        insertedRows.push(input);
      },
    }),
    select: () => selectBuilder(),
  };

  const db = {
    transaction: async (callback: (transaction: typeof tx) => Promise<unknown>) => {
      events.push("begin");
      try {
        const result = await callback(tx);
        events.push("commit");
        return result;
      } catch (error) {
        events.push("rollback");
        throw error;
      }
    },
  };

  return { db, events, insertedRows };
}

describe("PVC-U data access layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates and then reads evidence within the requested tenant", async () => {
    const double = createDbDouble();
    getDbMock.mockResolvedValue(double.db);
    const input = {
      evidenceId: "evi-tenant-a-1",
      validationId: "val-tenant-a-1",
      tenantKey: "tenant-a",
      evidenceHash: "a".repeat(64),
      algorithm: "sha256",
      provenance: { source: "test" },
    };

    const created = await createPvcEvidence(input);
    expect(created).toEqual(input);
    expect(double.insertedRows).toEqual([input]);

    double.setRows([input]);
    await expect(listPvcEvidence("tenant-a", "val-tenant-a-1")).resolves.toEqual([input]);
  });

  it("keeps exception persistence scoped by tenant key", async () => {
    const double = createDbDouble();
    getDbMock.mockResolvedValue(double.db);
    const input = {
      exceptionId: "exc-tenant-a-1",
      tenantKey: "tenant-a",
      profileId: "profile-a",
      reason: "Approved maintenance window",
      compensatingControls: "Human approval and rollback",
      expiresAt: new Date(Date.now() + 60_000),
      approvedBy: "owner-a",
      status: "active" as const,
    };

    await expect(createPvcException(input)).resolves.toEqual(input);
    expect(double.insertedRows).toEqual([input]);
    double.setRows([input]);
    await expect(listPvcExceptions("tenant-a")).resolves.toEqual([input]);
  });

  it("keeps validation persistence scoped by tenant key", async () => {
    const double = createDbDouble();
    getDbMock.mockResolvedValue(double.db);
    const input = {
      validationId: "val-tenant-b-1",
      tenantKey: "tenant-b",
      profileId: "profile-b",
      artifactType: "request",
      riskClass: "low",
      status: "approved" as const,
      evidenceHash: "b".repeat(64),
    };

    await expect(createPvcValidation(input)).resolves.toEqual(input);
    expect(double.insertedRows).toEqual([input]);
    double.setRows([input]);
    await expect(listPvcValidations("tenant-b")).resolves.toEqual([input]);
  });
});


describe("PVC-U atomic validation bundle", () => {
  const validation = {
    validationId: "val-atomic-1",
    tenantKey: "tenant-atomic",
    profileId: "profile-atomic",
    artifactType: "request" as const,
    riskClass: "low" as const,
    status: "approved" as const,
    evidenceHash: "c".repeat(64),
  };
  const evidence = {
    evidenceId: "evi-atomic-1",
    validationId: "val-atomic-1",
    tenantKey: "tenant-atomic",
    evidenceHash: "c".repeat(64),
    algorithm: "sha256",
    provenance: { source: "atomic-test" },
  };

  it("commits validation, evidence and outbox event together", async () => {
    const double = createTransactionalDbDouble();
    getDbMock.mockResolvedValue(double.db);

    const created = await createPvcValidationBundle({
      validation,
      evidence,
      eventId: "evt-atomic-1",
      eventType: "pvc.validation.recorded",
      eventPayload: { validationId: validation.validationId, status: validation.status },
    });

    expect(created).toEqual({ validationId: validation.validationId, tenantKey: validation.tenantKey });
    expect(double.events).toEqual(["begin", "insert:1", "insert:2", "insert:3", "commit"]);
    expect(double.insertedRows).toHaveLength(3);
    expect((double.insertedRows[2] as { eventHash: string }).eventHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rolls back the unit when a later insert fails", async () => {
    const double = createTransactionalDbDouble(2);
    getDbMock.mockResolvedValue(double.db);

    await expect(createPvcValidationBundle({
      validation,
      evidence,
      eventId: "evt-atomic-rollback",
      eventType: "pvc.validation.recorded",
      eventPayload: { validationId: validation.validationId },
    })).rejects.toThrow("forced insert failure");

    expect(double.events).toEqual(["begin", "insert:1", "insert:2", "rollback"]);
    expect(double.insertedRows).toHaveLength(1);
  });

  it("rejects cross-tenant validation and evidence before opening a transaction", async () => {
    const double = createTransactionalDbDouble();
    getDbMock.mockResolvedValue(double.db);

    await expect(createPvcValidationBundle({
      validation,
      evidence: { ...evidence, tenantKey: "tenant-other" },
      eventId: "evt-cross-tenant",
      eventType: "pvc.validation.recorded",
      eventPayload: { validationId: validation.validationId },
    })).rejects.toThrow("same tenant scope");

    expect(double.events).toEqual([]);
  });
});


describe("PVC-U unavailable database behavior", () => {
  beforeEach(() => {
    getDbMock.mockResolvedValue(undefined);
  });

  it("returns empty reads and rejects every write when the database is unavailable", async () => {
    await expect(listPvcTenants("owner-a", false)).resolves.toEqual([]);
    await expect(getPvcTenant("tenant-a", "owner-a", false)).resolves.toBeUndefined();
    await expect(listPvcProfiles("tenant-a")).resolves.toEqual([]);
    await expect(getPvcProfile("tenant-a", "profile-a")).resolves.toBeUndefined();
    await expect(listPvcValidations("tenant-a")).resolves.toEqual([]);
    await expect(listPvcEvidence("tenant-a")).resolves.toEqual([]);
    await expect(listPvcExceptions("tenant-a")).resolves.toEqual([]);

    await expect(createPvcTenant({ tenantKey: "tenant-a", ownerOpenId: "owner-a", name: "Tenant A", tier: "individual", status: "active", config: {} })).rejects.toThrow("Database unavailable");
    await expect(createPvcProfile({ tenantKey: "tenant-a", profileId: "profile-a", version: "1.0.0", riskClass: "low", domain: "universal", definition: {}, status: "active" })).rejects.toThrow("Database unavailable");
    await expect(createPvcValidation({ validationId: "val-a", tenantKey: "tenant-a", profileId: "profile-a", artifactType: "request", riskClass: "low", status: "approved", evidenceHash: "a".repeat(64) })).rejects.toThrow("Database unavailable");
    await expect(createPvcEvidence({ evidenceId: "evi-a", validationId: "val-a", tenantKey: "tenant-a", evidenceHash: "a".repeat(64), algorithm: "sha256", provenance: {} })).rejects.toThrow("Database unavailable");
    await expect(createPvcException({ exceptionId: "exc-a", tenantKey: "tenant-a", profileId: "profile-a", reason: "Reason", compensatingControls: "Controls", expiresAt: new Date(Date.now() + 60_000), approvedBy: "owner-a", status: "active" })).rejects.toThrow("Database unavailable");
    await expect(createPvcValidationBundle({ validation: { validationId: "val-no-db", tenantKey: "tenant-a", profileId: "profile-a", artifactType: "request", riskClass: "low", status: "approved", evidenceHash: "a".repeat(64) }, evidence: { evidenceId: "evi-no-db", validationId: "val-no-db", tenantKey: "tenant-a", evidenceHash: "a".repeat(64), algorithm: "sha256", provenance: {} }, eventId: "evt-no-db", eventType: "pvc.validation.recorded", eventPayload: {} })).rejects.toThrow("Database unavailable");
  });
});


describe("PVC-U tenant and profile happy paths", () => {
  it("creates and reads a tenant and profile through scoped helpers", async () => {
    const double = createDbDouble();
    getDbMock.mockResolvedValue(double.db);
    const tenantInput = { tenantKey: "tenant-profile", ownerOpenId: "owner-profile", name: "Profile Tenant", tier: "business" as const, status: "active" as const, config: {} };
    const profileInput = { tenantKey: "tenant-profile", profileId: "profile-default", version: "1.0.0", riskClass: "low" as const, domain: "universal", definition: {}, status: "active" as const };

    await expect(createPvcTenant(tenantInput)).resolves.toEqual(tenantInput);
    await expect(createPvcProfile(profileInput)).resolves.toEqual(profileInput);
    expect(double.insertedRows).toEqual([tenantInput, profileInput]);
  });
});


describe("PVC-U bundle identity guards", () => {
  it("rejects a mismatched validation reference before opening a transaction", async () => {
    const double = createTransactionalDbDouble();
    getDbMock.mockResolvedValue(double.db);
    await expect(createPvcValidationBundle({
      validation: { validationId: "val-a", tenantKey: "tenant-a", profileId: "profile-a", artifactType: "request", riskClass: "low", status: "approved", evidenceHash: "a".repeat(64) },
      evidence: { evidenceId: "evi-a", validationId: "val-b", tenantKey: "tenant-a", evidenceHash: "a".repeat(64), algorithm: "sha256", provenance: {} },
      eventId: "evt-mismatch",
      eventType: "pvc.validation.recorded",
      eventPayload: {},
    })).rejects.toThrow("same validation");
    expect(double.events).toEqual([]);
  });
});


it("rejects an atomic commit when validation is not readable after inserts", async () => {
  const double = createTransactionalDbDouble(undefined, []);
  getDbMock.mockResolvedValue(double.db);
  await expect(createPvcValidationBundle({
    validation: { validationId: "val-unreadable", tenantKey: "tenant-atomic", profileId: "profile-atomic", artifactType: "request", riskClass: "low", status: "approved", evidenceHash: "c".repeat(64) },
    evidence: { evidenceId: "evi-unreadable", validationId: "val-unreadable", tenantKey: "tenant-atomic", evidenceHash: "c".repeat(64), algorithm: "sha256", provenance: {} },
    eventId: "evt-unreadable",
    eventType: "pvc.validation.recorded",
    eventPayload: {},
  })).rejects.toThrow("not readable after atomic insert");
  expect(double.events).toEqual(["begin", "insert:1", "insert:2", "insert:3", "rollback"]);
});


it("lists all tenants through the administrative branch", async () => {
  const double = createDbDouble();
  getDbMock.mockResolvedValue(double.db);
  double.setRows([{ tenantKey: "tenant-admin", ownerOpenId: "owner-a" }]);
  await expect(listPvcTenants("admin", true)).resolves.toEqual([{ tenantKey: "tenant-admin", ownerOpenId: "owner-a" }]);
});

it("rejects an outbox event without a complete identity before opening a transaction", async () => {
  const double = createTransactionalDbDouble();
  getDbMock.mockResolvedValue(double.db);
  const validationRecord = { validationId: "val-identity", tenantKey: "tenant-atomic", profileId: "profile-atomic", artifactType: "request", riskClass: "low", status: "approved", evidenceHash: "a".repeat(64) };
  const evidenceRecord = { evidenceId: "evi-identity", validationId: "val-identity", tenantKey: "tenant-atomic", evidenceHash: "a".repeat(64), algorithm: "sha256", provenance: {} };
  await expect(createPvcValidationBundle({ validation: validationRecord, evidence: evidenceRecord, eventId: "", eventType: "pvc.validation.recorded", eventPayload: {} })).rejects.toThrow("event identity");
  await expect(createPvcValidationBundle({ validation: validationRecord, evidence: evidenceRecord, eventId: "evt-identity", eventType: "", eventPayload: {} })).rejects.toThrow("event identity");
  expect(double.events).toEqual([]);
});
