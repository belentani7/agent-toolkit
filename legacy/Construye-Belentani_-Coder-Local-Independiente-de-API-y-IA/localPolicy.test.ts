import { describe, expect, it } from "vitest";
import { auditSummary, classifyOperation, isOfflineCore } from "./localPolicy";

describe("Belentani local policy", () => {
  it("accepts read-only commands from the deterministic allowlist", () => {
    expect(classifyOperation("git status")).toBe("safe");
    expect(classifyOperation("  pnpm   check ")).toBe("safe");
  });

  it("requires review for writes and unknown commands", () => {
    expect(classifyOperation("mkdir reports")).toBe("review");
    expect(classifyOperation("python script.py")).toBe("review");
  });

  it("blocks destructive or network commands", () => {
    expect(classifyOperation("rm -rf ./build")).toBe("blocked");
    expect(classifyOperation("curl https://example.com")).toBe("blocked");
    expect(classifyOperation("git -C /etc status")).toBe("blocked");
    expect(classifyOperation("git status; whoami")).toBe("blocked");
    expect(classifyOperation("docker system prune")).toBe("blocked");
    expect(classifyOperation("")).toBe("blocked");
  });

  it("reports a zero-network, zero-model core", () => {
    expect(isOfflineCore()).toBe(true);
    expect(auditSummary()).toEqual({ networkRequests: 0, apiKeys: 0, aiModels: 0, destructiveCommandsWithoutReview: 0 });
  });
});
