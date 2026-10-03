import { createHash } from "node:crypto";

export const PIPELINE_STAGES = ["discovery", "analysis", "decision", "execution", "verification", "audit"] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export type AuditInput = {
  previousHash?: string | null;
  actor: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  result: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
};

export function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  return `{${Object.keys(value as Record<string, unknown>).sort().map(key => `${JSON.stringify(key)}:${stableJson((value as Record<string, unknown>)[key])}`).join(",")}}`;
}

export function hashPayload(payload: unknown): string {
  return createHash("sha256").update(stableJson(payload)).digest("hex");
}

export function buildAuditEvent(input: AuditInput) {
  const createdAt = input.createdAt ?? new Date();
  const payload = {
    previousHash: input.previousHash ?? null,
    actor: input.actor,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId ?? null,
    result: input.result,
    metadata: input.metadata ?? {},
    createdAt: createdAt.toISOString(),
  };
  return { ...payload, eventHash: hashPayload(payload) };
}

export function verifyAuditChain(events: Array<{ eventHash: string; previousHash: string | null; actor: string; action: string; resourceType: string; resourceId?: string | null; result: string; metadata?: string | null; createdAt: Date | string }>) {
  let previousHash: string | null = null;
  for (const event of events) {
    if (event.previousHash !== previousHash) return { valid: false, reason: "previous_hash_mismatch", eventHash: event.eventHash };
    let metadata: Record<string, unknown> = {};
    if (event.metadata) {
      if (typeof event.metadata === "string") {
        try { metadata = JSON.parse(event.metadata) as Record<string, unknown>; } catch { return { valid: false, reason: "invalid_metadata", eventHash: event.eventHash }; }
      } else {
        metadata = event.metadata as Record<string, unknown>;
      }
    }
    const expected = buildAuditEvent({ previousHash: event.previousHash, actor: event.actor, action: event.action, resourceType: event.resourceType, resourceId: event.resourceId, result: event.result, metadata, createdAt: new Date(event.createdAt) });
    if (expected.eventHash !== event.eventHash) return { valid: false, reason: "event_hash_mismatch", eventHash: event.eventHash };
    previousHash = event.eventHash;
  }
  return { valid: true, length: events.length, head: previousHash };
}

export function nextRetryDelay(attempt: number): number {
  return Math.min(60_000, 1_000 * 2 ** Math.max(0, attempt - 1));
}
