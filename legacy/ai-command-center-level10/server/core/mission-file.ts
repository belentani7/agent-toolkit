import fs from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import type { MissionRequest } from "./engine";

const missionFileSchema = z.object({
  name: z.string().trim().min(1).max(200),
  objective: z.string().trim().min(1).max(5_000),
  urls: z.array(z.string().url()).min(1).max(500),
  maxConcurrency: z.number().int().min(1).max(10).optional(),
  rateLimitMs: z.number().int().min(0).max(60_000).optional(),
  retries: z.number().int().min(0).max(4).optional(),
  timeoutMs: z.number().int().min(1_000).max(60_000).optional(),
});

export async function readMissionFile(filePath: string): Promise<Omit<MissionRequest, "id">> {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const raw = await fs.readFile(absolutePath, "utf-8");
  const source = absolutePath.endsWith(".json") ? JSON.parse(raw) : parseYaml(raw);
  return missionFileSchema.parse(source);
}
