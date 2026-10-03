export type Project = {
  id: string;
  name: string;
  repo?: string;
};

export type ProjectContext = {
  projectId: string | null;
  openFile: string | null;
  chat: string[];
  pendingDiff: string | null;
  previewUrl: string | null;
};

export function createProject(name: string, id: string): Project {
  const normalizedName = name.trim();
  if (!normalizedName) throw new Error("Project name is required");
  return { id, name: normalizedName };
}

export function switchProject(projectId: string, projects: Project[]): ProjectContext {
  if (!projects.some((project) => project.id === projectId)) {
    throw new Error("Project not found");
  }
  return {
    projectId,
    openFile: null,
    chat: [],
    pendingDiff: null,
    previewUrl: null,
  };
}
