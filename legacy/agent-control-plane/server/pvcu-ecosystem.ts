import { evidenceHash } from "./pvcu-core";
import type { PvcProfileDefinition } from "./pvcu-core";

export function exportRegoPolicy(tenantKey: string, profileId: string, definition: PvcProfileDefinition): string {
  const allowedTools = definition.allowedTools ?? [];
  const toolsFormatted = allowedTools.map((t) => `"${t}"`).join(", ");
  return `package paea.suprakernel.${tenantKey}.${profileId}

default allow = false

allow {
  input.autonomyLevel <= ${definition.maxAutonomy ?? 2}
  input.hasGrounding == ${definition.requireGrounding ? "true" : "false"}
  allowed_tool(input.toolName)
}

allowed_tool(tool) {
  tools := {${toolsFormatted}}
  count(tools) == 0
}

allowed_tool(tool) {
  tools := {${toolsFormatted}}
  tools[tool]
}
`;
}

export function exportOtlpTrace(validation: { validationId: string; tenantKey: string; status: string; riskClass: string }, evidenceHashStr: string) {
  return {
    resourceSpans: [
      {
        resource: { attributes: [{ key: "service.name", value: { stringValue: "paea-suprakernel-pvcu" } }, { key: "tenant.key", value: { stringValue: validation.tenantKey } }] },
        scopeSpans: [
          {
            scope: { name: "paea.suprakernel.pvc", version: "1.0.0" },
            spans: [
              {
                traceId: evidenceHashStr.slice(0, 32),
                spanId: evidenceHashStr.slice(32, 48),
                name: `PVC-U Validation [${validation.riskClass}]`,
                status: { code: validation.status === "approved" ? 1 : 2 },
                attributes: [
                  { key: "pvc.validation_id", value: { stringValue: validation.validationId } },
                  { key: "pvc.status", value: { stringValue: validation.status } },
                  { key: "pvc.evidence_hash", value: { stringValue: evidenceHashStr } },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export function exportLangfuseObservation(validation: { validationId: string; tenantKey: string; status: string; riskClass: string }, payload: unknown) {
  return {
    traceId: evidenceHash(validation),
    name: `PAEA PVC-U Validation ${validation.validationId}`,
    metadata: { tenantKey: validation.tenantKey, riskClass: validation.riskClass, status: validation.status },
    input: payload,
    output: { status: validation.status },
    timestamp: new Date().toISOString(),
  };
}
