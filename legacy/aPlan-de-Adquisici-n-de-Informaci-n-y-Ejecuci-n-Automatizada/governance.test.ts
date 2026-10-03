import { describe, expect, it } from "vitest";
import { buildAuditEvent, hashPayload, nextRetryDelay, verifyAuditChain } from "./governance";

describe("audit hash chain", () => {
  it("builds a deterministic event hash from canonical fields", () => {
    const createdAt = new Date("2026-09-17T08:00:00.000Z");
    const first = buildAuditEvent({ actor: "test", action: "sync", resourceType: "repo", result: "ok", metadata: { b: 2, a: 1 }, createdAt });
    const second = buildAuditEvent({ actor: "test", action: "sync", resourceType: "repo", result: "ok", metadata: { a: 1, b: 2 }, createdAt });
    expect(first.eventHash).toBe(second.eventHash);
  });

  it("detects tampering in a chain", () => {
    const createdAt = new Date("2026-09-17T08:00:00.000Z");
    const first = buildAuditEvent({ actor: "test", action: "one", resourceType: "run", result: "ok", createdAt });
    const second = buildAuditEvent({ previousHash: first.eventHash, actor: "test", action: "two", resourceType: "run", result: "ok", createdAt: new Date("2026-09-17T08:01:00.000Z") });
    expect(verifyAuditChain([first, second]).valid).toBe(true);
    expect(verifyAuditChain([{ ...first, action: "tampered" }, second]).valid).toBe(false);
  });

  it("hashes structured payloads and uses bounded exponential retry", () => {
    expect(hashPayload({ x: 1 })).toHaveLength(64);
    expect(nextRetryDelay(1)).toBe(1000);
    expect(nextRetryDelay(3)).toBe(4000);
    expect(nextRetryDelay(20)).toBe(60000);
  });
});
