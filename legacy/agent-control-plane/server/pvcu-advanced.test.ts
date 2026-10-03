import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));
vi.mock("./db", () => ({ getDb: getDbMock }));

import { ENV } from "./_core/env";
import {
  approvePvcApprovalGate,
  createPvcApprovalGate,
  getPvcApprovalGate,
  getPvcOverview,
  getPvcSignedEvidence,
  listPvcOutbox,
  markPvcOutboxPublished,
  quarantinePvcValidation,
} from "./pvcu-db";

function createFeatureDbDouble(initialRows: Record<string, unknown>[], affectedRows = 1, omitAffectedRows = false, clearAfterUpdate = false) {
  const rows = initialRows;
  const insertedRows: unknown[] = [];
  const updates: unknown[] = [];

  const selectBuilder = () => {
    const builder = {
      from: () => builder,
      where: () => builder,
      orderBy: () => builder,
      limit: () => builder,
      then: (resolve: (value: Record<string, unknown>[]) => unknown, reject?: (reason: unknown) => unknown) =>
        Promise.resolve(rows).then(resolve, reject),
    };
    return builder;
  };

  const db = {
    select: () => selectBuilder(),
    insert: () => ({
      values: async (input: unknown) => {
        insertedRows.push(input);
      },
    }),
    update: () => {
      let patch: Record<string, unknown> = {};
      const builder = {
        set: (value: Record<string, unknown>) => {
          patch = value;
          return builder;
        },
        where: async () => {
          updates.push(patch);
          if (affectedRows > 0 && rows[0]) Object.assign(rows[0], patch);
          if (clearAfterUpdate) rows.length = 0;
          return omitAffectedRows ? {} : { affectedRows };
        },
      };
      return builder;
    },
    transaction: async (callback: (transaction: typeof db) => Promise<unknown>) => callback(db),
  };

  return { db, rows, insertedRows, updates };
}

describe("PVC-U advanced persistence controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (!ENV.cookieSecret) ENV.cookieSecret = "unit-test-signing-secret";
  });

  it("lists outbox by tenant and optional status, then marks an event published", async () => {
    const double = createFeatureDbDouble([{ eventId: "evt-1", tenantKey: "tenant-a", status: "pending" }]);
    getDbMock.mockResolvedValue(double.db);

    await expect(listPvcOutbox("tenant-a")).resolves.toMatchObject([{ eventId: "evt-1" }]);
    await expect(listPvcOutbox("tenant-a", "pending")).resolves.toMatchObject([{ eventId: "evt-1" }]);
    await expect(markPvcOutboxPublished("evt-1")).resolves.toMatchObject({ eventId: "evt-1", status: "published" });
    expect(double.updates[0]).toMatchObject({ status: "published" });
  });

  it("creates an approval gate and returns it through the tenant-scoped read", async () => {
    const double = createFeatureDbDouble([{ approvalId: "apr-new", validationId: "val-new", tenantKey: "tenant-a", status: "pending" }]);
    getDbMock.mockResolvedValue(double.db);

    await expect(createPvcApprovalGate({ approvalId: "apr-new", tenantKey: "tenant-a", validationId: "val-new", requiredApprovals: 2, status: "pending" })).resolves.toMatchObject({ approvalId: "apr-new", tenantKey: "tenant-a" });
    expect(double.insertedRows[0]).toMatchObject({ approvalId: "apr-new", tenantKey: "tenant-a" });
  });

  it("quarantines a validation and appends an auditable outbox event in one transaction", async () => {
    const double = createFeatureDbDouble([{ validationId: "val-q", tenantKey: "tenant-a", status: "approved", metadata: null }]);
    getDbMock.mockResolvedValue(double.db);

    const result = await quarantinePvcValidation("tenant-a", "val-q", "External effect requires review", "operator-a", "evt-q");

    expect(result).toMatchObject({ validationId: "val-q", status: "quarantine" });
    expect(double.updates[0]).toMatchObject({ status: "quarantine", failureReason: "External effect requires review" });
    expect(double.insertedRows[0]).toMatchObject({ eventId: "evt-q", eventType: "pvc.validation.quarantined", tenantKey: "tenant-a" });
    expect((double.insertedRows[0] as { eventHash: string }).eventHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects an empty quarantine reason before opening the database transaction", async () => {
    const double = createFeatureDbDouble([]);
    getDbMock.mockResolvedValue(double.db);
    await expect(quarantinePvcValidation("tenant-a", "val-q", "  ", "operator-a", "evt-q")).rejects.toThrow("reason is required");
    expect(double.updates).toEqual([]);
  });

  it("records first and second approvals with a distinct second identity", async () => {
    const first = createFeatureDbDouble([{ approvalId: "apr-1", validationId: "val-1", tenantKey: "tenant-a", status: "pending", firstApprover: null, secondApprover: null }]);
    getDbMock.mockResolvedValue(first.db);
    await expect(approvePvcApprovalGate("tenant-a", "apr-1", "operator-a")).resolves.toMatchObject({ firstApprover: "operator-a", status: "pending" });

    const second = createFeatureDbDouble([{ approvalId: "apr-1", validationId: "val-1", tenantKey: "tenant-a", status: "pending", firstApprover: "operator-a", firstApprovedAt: new Date(), secondApprover: null }]);
    getDbMock.mockResolvedValue(second.db);
    await expect(approvePvcApprovalGate("tenant-a", "apr-1", "operator-b")).resolves.toMatchObject({ secondApprover: "operator-b", status: "approved" });
    expect(second.updates[0]).toMatchObject({ status: "approved", secondApprover: "operator-b" });
    expect((second.updates[0] as { decisionHash: string }).decisionHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects repeated approval by the same identity and non-pending gates", async () => {
    const repeated = createFeatureDbDouble([{ approvalId: "apr-1", validationId: "val-1", tenantKey: "tenant-a", status: "pending", firstApprover: "operator-a", secondApprover: null }]);
    getDbMock.mockResolvedValue(repeated.db);
    await expect(approvePvcApprovalGate("tenant-a", "apr-1", "operator-a")).rejects.toThrow("two distinct approvers");

    const closed = createFeatureDbDouble([{ approvalId: "apr-2", validationId: "val-2", tenantKey: "tenant-a", status: "approved", firstApprover: "operator-a" }]);
    getDbMock.mockResolvedValue(closed.db);
    await expect(approvePvcApprovalGate("tenant-a", "apr-2", "operator-b")).rejects.toThrow("not pending");
  });

  it("reports overview metrics for approved, blocked, review and integrity states", async () => {
    const double = createFeatureDbDouble([
      { validationId: "val-a", status: "approved", evidenceHash: "hash-a" },
      { validationId: "val-q", status: "quarantine", evidenceHash: null },
      { validationId: "val-r", status: "human_review", evidenceHash: "hash-r" },
      { validationId: "val-x", status: "rejected", evidenceHash: "hash-x" },
    ]);
    getDbMock.mockResolvedValue(double.db);

    const overview = await getPvcOverview("tenant-a");
    expect(overview.metrics).toMatchObject({ validationCount: 4, approved: 1, blocked: 2, review: 1, approvalRate: 25, evidenceIntegrity: false });
  });

  it("surfaces not-found and concurrent-write failures instead of silently accepting them", async () => {
    const missing = createFeatureDbDouble([]);
    getDbMock.mockResolvedValue(missing.db);
    await expect(quarantinePvcValidation("tenant-a", "missing", "Needs review", "operator-a", "evt-missing")).rejects.toThrow("Validation not found");

    const concurrentQuarantine = createFeatureDbDouble([{ validationId: "val-q", tenantKey: "tenant-a", status: "approved" }], 0);
    getDbMock.mockResolvedValue(concurrentQuarantine.db);
    await expect(quarantinePvcValidation("tenant-a", "val-q", "Needs review", "operator-a", "evt-q")).rejects.toThrow("changed concurrently");

    const concurrentApproval = createFeatureDbDouble([{ approvalId: "apr-q", validationId: "val-q", tenantKey: "tenant-a", status: "pending", firstApprover: null }], 0);
    getDbMock.mockResolvedValue(concurrentApproval.db);
    await expect(approvePvcApprovalGate("tenant-a", "apr-q", "operator-a")).rejects.toThrow("changed concurrently");

    const concurrentSecondApproval = createFeatureDbDouble([{ approvalId: "apr-second", validationId: "val-second", tenantKey: "tenant-a", status: "pending", firstApprover: "operator-a", firstApprovedAt: new Date() }], 0);
    getDbMock.mockResolvedValue(concurrentSecondApproval.db);
    await expect(approvePvcApprovalGate("tenant-a", "apr-second", "operator-b")).rejects.toThrow("changed concurrently");

    const noEvidence = createFeatureDbDouble([]);
    getDbMock.mockResolvedValue(noEvidence.db);
    await expect(getPvcSignedEvidence("tenant-a", "missing")).resolves.toBeUndefined();
  });

  it("exports a deterministic digest and server signature for scoped evidence", async () => {
    const double = createFeatureDbDouble([{ validationId: "val-1", tenantKey: "tenant-a", status: "approved" }]);
    getDbMock.mockResolvedValue(double.db);

    const first = await getPvcSignedEvidence("tenant-a", "val-1");
    const second = await getPvcSignedEvidence("tenant-a", "val-1");
    expect(first).toMatchObject({ signatureAlgorithm: "HMAC-SHA256" });
    expect(first?.contentDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(first?.signature).toMatch(/^[a-f0-9]{64}$/);
    expect(first?.contentDigest).toBe(second?.contentDigest);
    expect(first?.signature).toBe(second?.signature);
  });
});


it("fails closed for unavailable outbox, gates and signed evidence reads", async () => {
  getDbMock.mockResolvedValue(undefined);
  await expect(listPvcOutbox("tenant-a")).resolves.toEqual([]);
  await expect(markPvcOutboxPublished("evt-missing")).rejects.toThrow("Database unavailable");
  await expect(getPvcApprovalGate("tenant-a", "val-missing")).resolves.toBeUndefined();
  await expect(createPvcApprovalGate({ approvalId: "apr-missing", tenantKey: "tenant-a", validationId: "val-missing", requiredApprovals: 2, status: "pending" })).rejects.toThrow("Database unavailable");
  await expect(approvePvcApprovalGate("tenant-a", "apr-missing", "operator-a")).rejects.toThrow("Database unavailable");
  await expect(quarantinePvcValidation("tenant-a", "val-missing", "Needs review", "operator-a", "evt-missing")).rejects.toThrow("Database unavailable");
  await expect(getPvcSignedEvidence("tenant-a", "val-missing")).resolves.toBeUndefined();
});

it("keeps quarantine idempotent and preserves structured metadata", async () => {
  const already = createFeatureDbDouble([{ validationId: "val-already", tenantKey: "tenant-a", status: "quarantine", metadata: { source: "prior" } }]);
  getDbMock.mockResolvedValue(already.db);
  await expect(quarantinePvcValidation("tenant-a", "val-already", "Repeat review", "operator-a", "evt-repeat")).resolves.toMatchObject({ status: "quarantine", metadata: { source: "prior" } });
  expect(already.updates).toEqual([]);

  const structured = createFeatureDbDouble([{ validationId: "val-structured", tenantKey: "tenant-a", status: "approved", metadata: { source: "agent" } }]);
  getDbMock.mockResolvedValue(structured.db);
  await expect(quarantinePvcValidation("tenant-a", "val-structured", "Structured review", "operator-a", "evt-structured")).resolves.toMatchObject({ status: "quarantine", metadata: { source: "agent", quarantineReason: "Structured review" } });
});

it("rejects missing and repeated second approval identities", async () => {
  const missing = createFeatureDbDouble([]);
  getDbMock.mockResolvedValue(missing.db);
  await expect(approvePvcApprovalGate("tenant-a", "missing", "operator-a")).rejects.toThrow("Approval gate not found");

  const repeatedSecond = createFeatureDbDouble([{ approvalId: "apr-second-repeat", validationId: "val-second-repeat", tenantKey: "tenant-a", status: "pending", firstApprover: "operator-a", secondApprover: "operator-b" }]);
  getDbMock.mockResolvedValue(repeatedSecond.db);
  await expect(approvePvcApprovalGate("tenant-a", "apr-second-repeat", "operator-b")).rejects.toThrow("two distinct approvers");
});

it("rejects signed evidence export when the server signing secret is absent", async () => {
  const double = createFeatureDbDouble([{ validationId: "val-secret", tenantKey: "tenant-a", status: "approved" }]);
  getDbMock.mockResolvedValue(double.db);
  const original = ENV.cookieSecret;
  ENV.cookieSecret = "";
  await expect(getPvcSignedEvidence("tenant-a", "val-secret")).rejects.toThrow("signing secret is not configured");
  ENV.cookieSecret = original || "unit-test-signing-secret";
});


it("fails safely when the quarantined validation cannot be read after update", async () => {
  const double = createFeatureDbDouble([{ validationId: "val-unreadable", tenantKey: "tenant-a", status: "approved", metadata: null }], 1, false, true);
  getDbMock.mockResolvedValue(double.db);
  await expect(quarantinePvcValidation("tenant-a", "val-unreadable", "Readback review", "operator-a", "evt-unreadable")).rejects.toThrow("not readable after update");
});

it("uses the safe affectedRows default when MySQL omits the field", async () => {
  const double = createFeatureDbDouble([{ validationId: "val-omit", tenantKey: "tenant-a", status: "approved", metadata: null }], 1, true);
  getDbMock.mockResolvedValue(double.db);
  await expect(quarantinePvcValidation("tenant-a", "val-omit", "Omitted count review", "operator-a", "evt-omit")).resolves.toMatchObject({ status: "quarantine" });
});


it("covers approval updates when MySQL omits affectedRows and first approval time", async () => {
  const first = createFeatureDbDouble([{ approvalId: "apr-omit-first", validationId: "val-omit-first", tenantKey: "tenant-a", status: "pending", firstApprover: null }], 1, true);
  getDbMock.mockResolvedValue(first.db);
  await expect(approvePvcApprovalGate("tenant-a", "apr-omit-first", "operator-a")).resolves.toMatchObject({ firstApprover: "operator-a" });

  const second = createFeatureDbDouble([{ approvalId: "apr-omit-second", validationId: "val-omit-second", tenantKey: "tenant-a", status: "pending", firstApprover: "operator-a" }], 1, true);
  getDbMock.mockResolvedValue(second.db);
  await expect(approvePvcApprovalGate("tenant-a", "apr-omit-second", "operator-b")).resolves.toMatchObject({ status: "approved", secondApprover: "operator-b" });
});

it("reports zero approval rate for an empty tenant overview", async () => {
  const double = createFeatureDbDouble([]);
  getDbMock.mockResolvedValue(double.db);
  const overview = await getPvcOverview("tenant-empty");
  expect(overview.metrics).toMatchObject({ validationCount: 0, approvalRate: 0, evidenceIntegrity: true });
});

it("exports signed evidence with no approval gate as an explicit null", async () => {
  let selectIndex = 0;
  const selectResults = [
    [{ validationId: "val-no-gate", tenantKey: "tenant-a", status: "approved" }],
    [],
    [],
  ];
  const db = {
    select: () => {
      const rows = selectResults[selectIndex++] ?? [];
      const builder = { from: () => builder, where: () => builder, orderBy: () => builder, limit: () => builder, then: (resolve: (value: unknown[]) => unknown) => Promise.resolve(rows).then(resolve) };
      return builder;
    },
  };
  getDbMock.mockResolvedValue(db);
  const signed = await getPvcSignedEvidence("tenant-a", "val-no-gate");
  expect(signed?.payload.approval).toBeNull();
});
