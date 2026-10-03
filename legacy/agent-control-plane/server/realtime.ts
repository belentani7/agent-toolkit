import type { Express, Request, Response } from "express";
import { createContext } from "./_core/context";
import { getPvcTenant, listPvcOutbox } from "./pvcu-db";

export function formatSseEvent(event: string, data: unknown, id?: string) {
  const lines = [`event: ${event}`];
  if (id) lines.push(`id: ${id}`);
  lines.push(`data: ${JSON.stringify(data)}`, "", "");
  return lines.join("\n");
}

function queryValue(value: Request["query"][string]) {
  return typeof value === "string" ? value : undefined;
}

export type SsePollState = {
  isClosed: () => boolean;
  seen: Set<string>;
  write: (chunk: string) => void;
};

export async function pollPvcOutbox(tenantKey: string, state: SsePollState) {
  if (state.isClosed()) return;
  try {
    const events = await listPvcOutbox(tenantKey);
    for (const event of events.slice().reverse()) {
      if (state.seen.has(event.eventId)) continue;
      state.seen.add(event.eventId);
      state.write(formatSseEvent("pvc.outbox", {
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        status: event.status,
        eventHash: event.eventHash,
        createdAt: event.createdAt,
      }, event.eventId));
    }
  } catch {
    state.write(formatSseEvent("error", { code: "OUTBOX_UNAVAILABLE", retryable: true }));
  }
}

export function registerPvcRealtimeRoutes(app: Express) {
  app.get("/api/pvcu/stream", async (req: Request, res: Response) => {
    const context = await createContext({ req, res } as never);
    if (!context.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const tenantKey = queryValue(req.query.tenantKey);
    if (!tenantKey) {
      res.status(400).json({ error: "tenantKey is required" });
      return;
    }

    const tenant = await getPvcTenant(tenantKey, context.user.openId, context.user.role === "admin");
    if (!tenant) {
      res.status(403).json({ error: "Tenant scope is not available" });
      return;
    }

    res.status(200).set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders();
    res.write(formatSseEvent("ready", { tenantKey, heartbeatSeconds: 15 }));

    const seen = new Set<string>();
    let closed = false;
    const poll = () => pollPvcOutbox(tenantKey, { isClosed: () => closed, seen, write: (chunk) => res.write(chunk) });

    const heartbeat = setInterval(() => {
      if (!closed) res.write(": heartbeat\n\n");
    }, 15_000);
    const polling = setInterval(() => void poll(), 3_000);
    void poll();

    req.on("close", () => {
      closed = true;
      clearInterval(heartbeat);
      clearInterval(polling);
    });
  });
}
