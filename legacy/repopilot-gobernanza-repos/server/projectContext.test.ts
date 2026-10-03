import { describe, expect, it } from "vitest";
import { createProject, switchProject } from "@shared/projectContext";

describe("project context", () => {
  const projects = [createProject("Website", "p1"), createProject("Mobile app", "p2")];

  it("normalizes a project name and rejects empty names", () => {
    expect(createProject("  Website  ", "p3")).toEqual({ id: "p3", name: "Website" });
    expect(() => createProject("   ", "p4")).toThrow("Project name is required");
  });

  it("resets repository context when switching projects", () => {
    expect(switchProject("p2", projects)).toEqual({
      projectId: "p2",
      openFile: null,
      chat: [],
      pendingDiff: null,
      previewUrl: null,
    });
  });

  it("rejects selecting a project outside the workspace", () => {
    expect(() => switchProject("missing", projects)).toThrow("Project not found");
  });
});
