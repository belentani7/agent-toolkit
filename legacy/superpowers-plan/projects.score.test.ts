import { describe, expect, it } from "vitest";
import { calculateProjectScore } from "./db";
import { parseDriveMetadata } from "./routers";

describe("calculateProjectScore", () => {
  it("returns zero when a project has no verified signals", () => {
    expect(calculateProjectScore({ commits30d: 0, hasDeploy: 0, hasUsers: 0, hasDocs: 0, hasRevenue: 0, lastActivityAt: null })).toBe(0);
  });

  it("rewards concrete value signals and caps the score at 100", () => {
    expect(calculateProjectScore({ commits30d: 100, hasDeploy: 1, hasUsers: 1, hasDocs: 1, hasRevenue: 1, lastActivityAt: new Date() })).toBe(100);
  });

  it("limits commit contribution to thirty points", () => {
    expect(calculateProjectScore({ commits30d: 100, hasDeploy: 0, hasUsers: 0, hasDocs: 0, hasRevenue: 0, lastActivityAt: null })).toBe(30);
  });

  it("excludes sensitive Drive metadata by name without reading file content", () => {
    const result = parseDriveMetadata(JSON.stringify({ files: [
      { name: "producto-roadmap.md", mimeType: "text/markdown", modifiedTime: "2026-09-16T12:00:00Z" },
      { name: "Plan_Accion_Jorge_Extranjeria.pdf", mimeType: "application/pdf" },
      { name: "04-CHAT-DE-LA-SESION", mimeType: "application/vnd.google-apps.folder" },
    ] }));
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("producto-roadmap.md");
    expect(result[0]?.source).toBe("Google Drive metadata");
  });
});
