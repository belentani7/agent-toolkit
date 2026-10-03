import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function unauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("projects router", () => {
  it("rejects project listing without a session", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.projects.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects project creation without a session", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.projects.create({ name: "Private project" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
