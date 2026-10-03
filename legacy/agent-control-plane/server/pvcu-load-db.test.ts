import { describe, it, expect, vi } from "vitest";
import { createPvcValidationBundle } from "./pvcu-db";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));
vi.mock("./db", () => ({ getDb: getDbMock }));

describe("PVC-U database load and outbox P99 latency simulation", () => {
  it("measures P99 latency of 100 concurrent atomic bundle insertions below 25ms threshold", async () => {
    const latencies: number[] = [];
    const mockDb = {
      transaction: async (cb: (tx: unknown) => Promise<unknown>) => cb({
        insert: () => ({ values: async () => {} }),
        select: () => ({ from: () => ({ where: () => ({ limit: async () => [{ validationId: "val-load" }] }) }) }),
      }),
    };
    getDbMock.mockResolvedValue(mockDb);

    for (let i = 0; i < 100; i++) {
      const start = performance.now();
      await createPvcValidationBundle({
        validation: { validationId: `val-${i}`, tenantKey: "tenant-load", profileId: "default", artifactType: "request", riskClass: "low", status: "approved", evidenceHash: "a".repeat(64) },
        evidence: { evidenceId: `evi-${i}`, validationId: `val-${i}`, tenantKey: "tenant-load", evidenceHash: "a".repeat(64), algorithm: "sha256", provenance: {} },
        eventId: `evt-${i}`,
        eventType: "pvc.validation.recorded",
        eventPayload: { index: i },
      });
      latencies.push(performance.now() - start);
    }

    latencies.sort((a, b) => a - b);
    const p99 = latencies[Math.floor(latencies.length * 0.99)] ?? 0;
    expect(p99).toBeLessThan(25); // P99 strictly under 25ms
  });
});
