import { publicProcedure, router } from "../_core/trpc.js";
import { z } from "zod";
import { globalEngine } from "../core/engine.js";

export const missionsRouter = router({
  run: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).max(200),
        urls: z.array(z.string().url()).min(1).max(500),
        objective: z.string().trim().min(1).max(5_000),
        maxConcurrency: z.number().int().min(1).max(10).optional(),
        rateLimitMs: z.number().int().min(0).max(60_000).optional(),
        retries: z.number().int().min(0).max(4).optional(),
        timeoutMs: z.number().int().min(1_000).max(60_000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return globalEngine.executeMission(input);
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const res = await globalEngine.getMissionResult(input.id);
      if (!res) {
        throw new Error("Mission not found");
      }
      return res;
    }),

  start: publicProcedure
    .input(z.object({ name: z.string().trim().min(1).max(200), urls: z.array(z.string().url()).min(1).max(500), objective: z.string().trim().min(1).max(5_000), maxConcurrency: z.number().int().min(1).max(10).optional(), rateLimitMs: z.number().int().min(0).max(60_000).optional(), retries: z.number().int().min(0).max(4).optional(), timeoutMs: z.number().int().min(1_000).max(60_000).optional() }))
    .mutation(({ input }) => globalEngine.startMission(input)),

  export: publicProcedure
    .input(z.object({ id: z.string(), format: z.enum(["json", "csv"]) }))
    .query(({ input }) => globalEngine.exportMission(input.id, input.format)),
});
