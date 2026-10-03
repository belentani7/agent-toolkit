import { randomUUID } from "node:crypto";
import type { Express, Request, Response } from "express";
import { listLLMModels } from "./_core/llm";
import { ENV } from "./_core/env";
import { parseChatRequest, toModelMessages } from "../shared/chatPolicy";
import { createValidationEnvelope, type ValidationErrorItem, type ValidationLayer } from "../shared/pvcProtocol";

const API_VERSION = "1.0.0";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitStore = new Map<string, { startedAt: number; count: number }>();

function getClientKey(req: Request): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return req.ip || forwardedValue || "unknown-client";
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(clientKey);
  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientKey, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

const resolveApiUrl = () =>
  ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
    ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
    : "https://forge.manus.im/v1/chat/completions";

function getTraceId(req: Request): string {
  const incoming = typeof req.header === "function"
    ? req.header("x-trace-id")
    : req.headers?.["x-trace-id"];
  const candidate = Array.isArray(incoming) ? incoming[0] : incoming;
  return candidate && /^[a-zA-Z0-9._:-]{8,128}$/.test(candidate) ? candidate : randomUUID();
}

function setProtocolHeaders(res: Response, traceId: string) {
  if (typeof res.setHeader !== "function") return;
  res.setHeader("X-Trace-Id", traceId);
  res.setHeader("X-Client-Version", API_VERSION);
  res.setHeader("Accept-Version", API_VERSION);
}

function sendValidationError(
  res: Response,
  traceId: string,
  statusCode: number,
  layer: ValidationLayer,
  errors: ValidationErrorItem[],
  clientVersion?: string,
) {
  setProtocolHeaders(res, traceId);
  const envelope = createValidationEnvelope({
    traceId,
    status: "FAILED",
    layer,
    errors,
    clientVersion,
  });
  res.status(statusCode).json({ error: errors[0]?.message ?? "La solicitud no es válida.", envelope });
}

export function registerChatStreamRoute(app: Express) {
  app.post("/api/chat/stream", async (req: Request, res: Response) => {
    const traceId = getTraceId(req);
    if (isRateLimited(getClientKey(req))) {
      sendValidationError(res, traceId, 429, "PRESENTATION", [{
        code: "PVC-429",
        message: "Has alcanzado el límite temporal de solicitudes. Inténtalo de nuevo en unos instantes.",
      }]);
      return;
    }
    const parsed = parseChatRequest(req.body);

    if (!parsed.success) {
      sendValidationError(res, traceId, 400, "PRESENTATION", parsed.issues);
      return;
    }

    if (!ENV.forgeApiKey) {
      sendValidationError(res, traceId, 503, "INFRASTRUCTURE", [{
        code: "PVC-503",
        message: "La integración con el modelo no está configurada.",
      }], parsed.data.clientVersion);
      return;
    }

    try {
      const upstream = await fetch(resolveApiUrl(), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${ENV.forgeApiKey}`,
          "x-trace-id": traceId,
          "x-client-version": API_VERSION,
          "accept-version": API_VERSION,
        },
        body: JSON.stringify({
          messages: toModelMessages(parsed.data),
          stream: true,
          ...(parsed.data.options?.model ? { model: parsed.data.options.model } : {}),
          ...(typeof parsed.data.options?.temperature === "number"
            ? { temperature: parsed.data.options.temperature }
            : {}),
        }),
      });

      if (!upstream.ok || !upstream.body) {
        const detail = await upstream.text();
        sendValidationError(res, traceId, upstream.status || 502, "INFRASTRUCTURE", [{
          code: "PVC-502",
          message: detail || "El modelo no pudo responder.",
        }], parsed.data.clientVersion);
        return;
      }

      res.status(200);
      setProtocolHeaders(res, traceId);
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      const reader = upstream.body.getReader();
      let closed = false;
      const closeUpstream = () => {
        if (closed) return;
        closed = true;
        void reader.cancel().catch(() => undefined);
      };

      res.on("close", closeUpstream);

      try {
        while (!closed) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(Buffer.from(value));
        }
      } finally {
        res.removeListener("close", closeUpstream);
        if (!res.writableEnded) res.end();
      }
    } catch (error) {
      console.error(`[Chat stream][${traceId}] Request failed:`, error);
      if (!res.headersSent) {
        sendValidationError(res, traceId, 502, "INFRASTRUCTURE", [{
          code: "PVC-502",
          message: "No se pudo conectar con el modelo.",
        }]);
      } else if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: "La conexión se interrumpió.", traceId })}\n\n`);
        res.end();
      }
    }
  });

  app.get("/api/chat/models", async (req: Request, res: Response) => {
    const traceId = getTraceId(req);
    setProtocolHeaders(res, traceId);
    try {
      const { data } = await listLLMModels();
      res.json({ models: data.map(model => model.id), traceId });
    } catch (error) {
      console.error(`[Chat models][${traceId}] Request failed:`, error);
      res.status(502).json({
        models: [],
        traceId,
        envelope: createValidationEnvelope({
          traceId,
          status: "WARNING",
          layer: "INFRASTRUCTURE",
          errors: [{ code: "PVC-502", message: "No se pudo cargar el catálogo de modelos." }],
        }),
      });
    }
  });
}
