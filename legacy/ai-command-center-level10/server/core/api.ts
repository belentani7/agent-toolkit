import type { Express } from "express";
import { z } from "zod";
import { globalEngine } from "./engine";

const missionInput = z.object({
  name: z.string().trim().min(1).max(200),
  objective: z.string().trim().min(1).max(5_000),
  urls: z.array(z.string().url()).min(1).max(500),
  maxConcurrency: z.number().int().min(1).max(10).optional(),
  rateLimitMs: z.number().int().min(0).max(60_000).optional(),
  retries: z.number().int().min(0).max(4).optional(),
  timeoutMs: z.number().int().min(1_000).max(60_000).optional(),
});

function sendValidationError(res: Parameters<Express["post"]>[1] extends (req: any, res: infer T) => any ? T : never, error: z.ZodError) {
  return res.status(400).json({ error: "Invalid mission request", issues: error.issues });
}

export function registerMissionApi(app: Express) {
  app.post("/api/missions", async (req, res) => {
    const parsed = missionInput.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error);
    const mission = await globalEngine.startMission(parsed.data);
    return res.status(202).json(mission);
  });

  app.post("/api/missions/run", async (req, res) => {
    const parsed = missionInput.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error);
    const result = await globalEngine.executeMission(parsed.data);
    return res.status(200).json(result);
  });

  app.get("/api/missions/:id", async (req, res) => {
    const mission = await globalEngine.getMissionResult(req.params.id);
    if (!mission) return res.status(404).json({ error: "Mission not found" });
    return res.json(mission);
  });

  app.get("/api/missions/:id/status", async (req, res) => {
    const mission = await globalEngine.getMissionResult(req.params.id);
    if (!mission) return res.status(404).json({ error: "Mission not found" });
    return res.json({ missionId: mission.missionId, status: mission.status, metrics: mission.metrics, durationMs: mission.durationMs });
  });

  app.get("/api/missions/:id/results", async (req, res) => {
    const format = req.query.format === "csv" ? "csv" : "json";
    try {
      const content = await globalEngine.exportMission(req.params.id, format);
      res.setHeader("Content-Disposition", `attachment; filename=mission-${req.params.id}.${format}`);
      res.type(format === "csv" ? "text/csv" : "application/json").send(content);
    } catch {
      res.status(404).json({ error: "Mission not found" });
    }
  });
}
