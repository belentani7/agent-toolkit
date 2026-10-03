import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { pvcEvidence, pvcOutbox, pvcTenants, pvcValidations } from "../drizzle/schema";
import { getDb } from "./db";
import { createPvcValidationBundle, createPvcTenant, listPvcEvidence, listPvcOutbox, listPvcValidations } from "./pvcu-db";

const enabled = process.env.RUN_MYSQL_E2E === "1" && Boolean(process.env.DATABASE_URL);
const describeMysql = enabled ? describe : describe.skip;

/**
 * Explicit real-MySQL verification. Run with RUN_MYSQL_E2E=1 pnpm vitest run server/pvcu-mysql.e2e.test.ts.
 * The test creates and removes only records carrying its unique tenant key.
 */
describeMysql("PVC-U MySQL integration", () => {
  afterAll(async () => {
    const db = await getDb();
    if (!db) return;
  });

  it("commits validation, evidence and outbox atomically and keeps tenant scope", async () => {
    const db = await getDb();
    expect(db).toBeTruthy();
    if (!db) return;

    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const tenantKey = `e2e-${suffix}`;
    const validationId = `e2e-val-${suffix}`;
    const evidenceId = `e2e-evi-${suffix}`;
    const eventId = `e2e-evt-${suffix}`;

    try {
      await createPvcTenant({
        tenantKey,
        ownerOpenId: `e2e-owner-${suffix}`,
        name: "PVC-U MySQL E2E Tenant",
        tier: "individual",
        status: "active",
        config: { test: true },
      });

      const created = await createPvcValidationBundle({
        validation: {
          validationId,
          tenantKey,
          profileId: "e2e-profile",
          artifactType: "request",
          riskClass: "low",
          status: "approved",
          spheresPassed: ["L0-shape", "L1-input", "L2-privacy", "L3-risk"],
          evidenceHash: "d".repeat(64),
          metadata: { test: true },
        },
        evidence: {
          evidenceId,
          validationId,
          tenantKey,
          evidenceHash: "d".repeat(64),
          algorithm: "sha256",
          provenance: { test: true },
        },
        eventId,
        eventType: "pvc.validation.recorded",
        eventPayload: { validationId, evidenceId, tenantKey },
      });

      expect(created?.validationId).toBe(validationId);
      await expect(listPvcValidations(tenantKey)).resolves.toMatchObject([{ validationId, tenantKey }]);
      await expect(listPvcEvidence(tenantKey, validationId)).resolves.toMatchObject([{ evidenceId, validationId, tenantKey }]);
      await expect(listPvcOutbox(tenantKey, "pending")).resolves.toMatchObject([{ eventId, aggregateId: validationId, tenantKey }]);
    } finally {
      await db.delete(pvcOutbox).where(eq(pvcOutbox.tenantKey, tenantKey));
      await db.delete(pvcEvidence).where(eq(pvcEvidence.tenantKey, tenantKey));
      await db.delete(pvcValidations).where(eq(pvcValidations.tenantKey, tenantKey));
      await db.delete(pvcTenants).where(eq(pvcTenants.tenantKey, tenantKey));
    }
  });
});
