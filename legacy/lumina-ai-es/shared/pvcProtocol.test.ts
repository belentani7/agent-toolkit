import { describe, expect, it } from "vitest";
import { parseChatRequest, sanitizeGeneratedText, toModelMessages } from "./chatPolicy";
import { ValidationEnvelopeSchema } from "./pvcProtocol";

describe("PVC-U chat contracts", () => {
  it("sanitizes prompt content and preserves the versioned request contract", () => {
    const parsed = parseChatRequest({
      clientVersion: "1.0.0",
      messages: [
        { role: "user", content: "  Hola <script>alert('x')</script> mundo  " },
      ],
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.messages[0]?.content).toBe("Hola  mundo");
      expect(toModelMessages(parsed.data)[0]?.role).toBe("system");
    }
  });

  it("rejects oversized or structurally invalid requests with PVC codes", () => {
    const parsed = parseChatRequest({ messages: [{ role: "user", content: "" }] });

    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.issues[0]?.code).toBe("PVC-101");
  });

  it("removes control characters from generated content", () => {
    expect(sanitizeGeneratedText("Hola\u0000 mundo")).toBe("Hola mundo");
  });

  it("validates the immutable envelope shape", () => {
    const result = ValidationEnvelopeSchema.safeParse({
      validationId: "validation-1",
      traceId: "trace-1",
      validationStatus: "PASSED",
      layer: "AI_GUARDRAIL",
      errors: [],
      timestamp: Date.now(),
    });

    expect(result.success).toBe(true);
  });
});
