import { describe, it, expect } from "vitest";
import { exportRegoPolicy, exportOtlpTrace, exportLangfuseObservation } from "./pvcu-ecosystem";

describe("PVC-U ecosystem adaptors", () => {
  it("exports a valid Rego policy for OPA evaluation", () => {
    const policy = exportRegoPolicy("tenant-a", "default", { maxAutonomy: 2, requireGrounding: true, allowedTools: ["search"] });
    expect(policy).toContain("package paea.suprakernel.tenant-a.default");
    expect(policy).toContain("input.autonomyLevel <= 2");
    expect(policy).toContain("\"search\"");
  });

  it("exports an OTLP-compatible JSON trace structure", () => {
    const trace = exportOtlpTrace({ validationId: "val-1", tenantKey: "tenant-a", status: "approved", riskClass: "low" }, "a".repeat(64));
    expect(trace.resourceSpans[0]?.resource.attributes[1]?.value.stringValue).toBe("tenant-a");
    expect(trace.resourceSpans[0]?.scopeSpans[0]?.spans[0]?.attributes[0]?.value.stringValue).toBe("val-1");
  });

  it("exports a Langfuse-compatible observation payload", () => {
    const obs = exportLangfuseObservation({ validationId: "val-1", tenantKey: "tenant-a", status: "approved", riskClass: "low" }, { intent: "test" });
    expect(obs.name).toContain("val-1");
    expect(obs.output).toEqual({ status: "approved" });
  });
});
