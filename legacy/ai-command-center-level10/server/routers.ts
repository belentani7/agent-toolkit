import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getProviderStatuses, runChat } from "./ai/providers";
import { providerIds } from "../shared/ai";
import { missionsRouter } from "./routers/missions";

const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().trim().min(1).max(100_000),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  ai: router({
    providers: publicProcedure.query(() => getProviderStatuses()),
    chat: protectedProcedure
      .input(z.object({
        provider: z.enum(providerIds),
        model: z.string().trim().min(1).max(200),
        baseUrl: z.string().url().optional(),
        messages: z.array(chatMessageSchema).min(1).max(100),
      }))
      .mutation(async ({ input }) => runChat(input)),
  }),
  missions: missionsRouter,
});

export type AppRouter = typeof appRouter;
