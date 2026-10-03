import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = { user: { id: 42, openId: "security-user", name: "Security", email: "security@example.com", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;

describe("terminal security policy", () => {
  it("requires explicit confirmation for destructive commands", async () => {
    const result = await appRouter.createCaller(ctx).terminal.run({ command: "rm -rf .", repository: "acme/app", confirmation: false });
    expect(result.status).toBe("confirmation_required");
  });

  it("blocks commands outside the allowlist", async () => {
    const result = await appRouter.createCaller(ctx).terminal.run({ command: "curl https://example.com", repository: "acme/app", confirmation: false });
    expect(result.status).toBe("blocked");
  });

  it("allows read-only inspection commands", async () => {
    const result = await appRouter.createCaller(ctx).terminal.run({ command: "git status", repository: "acme/app", confirmation: false });
    expect(result.status).toBe("ok");
  });
});
