import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { ChatRequestEnvelopeSchema } from "../shared/pvcProtocol";
import { LUMINA_SYSTEM_PROMPT, sanitizeChatText, sanitizeGeneratedText, toModelMessages } from "../shared/chatPolicy";

export const chatRouter = router({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserConversations(ctx.user.id);
  }),
  createConversation: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = await db.createConversation(ctx.user.id, input.title);
      return { id };
    }),
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      return await db.getConversationMessages(input.conversationId);
    }),
  deleteConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.deleteConversation(input.conversationId, ctx.user.id);
      return { success: true };
    }),
  sendMessage: protectedProcedure
    .input(z.object({ conversationId: z.number(), content: z.string() }))
    .mutation(async ({ input }) => {
      // 1. Save user message
      await db.addMessage(input.conversationId, "user", sanitizeChatText(input.content));

      // 2. Fetch all messages in conversation for context
      const history = await db.getConversationMessages(input.conversationId);
      const formattedMessages = history.map(m => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

      // 3. Invoke LLM behind the shared Spanish guardrail policy
      const response = await invokeLLM({
        messages: [{ role: "system", content: LUMINA_SYSTEM_PROMPT }, ...formattedMessages],
      });

      const assistantReply = sanitizeGeneratedText(
        typeof response.choices?.[0]?.message?.content === "string"
          ? response.choices[0].message.content
          : "Lo siento, no he podido procesar tu solicitud en este momento."
      );

      // 4. Save assistant reply
      await db.addMessage(input.conversationId, "assistant", typeof assistantReply === 'string' ? assistantReply : JSON.stringify(assistantReply));

      return { reply: assistantReply };
    }),
  fallback: publicProcedure
    .input(ChatRequestEnvelopeSchema)
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: toModelMessages(input),
        model: input.options?.model,
        temperature: input.options?.temperature,
      });
      const reply = response.choices?.[0]?.message?.content;
      return {
        reply: sanitizeGeneratedText(
          typeof reply === "string" ? reply : "No he podido generar una respuesta en este momento."
        ),
      };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
