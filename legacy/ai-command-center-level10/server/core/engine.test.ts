import { describe, it, expect } from "vitest";
import { ManusCoreEngine } from "./engine.js";

describe("ManusCoreEngine Autonomous Mission Tests", () => {
  it("should execute a real mission and return structured results", async () => {
    const engine = new ManusCoreEngine();
    const result = await engine.executeMission({
      id: "test_mission_unit",
      name: "Unit Test Mission",
      urls: ["https://example.com"],
      objective: "Test core extraction",
    });

    expect(result.missionId).toBe("test_mission_unit");
    expect(result.status).toBe("completed");
    expect(result.itemsExtracted).toBe(1);
    expect(result.results.length).toBe(1);
    expect(result.results[0].success).toBe(true);
    expect(result.results[0].title).toBe("Example Domain");
    expect(result.metrics.successCount).toBe(1);
    expect(result.metrics.measuredCostUsd).toBe(0);
  }, 15000);

  it("deduplicates URLs and isolates blocked private-network targets", async () => {
    const engine = new ManusCoreEngine();
    const result = await engine.executeMission({
      id: "test_mission_guardrails",
      name: "Guardrail Mission",
      urls: ["https://example.com", "https://example.com", "http://127.0.0.1:3000"],
      objective: "Verify real network guardrails and duplicate removal",
      retries: 0,
    });

    expect(result.metrics.requestedUrls).toBe(3);
    expect(result.metrics.uniqueUrls).toBe(2);
    expect(result.metrics.duplicatesRemoved).toBe(1);
    expect(result.results.some(item => item.url.includes("127.0.0.1") && item.success === false)).toBe(true);
  }, 15000);
});
