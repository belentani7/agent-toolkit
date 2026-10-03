import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "node:crypto";
import ZAI from "z-ai-web-dev-sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface PlanStep {
  orden: number;
  skill: string;
  titulo: string;
  detalle: string;
  herramienta: string;
  fase: number;
}

interface AgentPlan {
  diagnostico: string;
  skillsSeleccionadas: Array<{ codigo: string; motivo: string }>;
  pasos: PlanStep[];
  riesgos: string[];
  presupuestoEstimadoUsd: number;
  confianza: number;
}

function extractJson(raw: string): AgentPlan | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as AgentPlan;
  } catch {
    return null;
  }
}

/** GET: historial de ejecuciones del orquestador. */
export async function GET() {
  try {
    const runs = await db.simulationRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
    });
    return NextResponse.json({
      runs: runs.map((r) => ({
        id: r.id,
        objective: r.objective,
        skillsUsed: r.skillsUsed ? r.skillsUsed.split(",").filter(Boolean) : [],
        steps: r.steps,
        durationMs: r.durationMs,
        createdAt: r.createdAt,
        status: r.status,
      })),
    });
  } catch (error) {
    console.error("[api/simulate GET]", error);
    return NextResponse.json({ error: "Error obteniendo simulaciones" }, { status: 500 });
  }
}

/** POST: ejecuta el ORQUESTADOR-01 en vivo sobre el catálogo de skills. */
export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const body = (await req.json().catch(() => ({}))) as { objective?: string };
    const objective = (body.objective ?? "").trim();
    if (objective.length < 8) {
      return NextResponse.json(
        { error: "El objetivo debe tener al menos 8 caracteres." },
        { status: 400 }
      );
    }
    if (objective.length > 600) {
      return NextResponse.json({ error: "Objetivo demasiado largo (máx. 600)." }, { status: 400 });
    }

    // Catálogo real desde la base (códigos + nombres para acotar el prompt)
    const skills = await db.skill.findMany({
      orderBy: { code: "asc" },
      select: { code: true, name: true, tooling: true },
    });
    const catalog = skills.map((s) => `${s.code} · ${s.name} (${s.tooling})`).join("\n");

    const systemPrompt = `Eres ORQUESTADOR-01, el agente supervisor de un ecosistema multi-stack de 62 habilidades. Tu misión: ante un OBJETIVO corporativo, seleccionar las habilidades exactas del catálogo y producir un plan de ejecución riguroso e implacable.

CATÁLOGO DE SKILLS (usa SOLO estos códigos exactos):
${catalog}

Responde EXCLUSIVAMENTE con JSON válido, sin texto adicional, con esta estructura:
{
  "diagnostico": "análisis técnico conciso del objetivo (máx 60 palabras)",
  "skillsSeleccionadas": [{"codigo":"RAZ-01","motivo":"por qué esta skill es necesaria"}],
  "pasos": [{"orden":1,"skill":"RAZ-01","titulo":"nombre del paso","detalle":"acción concreta","herramienta":"tool runtime","fase":2}],
  "riesgos": ["riesgo técnico 1", "riesgo técnico 2"],
  "presupuestoEstimadoUsd": 12.5,
  "confianza": 0.85
}
Reglas: 4-8 pasos; pasos ordenados lógicamente; fases 1-4; confianza entre 0.1 y 0.99; el plan debe ser técnicamente verosímil y específico.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: `OBJETIVO: ${objective}` },
      ],
      thinking: { type: "disabled" },
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const plan = extractJson(raw);

    if (!plan || !Array.isArray(plan.pasos) || plan.pasos.length === 0) {
      return NextResponse.json(
        { error: "El orquestador no produjo un plan válido. Reintenta." },
        { status: 502 }
      );
    }

    const validCodes = new Set(skills.map((s) => s.code));
    const steps: PlanStep[] = plan.pasos
      .filter((p) => p && typeof p.orden === "number" && typeof p.titulo === "string")
      .slice(0, 10)
      .map((p, i) => ({
        orden: p.orden ?? i + 1,
        skill: validCodes.has(p.skill) ? p.skill : "RAZ-01",
        titulo: String(p.titulo).slice(0, 120),
        detalle: String(p.detalle ?? "").slice(0, 400),
        herramienta: String(p.herramienta ?? "runtime").slice(0, 80),
        fase: Number(p.fase) >= 1 && Number(p.fase) <= 4 ? Number(p.fase) : 2,
      }));

    const skillsUsed = Array.from(
      new Set(steps.map((s) => s.skill))
    );
    const confianza = Math.min(0.99, Math.max(0.1, Number(plan.confianza) || 0.7));

    const run = await db.simulationRun.create({
      data: {
        objective,
        model: "glm-4.7",
        status: confianza < 0.6 ? "DEGRADADO" : "COMPLETADO",
        plan: JSON.stringify({ ...plan, pasos: steps }),
        skillsUsed: skillsUsed.join(","),
        steps: steps.length,
        durationMs: Date.now() - startedAt,
      },
    });

    await db.auditEvent.create({
      data: {
        agentCode: "ORQUESTADOR-01",
        action: "SIMULACION:PLAN",
        entity: "simulation_run",
        entityId: run.id,
        severity: confianza < 0.6 ? "WARN" : "INFO",
        payloadHash: createHash("sha256")
          .update(`${objective}|${steps.length}|${startedAt}`)
          .digest("hex")
          .slice(0, 16),
      },
    });

    return NextResponse.json({
      id: run.id,
      objective,
      model: "glm-4.7",
      diagnostico: String(plan.diagnostico ?? "").slice(0, 500),
      skillsSeleccionadas: (plan.skillsSeleccionadas ?? [])
        .filter((s) => s && validCodes.has(s.codigo))
        .slice(0, 10)
        .map((s) => ({ codigo: s.codigo, motivo: String(s.motivo ?? "").slice(0, 200) })),
      pasos: steps,
      riesgos: (plan.riesgos ?? []).slice(0, 6).map((r) => String(r).slice(0, 200)),
      presupuestoEstimadoUsd: Number(plan.presupuestoEstimadoUsd) || 0,
      confianza,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[api/simulate POST]", error);
    return NextResponse.json(
      { error: "Fallo del orquestador. Reintenta en unos segundos." },
      { status: 500 }
    );
  }
}
