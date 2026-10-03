import { z } from "zod";

export const ValidationStatusSchema = z.enum(["PASSED", "FAILED", "WARNING"]);
export type ValidationStatus = z.infer<typeof ValidationStatusSchema>;

export const ValidationLayerSchema = z.enum([
  "PRESENTATION",
  "APPLICATION",
  "DOMAIN",
  "INFRASTRUCTURE",
  "AI_GUARDRAIL",
]);
export type ValidationLayer = z.infer<typeof ValidationLayerSchema>;

export const ValidationErrorItemSchema = z.object({
  code: z.string(), // e.g. "PVC-101", "PVC-4A-01"
  message: z.string(),
  field: z.string().optional(),
});
export type ValidationErrorItem = z.infer<typeof ValidationErrorItemSchema>;

export const ValidationEnvelopeSchema = z.object({
  validationId: z.string(),
  traceId: z.string(),
  validationStatus: ValidationStatusSchema,
  layer: ValidationLayerSchema,
  errors: z.array(ValidationErrorItemSchema),
  timestamp: z.number(),
  clientVersion: z.string().optional(),
});
export type ValidationEnvelope = z.infer<typeof ValidationEnvelopeSchema>;

export function createValidationEnvelope(input: {
  traceId: string;
  status: ValidationStatus;
  layer: ValidationLayer;
  errors?: ValidationErrorItem[];
  clientVersion?: string;
}): ValidationEnvelope {
  return {
    validationId: crypto.randomUUID(),
    traceId: input.traceId,
    validationStatus: input.status,
    layer: input.layer,
    errors: input.errors ?? [],
    timestamp: Date.now(),
    ...(input.clientVersion ? { clientVersion: input.clientVersion } : {}),
  };
}

export const ChatRequestEnvelopeSchema = z.object({
  clientVersion: z.string().default("1.0.0"),
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string().min(1).max(12_000),
    })
  ).min(1).max(100),
  options: z.object({
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
  }).optional(),
});
export type ChatRequestEnvelope = z.infer<typeof ChatRequestEnvelopeSchema>;
