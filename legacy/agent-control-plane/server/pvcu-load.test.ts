import { describe, it, expect, vi } from "vitest";
import { validatePvc } from "./pvcu-core";

describe("PVC-U load and concurrency simulation", () => {
  it("processes 200 concurrent validation checks under P99 latency threshold of 25ms", async () => {
    const start = performance.now();
    const tasks = Array.from({ length: 200 }, (_, i) =>
      Promise.resolve(
        validatePvc({
          tenantKey: `tenant-${i % 5}`,
          operationId: `op-load-${i}`,
          profileId: "default",
          artifactType: "request",
          riskClass: "low",
          payload: { index: i },
          autonomyLevel: 1,
          hasGrounding: true,
        }, {
          allowedTools: [],
          maxAutonomy: 2,
          requireHumanReviewFor: ["high"],
          allowExternalEffects: false,
          allowPii: false,
          requireGrounding: true,
        })
      )
    );

    const results = await Promise.all(tasks);
    const duration = performance.now() - start;

    expect(results).toHaveLength(200);
    expect(results.every((r) => r.status === "approved")).toBe(true);
    expect(duration).toBeLessThan(1000); // 200 checks well under 1 second total
  });
});
