import { describe, expect, it } from "vitest";
import { evidenceHash, validatePvc } from "./pvcu-core";

describe("PVC-U core", () => {
  it("approves a low-risk read without an external effect", () => {
    const result = validatePvc({
      tenantKey: "tenant-a",
      operationId: "op-1",
      profileId: "default",
      artifactType: "request",
      riskClass: "low",
      payload: { intent: "inspect" },
      autonomyLevel: 1,
      hasGrounding: true,
    }, {
      allowedTools: [],
      maxAutonomy: 2,
      requireHumanReviewFor: ["high", "critical"],
      allowExternalEffects: false,
      allowPii: false,
      requireGrounding: true,
    });
    expect(result.status).toBe("approved");
    expect(result.spheresPassed).toContain("L8-governance");
    expect(result.evidenceHash).toHaveLength(64);
  });

  it("routes an external high-risk action to human review", () => {
    const result = validatePvc({
      tenantKey: "tenant-a",
      operationId: "op-2",
      profileId: "default",
      artifactType: "action",
      riskClass: "high",
      payload: { intent: "send" },
      autonomyLevel: 1,
      hasGrounding: true,
      externalEffect: true,
    }, {
      allowedTools: [],
      maxAutonomy: 2,
      requireHumanReviewFor: ["high", "critical"],
      allowExternalEffects: false,
      allowPii: false,
      requireGrounding: true,
    });
    expect(result.status).toBe("human_review");
    expect(result.failedSphere).toBe("L6-effects");
  });

  it("produces a stable digest for equivalent objects", () => {
    expect(evidenceHash({ b: 2, a: 1 })).toBe(evidenceHash({ a: 1, b: 2 }));
  });
});


  it("fails closed across privacy, tool, autonomy and grounding gates", () => {
    const pii = validatePvc({ tenantKey: "tenant-a", operationId: "op-pii", profileId: "default", artifactType: "request", riskClass: "low", payload: "contact admin@example.com" }, { allowPii: false });
    expect(pii).toMatchObject({ status: "quarantine", failedSphere: "L2-privacy" });

    const tool = validatePvc({ tenantKey: "tenant-a", operationId: "op-tool", profileId: "default", artifactType: "action", riskClass: "low", payload: {}, toolName: "shell" }, { allowedTools: ["search"], maxAutonomy: 2, requireGrounding: false });
    expect(tool).toMatchObject({ status: "rejected", failedSphere: "L4-tools" });

    const autonomy = validatePvc({ tenantKey: "tenant-a", operationId: "op-auto", profileId: "default", artifactType: "request", riskClass: "low", payload: {}, autonomyLevel: 4 }, { maxAutonomy: 2, requireGrounding: false });
    expect(autonomy).toMatchObject({ status: "human_review", failedSphere: "L5-autonomy" });

    const grounding = validatePvc({ tenantKey: "tenant-a", operationId: "op-ground", profileId: "default", artifactType: "action", riskClass: "low", payload: {}, hasGrounding: false }, { maxAutonomy: 2, requireGrounding: true });
    expect(grounding).toMatchObject({ status: "quarantine", failedSphere: "L7-grounding" });
  });

  it("covers permissive profiles and malformed inputs without throwing", () => {
    const permissive = validatePvc({ tenantKey: "tenant-a", operationId: "op-perm", profileId: "default", artifactType: "action", riskClass: "high", payload: "admin@example.com", externalEffect: true, hasGrounding: true }, { allowPii: true, allowExternalEffects: true, requireGrounding: true, requireHumanReviewFor: [] });
    expect(permissive.status).toBe("approved");
    expect(permissive.spheresPassed).toContain("L6-effects");

    const missing = validatePvc({ tenantKey: "", operationId: "", profileId: "", artifactType: "request", riskClass: "low", payload: undefined } as never);
    expect(missing).toMatchObject({ status: "rejected", failedSphere: "L0-shape" });
  });


it("marks an otherwise valid high-risk request for L8 human review", () => {
  const result = validatePvc({
    tenantKey: "tenant-a",
    operationId: "op-governance",
    profileId: "default",
    artifactType: "request",
    riskClass: "high",
    payload: { intent: "approve" },
    autonomyLevel: 1,
    hasGrounding: true,
  }, {
    allowedTools: [],
    maxAutonomy: 2,
    requireHumanReviewFor: ["high"],
    allowExternalEffects: false,
    allowPii: false,
    requireGrounding: true,
  });
  expect(result.status).toBe("human_review");
  expect(result.failedSphere).toBeUndefined();
  expect(result.spheresPassed).toContain("L8-governance");
});


it("canonicalizes null, scalar and array values deterministically", () => {
  expect(evidenceHash(null)).toHaveLength(64);
  expect(evidenceHash([undefined, null, "value"])).toHaveLength(64);
  expect(evidenceHash("scalar")).toHaveLength(64);
  expect(evidenceHash(() => undefined)).toHaveLength(64);
});

it("rejects an unknown risk class and supports a profile without review rules", () => {
  const unknown = validatePvc({ tenantKey: "tenant-a", operationId: "op-risk", profileId: "default", artifactType: "request", riskClass: "unknown" as never, payload: {} }, { allowPii: true, requireGrounding: false });
  expect(unknown).toMatchObject({ status: "rejected", failedSphere: "L3-risk" });

  const noReviewRules = validatePvc({ tenantKey: "tenant-a", operationId: "op-no-review", profileId: "default", artifactType: "request", riskClass: "high", payload: {}, autonomyLevel: 0 }, { allowPii: true, requireGrounding: false, maxAutonomy: 2 });
  expect(noReviewRules.status).toBe("approved");
});
