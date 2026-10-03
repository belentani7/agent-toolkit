/**
 * NEXUS-Ω · Seed del Ecosistema Agéntico Multi-Stack
 * - 9 sub-dominios · 62 skills agénticas
 * - 4 fases del ciclo de vida + 16 hitos
 * - 470 repositorios reales (export GitHub @belentani7)
 * - Cadena de auditoría inicial
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";

const prisma = new PrismaClient();

// ── Categorías ───────────────────────────────────────────────
const CATEGORIES = [
  {
    code: "RAZ",
    name: "Razonamiento Complejo y Orquestación",
    description:
      "Núcleo cognitivo: planificación dinámica, autoreflexión, debate adversarial y control de alucinaciones.",
    colorKey: "emerald",
    order: 1,
  },
  {
    code: "FSE",
    name: "Ingeniería Full-Stack y Generación de Código",
    description:
      "Fabricación de software: refactorización multi-archivo, tests, CI/CD, debugging y optimización.",
    colorKey: "teal",
    order: 2,
  },
  {
    code: "INF",
    name: "Persistencia e Infraestructura (Supabase)",
    description:
      "Esquemas relacionales, PL/pgSQL, RLS, colas transaccionales e índices vectoriales pgvector.",
    colorKey: "amber",
    order: 3,
  },
  {
    code: "MCP",
    name: "Interoperabilidad e Integración (MCP)",
    description:
      "Model Context Protocol: consumo de herramientas, mTLS, streaming de recursos y sandbox de ejecución.",
    colorKey: "lime",
    order: 4,
  },
  {
    code: "SEG",
    name: "Cumplimiento Legal, Privacidad y Seguridad",
    description:
      "GDPR/CCPA, SAST, fugas de credenciales, RBAC, cifrado y cadena de custodia hash.",
    colorKey: "rose",
    order: 5,
  },
  {
    code: "DEV",
    name: "DevOps y Fiabilidad",
    description:
      "Observabilidad, IaC, auto-escalado, gestión de secretos, rollbacks y FinOps.",
    colorKey: "orange",
    order: 6,
  },
  {
    code: "WSC",
    name: "Web Scraping Avanzado",
    description:
      "Crawling distribuido respetuoso, parsing adversarial y extracción estructurada.",
    colorKey: "fuchsia",
    order: 7,
  },
  {
    code: "FIN",
    name: "Finanzas y Facturación",
    description:
      "Facturación electrónica, conciliación, detección de fraude y reporting fiscal.",
    colorKey: "yellow",
    order: 8,
  },
  {
    code: "SOP",
    name: "Soporte y Atención",
    description:
      "Triaje inteligente, knowledge base auto-sintetizada y escalado proactivo.",
    colorKey: "cyan",
    order: 9,
  },
];

// ── 62 Skills ────────────────────────────────────────────────
type SkillSeed = [
  code: string,
  name: string,
  description: string,
  executionLogic: string,
  tooling: string,
  complexity: "BÁSICA" | "MEDIA" | "ALTA" | "EXTREMA",
  phase: number,
  criticality: "NÚCLEO" | "ALTA" | "MEDIA" | "BAJA",
];

const SKILLS: Record<string, SkillSeed[]> = {
  RAZ: [
    ["RAZ-01", "Planificación Dinámica HTN", "Descompone el objetivo macro en un DAG de tareas con precondiciones, recursos y criticidad; replanifica parcialmente cuando un nodo falla sin derribar el grafo.", "Motor HTN + scheduler de dependencias topológico con costes marginales por rama", "planner-dag · cola de tareas transaccional", "ALTA", 1, "NÚCLEO"],
    ["RAZ-02", "Autoreflexión Post-Ejecución", "Tras cada acción evalúa el resultado contra criterios de éxito explícitos y emite deltas de aprendizaje que alimentan la memoria episódica.", "Loop critic→revise→apply con umbral de aceptación por dimensión", "reflection-harness · memoria_episodica (pgvector)", "ALTA", 2, "NÚCLEO"],
    ["RAZ-03", "Debate Multi-Agente", "Tres o más agentes adversariales defienden hipótesis contrapuestas; un juez pondera afirmaciones por evidencia anclada y nivel de confianza.", "Protocolo de turnos con presupuestado de tokens + scoring bayesiano del juez", "debate-protocol · judge-agent", "EXTREMA", 3, "ALTA"],
    ["RAZ-04", "Tree-of-Thoughts con Poda Heurística", "Expande ramas de razonamiento en paralelo, puntúa cada rama con heurística LLM y poda por límite de coste/valor para evitar explosión combinatoria.", "BFS best-first con valoración por rama y presupuesto máximo de expansión", "tot-search · beam-width=4", "EXTREMA", 3, "ALTA"],
    ["RAZ-05", "Autocrítica Algorítmica", "Puntúa cada salida contra una rúbrica dimensional (corrección, completitud, seguridad, estilo) y bloquea la entrega bajo umbral mínimo.", "rubric-scorer multi-dimensión + quality-gate binario", "rubric-engine · gates CI", "MEDIA", 2, "ALTA"],
    ["RAZ-06", "Detección de Alucinaciones en Tiempo Real", "Verifica cada afirmación factual contra fuentes recuperadas (retrieval) y marca los spans no soportados antes de emitir respuesta.", "Groundedness-check por span + NLI (entailment/contradiction) contra citas", "groundedness-checker · retrieval augmentado", "ALTA", 4, "NÚCLEO"],
    ["RAZ-07", "Memoria de Trabajo Compartida (Blackboard)", "Espacio de tuplas versionado donde agentes publican hallazgos, reclaman tareas y detectan colisiones sin acoplamiento directo.", "Patrón blackboard con MVCC y suscripciones por patrón de clave", "blackboard-store · pub/sub", "ALTA", 3, "ALTA"],
    ["RAZ-08", "Re-planificación ante Fallos", "Aplica políticas de fallback graduadas (retry con backoff, degradación de modo, escalado a supervisor) según clase y severidad del fallo.", "Circuit breaker + policy engine con matriz fallo→acción", "circuit-breaker · policy-yaml", "MEDIA", 2, "ALTA"],
    ["RAZ-09", "Desambiguación Interactiva", "Detecta ambigüedad de objetivo y formula el conjunto mínimo de preguntas de clarificación ordenadas por entropía informativa.", "Selección de pregunta por reducción máxima de entropía del espacio de hipótesis", "ambiguity-detector · entropy-rank", "MEDIA", 2, "MEDIA"],
    ["RAZ-10", "Razonamiento Contrafactual", "Simula escenarios what-if (branch shadow) para estimar riesgo de decisiones antes de comprometer recursos irreversibles.", "Sandbox de simulación con clonación de estado y métricas de riesgo", "what-if-sandbox · risk-metrics", "ALTA", 4, "MEDIA"],
    ["RAZ-11", "Compresión de Contexto Jerárquica", "Mantiene la ventana de contexto en presupuesto: resume, decae y jerarquiza memoria según relevancia y recencia (curva de olvido).", "Resumen extractivo por segmentos + política de decaimiento por recencia/relevancia", "context-compressor · forgetting-curve", "ALTA", 2, "NÚCLEO"],
  ],
  FSE: [
    ["FSE-01", "Refactorización Multi-Archivo", "Transforma el AST de N archivos coordinando renombrados, contratos de imports y tests afectados en una sola transacción de código.", "Codemods AST conscientes del grafo de dependencias del repo", "ts-morph · dependency-graph", "EXTREMA", 3, "NÚCLEO"],
    ["FSE-02", "Generación de Tests Unitarios", "Deriva casos de prueba de particiones de equivalencia y valores límite a partir de firmas tipadas y contratos documentados.", "Test synthesis guiada por cobertura semántica (ramas, límites, errores)", "vitest · coverage-driven-gen", "ALTA", 2, "ALTA"],
    ["FSE-03", "Tests E2E con Playwright", "Especifica journeys de usuario y genera specs E2E con selectores resilientes (rol, etiqueta ARIA) y aserciones de red.", "Codegen de escenarios con estabilización de flakiness por reintento determinista", "playwright · a11y-selectors", "ALTA", 2, "ALTA"],
    ["FSE-04", "CI/CD Sintáctico", "Emite pipelines YAML (lint→test→build→deploy) adaptados al stack detectado, con cachés y matrices de versión.", "Detector de stack + plantillas paramétricas de pipeline", "pipeline-templates · stack-detector", "MEDIA", 2, "MEDIA"],
    ["FSE-05", "Resolución de Dependencias", "Resuelve conflictos de rangos semver y rompe ciclos de imports mediante análisis de grafo y sugiere pines exactos.", "SAT solver sobre rangos semver + desactivación de ciclos por inversión", "semver-solver · madge", "ALTA", 3, "ALTA"],
    ["FSE-06", "Debugging por Traza de Error", "Correlaciona stack traces (con sourcemaps) con el código fuente, genera hipótesis de causa raíz y propone parches mínimos.", "Mapeo de traza + bisección estadística de commits sospechosos", "sourcemap-resolver · git-bisect-agent", "ALTA", 2, "NÚCLEO"],
    ["FSE-07", "Migraciones Zero-Downtime", "Aplica el patrón expand→migrate→contract sobre esquemas vivos con backfills por lotes y verificación de dual-write.", "Generador de fases de migración con comprobación de invarianza de datos", "prisma-migrate · expand-contract", "EXTREMA", 3, "ALTA"],
    ["FSE-08", "Code Review Automatizado", "Revisa diffs con rúbrica de seguridad, rendimiento y estilo; emite comentarios anclados por línea con severidad.", "Parsing de diff + revisión por rúbrica anclada a hunk", "review-rubric · diff-anchors", "MEDIA", 2, "MEDIA"],
    ["FSE-09", "Documentación Viva", "Genera y sincroniza JSDoc/ADR cuando cambian contratos públicos (APIs, tipos exportados, eventos).", "Extracción de superficie de API + detección de drift doc/código", "api-extractor · adr-templates", "MEDIA", 2, "BAJA"],
    ["FSE-10", "Optimización de Rendimiento", "Detecta hot paths vía profiling de llamadas y aplica memoización, carga diferida o paralelización justificada por medición.", "Análisis de flamegraph + presupuesto de latencia p95 por operación", "profiler · flamegraph-analyzer", "ALTA", 3, "MEDIA"],
  ],
  INF: [
    ["INF-01", "Generación de Esquemas Relacionales", "Diseña modelos en 3FN con desnormalización selectiva justificada, integridad referencial y restricciones CHECK de negocio.", "Síntesis DDL desde modelo de dominio + análisis de patrones de consulta", "prisma-schema · DDL-compiler", "ALTA", 1, "NÚCLEO"],
    ["INF-02", "Triggers PL/pgSQL", "Codifica invariantes de negocio como triggers BEFORE/AFTER con manejo de excepciones y reentrada segura.", "Generador PL/pgSQL con test de disparo y reversión idempotente", "plpgsql-generator · trigger-tests", "MEDIA", 1, "ALTA"],
    ["INF-03", "Políticas RLS", "Genera políticas Row Level Security por tenant y rol con tests automáticos de aislamiento entre inquilinos.", "Compilador de políticas RLS + suite de aislamiento (cross-tenant probes)", "supabase-rls · isolation-suite", "ALTA", 4, "NÚCLEO"],
    ["INF-04", "Colas Transaccionales", "Implementa colas sobre Postgres (SELECT … FOR UPDATE SKIP LOCKED) consumidas por Edge Functions con reintentos y DLQ.", "Worker-pool con SKIP LOCKED, visibilidad diferida y cola de muertos", "pg-queue · supabase-functions", "ALTA", 3, "ALTA"],
    ["INF-05", "Índices Vectoriales pgvector", "Crea índices ANN (HNSW/IVFFlat) calibrando parámetros (m, ef_construction, lists) según cardinalidad y recall objetivo.", "Afinador de índices ANN con benchmark recall/latencia por configuración", "pgvector · ann-tuner", "EXTREMA", 3, "NÚCLEO"],
    ["INF-06", "Particionado y Retención", "Particiona tablas de eventos por rango temporal con purga automática y archivado frío conforme a política legal.", "Particionado por rango + job de retención con ventana legal paramétrica", "pg-partman · retention-jobs", "MEDIA", 3, "MEDIA"],
    ["INF-07", "Backups y PITR", "Define estrategia de point-in-time recovery con RPO/RTO explícitos y simulacros de restauración programados.", "PITR con verificación de restauración en entorno espejo aislado", "supabase-pitr · restore-drills", "ALTA", 4, "ALTA"],
    ["INF-08", "Optimización de Queries", "Analiza planes EXPLAIN ANALYZE, detecta escaneos secuenciales costosos y propone índices o reescrituras cuantificadas.", "Plan analyzer con estimación de ahorro por reescritura", "explain-analyzer · index-advisor", "ALTA", 3, "MEDIA"],
  ],
  MCP: [
    ["MCP-01", "Consumo Nativo de Tools MCP", "Cliente que descubre, valida (JSON Schema) y ejecuta herramientas de servidores MCP externos con timeout y presupuesto por llamada.", "Discovery → validación de esquema → ejecución con presupuesto y captura de E/S", "@modelcontextprotocol/sdk (client)", "ALTA", 1, "NÚCLEO"],
    ["MCP-02", "Mapeo Dinámico JSON-RPC", "Adapta respuestas heterogéneas de servidores MCP a los esquemas internos del agente en runtime, con coerción tipada segura.", "Mapeo declarativo JSON Schema→JSON Schema con coercion y validación estricta", "json-schema-mapper", "MEDIA", 2, "ALTA"],
    ["MCP-03", "mTLS para Servidores MCP", "Autenticación mutua TLS con certificados por agente, SANs restringidos y rotación programada sin downtime.", "Handshake mTLS + pinning de certificado y revocación por CRL interna", "node-tls · cert-manager", "EXTREMA", 4, "NÚCLEO"],
    ["MCP-04", "Paginación y Streaming de Recursos", "Consume recursos MCP con cursor pagination y streaming incremental (SSE) manteniendo backpressure.", "Cliente de recursos con cursors opacos, reanudación y ventana de backpressure", "sse-client · cursor-paginator", "MEDIA", 2, "MEDIA"],
    ["MCP-05", "Servidor MCP de Filesystem", "Expone operaciones de sistema de archivos con jail de rutas, cuota de escritura y auditoría por operación.", "Validación canónica de rutas (path jail) + límites de tamaño y frecuecia", "mcp-server-stdio · chroot-jail", "ALTA", 1, "NÚCLEO"],
    ["MCP-06", "Registro y Descubrimiento", "Catálogo versionado de herramientas MCP con health-check periódico, degradación y circuit breaker por servidor.", "Registry con versionado semántico de tools + sondeo de salud", "tool-registry · health-probes", "MEDIA", 3, "ALTA"],
    ["MCP-07", "Sandbox de Herramientas", "Ejecuta tools en aislamiento con límites de CPU/memoria/E/S y captura completa de efectos para reversión.", "Ejecutor enjaulado con seccomp/namespace y snapshot de efectos", "sandbox-exec · effect-log", "EXTREMA", 4, "NÚCLEO"],
  ],
  SEG: [
    ["SEG-01", "Anonimización de Datos en Vuelo", "Enmascara PII (regex + NER) en el stream de datos antes de persistencia o envío a modelos externos, con k-anonimato verificado.", "Pipeline scrubber regex+NER en el stream, con diccionario de seudónimos reversible solo bajo custodia", "pii-scrubber · ner-anonymizer", "ALTA", 4, "NÚCLEO"],
    ["SEG-02", "Auditoría GDPR/CCPA", "Evalúa flujos de datos contra bases legales, minimización y derechos ARSCL (acceso, rectificación, supresión, cancelación, limitación) por proceso.", "Motor de reglas de cumplimiento con trazas de decisión por artículo normativo", "compliance-engine · gdpr-ruleset", "EXTREMA", 4, "NÚCLEO"],
    ["SEG-03", "Análisis SAST", "Análisis estático de vulnerabilidades contra OWASP Top 10 y catálogo CWE, con priorización por explotabilidad (EPSS).", "Reglas semánticas multi-lenguaje + priorización CVSS×EPSS", "semgrep · codeql-rules", "ALTA", 4, "NÚCLEO"],
    ["SEG-04", "Detección de Fugas de Credenciales", "Escanea código, configuración y logs buscando secretos por entropía y patrones; verifica exposición y fuerza rotación.", "Detección por entropía de Shannon + diccionario de proveedores + verificación de validez", "gitleaks · entropy-detector", "ALTA", 4, "NÚCLEO"],
    ["SEG-05", "RBAC Granular", "Roles jerárquicos con permisos a nivel skill, recurso y entorno; denegación por defecto y revisión periódica de accesos.", "Motor de políticas (estilo OPA) con evaluación deny-by-default y dump auditable de decisiones", "policy-engine · rbac-model", "ALTA", 3, "NÚCLEO"],
    ["SEG-06", "Red Teaming", "Simula adversarios (prompt injection, exfiltración por tool, cadena de mando falsa) contra el propio ecosistema y reporta hallazgos.", "Harness adversarial con mutaciones de ataque y scoring de resistencia", "adversarial-harness · attack-corpus", "EXTREMA", 4, "ALTA"],
    ["SEG-07", "Cifrado en Reposo/Tránsito", "AES-256-GCM en reposo con claves rotativas y TLS 1.3 en tránsito; gestión de claves bajo KMS con separación de duties.", "Cifrado de envolvente (envelope encryption) con data keys efímeras por registro", "kms · tls-1.3-terminator", "ALTA", 4, "NÚCLEO"],
    ["SEG-08", "Cadena de Custodia Hash", "Registro inmutable de acciones críticas con encadenamiento SHA-256 (cada evento firma el hash del anterior) y anclaje externo periódico.", "Hash chain append-only con verificación de integridad O(n) y anclaje diario en almacenamiento WORM", "sha-256-chain · worm-anchor", "EXTREMA", 4, "NÚCLEO"],
  ],
  DEV: [
    ["DEV-01", "Observabilidad OTel", "Instrumenta trazas distribuidas y métricas RED (rate, errors, duration) por skill y por agente.", "SDK OpenTelemetry con context propagation a través de colas", "otel-sdk · trace-exporter", "MEDIA", 2, "ALTA"],
    ["DEV-02", "IaC Declarativo", "Provisiona entornos reproducibles (Supabase, MCP servers, red) desde definición versionada.", "Plantillas Terraform/CLI idempotentes con drift detection", "terraform · supabase-cli", "MEDIA", 1, "ALTA"],
    ["DEV-03", "Auto-escalado de Workers", "Escala workers según profundidad de cola y latencia p95, con presupuesto máximo de instancias.", "Política HPA sobre métricas de cola + presupuesto de coste duro", "autoscaler · queue-metrics", "ALTA", 3, "MEDIA"],
    ["DEV-04", "Gestión de Secretos", "Rotación programada con referencia indirecta: ningún secreto entra nunca en un prompt; solo handles.", "Bóveda con handles opacos e inyección en runtime del tool", "vault · secret-handles", "ALTA", 4, "NÚCLEO"],
    ["DEV-05", "Rollbacks Seguros", "Despliegues canary/blue-green con revert automático por SLO y ventana de observación.", "Orquestador de despliegue con análisis estadístico de regresión por cohortes", "deploy-orchestrator · slo-analysis", "MEDIA", 3, "ALTA"],
    ["DEV-06", "FinOps y Control de Costes", "Presupuestos por agente y por skill con corte duro de ejecución y previsión semanal de consumo.", "Medidores de coste por llamada + política de corte y alerta proactiva", "cost-meters · budget-gates", "MEDIA", 3, "MEDIA"],
  ],
  WSC: [
    ["WSC-01", "Crawling Distribuido Respetuoso", "Orquesta crawlers con cumplimiento de robots.txt, rate-limit por dominio y prioridad de URL por frescura/relevancia.", "Frontera de cola priorizada con politeness por host y presupuesto de cortesía", "frontier-queue · robots-parser", "MEDIA", 3, "MEDIA"],
    ["WSC-02", "Parsing de DOM Adversarial", "Extrae datos de DOM dinámicos con selectores resilientes y fallback de comprensión visual (VLM) ante ofuscación.", "Selectores con anclaje semántico + fallback de captura y análisis visual", "dom-parser · vlm-fallback", "ALTA", 3, "MEDIA"],
    ["WSC-03", "Rotación Ética de Sesiones", "Gestiona pools de proxies/sesiones bajo cumplimiento estricto de ToS y términos de servicio del objetivo.", "Pool de sesiones con health-score, enfriamiento y rotación por fairness", "session-pool · proxy-manager", "MEDIA", 3, "BAJA"],
    ["WSC-04", "Extracción Estructurada", "Convierte contenido heterogéneo en entidades JSON validadas contra esquema, con puntuación de confianza por campo.", "Extracción guiada por JSON Schema con validación estricta y campos de confianza", "schema-extractor · json-validation", "ALTA", 3, "MEDIA"],
  ],
  FIN: [
    ["FIN-01", "Facturación Electrónica", "Emite facturas conformes por jurisdicción con triple coincidencia (pedido-recepción-factura) y envío fiscal certificado.", "Motor de facturación con plantillas fiscales por jurisdicción y firma XAdES", "e-invoice-engine · xades-signer", "ALTA", 4, "MEDIA"],
    ["FIN-02", "Conciliación Bancaria", "Castea transacciones internas contra extractos con tolerancia difusa y resolución asistida de discrepancias.", "Emparejamiento difuso (montes/fechas/referencias) con cola de excepciones", "fuzzy-matcher · exception-queue", "MEDIA", 4, "BAJA"],
    ["FIN-03", "Detección de Fraude", "Modelos de anomalía sobre patrones de gasto con explicabilidad por contribución de variable.", "Detección de anomalías (isolation forest) + explicación SHAP por alerta", "anomaly-detector · shap-explainer", "ALTA", 4, "MEDIA"],
    ["FIN-04", "Reporting Fiscal", "Genera reportes regulatorios con trazabilidad de cálculo celda a dato de origen.", "Compilador de reportes con linaje de datos por celda y snapshot de cálculo", "report-compiler · lineage-graph", "MEDIA", 4, "BAJA"],
  ],
  SOP: [
    ["SOP-01", "Triaje Inteligente de Tickets", "Clasifica por urgencia e impacto, detecta duplicados semánticos y enruta con SLA contractual.", "Clasificador de intención + deduplicación vectorial + router con SLA", "intent-router · dedup-vectorial", "MEDIA", 3, "MEDIA"],
    ["SOP-02", "Generación de Knowledge Base", "Sintetiza resoluciones repetidas en artículos de KB versionados con validación humana asistida.", "Clustering de resoluciones + síntesis estructurada con revisión asistida", "kb-synthesizer · cluster-engine", "MEDIA", 3, "BAJA"],
    ["SOP-03", "Escalado Proactivo", "Detecta patrones de insatisfacción y riesgo de churn; escala con contexto completo antes de la queja explícita.", "Scoring de riesgo por sentimiento+historia + regla de escalado anticipado", "risk-scoring · proactive-escalation", "MEDIA", 3, "BAJA"],
    ["SOP-04", "Soporte Multilingüe", "Resuelve tickets en el idioma del cliente con glosarios de dominio y detección de registro formal/informal.", "Detección de idioma + traducción con glosario de dominio y memoria de traducción", "i18n-engine · tm-glossary", "MEDIA", 3, "BAJA"],
  ],
};

// ── Fases e hitos ────────────────────────────────────────────
const PHASES = [
  {
    number: 1,
    name: "Fundación e Infraestructura",
    objective:
      "Levantar el sustrato físico del ecosistema: proyecto Supabase con pgvector, esquema núcleo (agentes/memoria/auditoría), servidores MCP base y pipeline CI reproducible.",
    duration: "Semanas 1–4",
    status: "EN_CURSO",
    deliverables: JSON.stringify([
      "Proyecto Supabase (cloud/local) con extensiones pgvector + pgcrypto",
      "Esquema núcleo desplegado: agentes, memoria_episodica, auditoria_legal",
      "Servidor MCP de filesystem operativo (stdio + mTLS)",
      "Pipeline CI con entorno reproducible vía IaC",
      "VPC/subredes y roles base provisionados",
    ]),
    risks:
      "Configuración errónea de RLS en el arranque; coste de índices HNSW mal calibrados; dependencia de proveedor cloud.",
    milestones: [
      ["F1-M1", "Proyecto Supabase + extensiones", "Crear proyecto, habilitar pgvector/pgcrypto, roles de servicio y política de red.", "S1"],
      ["F1-M2", "Esquema núcleo desplegado", "Aplicar migraciones 01–04 (agentes, memoria, auditoría, RLS) y smoke-tests de integridad.", "S2"],
      ["F1-M3", "Servidor MCP filesystem operativo", "mcp-server-stdio con path-jail, cuotas y auditoría por operación; certificados mTLS emitidos.", "S3"],
      ["F1-M4", "Pipeline CI reproducible", "IaC + GitHub Actions con entornos efímeros y verificación de drift.", "S4"],
    ],
  },
  {
    number: 2,
    name: "Ingesta de Habilidades",
    objective:
      "Inyectar y testear unitariamente las 62 skills agénticas con un harness de evaluación por umbrales de calidad y presupuestado de costes.",
    duration: "Semanas 5–10",
    status: "EN_PLAN",
    deliverables: JSON.stringify([
      "62 skills implementadas con tests de contrato",
      "Harness de evaluación (evals) con umbrales por skill",
      "Suite de código (FSE) validada sobre repos de prueba",
      "Skills INF validadas contra Supabase real",
      "Observabilidad OTel activa por skill",
    ]),
    risks:
      "Skills con calidad insuficiente en evals adversariales; explosión de coste de evaluación; acoplamiento oculto entre skills.",
    milestones: [
      ["F2-M1", "Núcleo RAZ operativo", "10 skills de razonamiento con evals de planificación y reflexión superadas (umbral 0.85).", "S5–6"],
      ["F2-M2", "Suite FSE completa", "Refactor, tests, CI/CD y debugging validados sobre corpus sintético + repos reales.", "S7"],
      ["F2-M3", "Skills INF sobre Supabase real", "RLS, triggers, colas y pgvector verificados en entorno staging con datos sintéticos.", "S8"],
      ["F2-M4", "Harness de evaluación v1", "Evals versionadas, presupuestado por skill y gates de calidad en CI.", "S9–10"],
    ],
  },
  {
    number: 3,
    name: "Multi-Stack Merge",
    objective:
      "Activar el protocolo de comunicación inter-agente (Supervisor-Worker) y la indexación masiva del corpus de 1.000 repositorios con búsqueda semántica transversal.",
    duration: "Semanas 11–16",
    status: "EN_PLAN",
    deliverables: JSON.stringify([
      "Protocolo Supervisor-Worker v1 con blackboard compartido",
      "Ingesta e indexación del corpus completo (webhooks activos)",
      "Búsqueda semántica transversal por similitud de coseno",
      "Colas transaccionales con auto-escalado de workers",
      "Refactorización multi-archivo operativa entre stacks",
    ]),
    risks:
      "Contención en la memoria episódica compartida; ruido semántico del corpus masivo; degradación de recall en índices ANN.",
    milestones: [
      ["F3-M1", "Protocolo Supervisor-Worker v1", "Orquestación de sub-agentes con presupuesto, trazas y debate adversarial activo.", "S11"],
      ["F3-M2", "Indexación del corpus", "Webhooks GitHub/GitLab → Edge Functions → chunking → embeddings → pgvector (HNSW).", "S12–13"],
      ["F3-M3", "Búsqueda semántica transversal", "Recall@10 ≥ 0.9 sobre corpus de prueba anotado; latencia p95 < 120 ms.", "S14"],
      ["F3-M4", "Producción multi-stack", "Colas SKIP LOCKED + auto-escalado + FinOps en verde.", "S15–16"],
    ],
  },
  {
    number: 4,
    name: "Hardening de Seguridad y Cumplimiento",
    objective:
      "Auditoría de fallos, cifrado integral en reposo/tránsito, simulación de ataques (Red Teaming) y certificación GDPR/CCPA previa a go-live.",
    duration: "Semanas 17–20",
    status: "EN_PLAN",
    deliverables: JSON.stringify([
      "SAST + fugas de credenciales integradas en CI (gate bloqueante)",
      "RLS verificada con suite de aislamiento cross-tenant",
      "Auditoría inmutable con anclaje externo verificado",
      "Ejercicio de Red Teaming con reporte de hallazgos y remediación",
      "DPIA/ROPA completos y certificación de cumplimiento",
    ]),
    risks:
      "Hallazgos críticos de Red Teaming que retrasen go-live; fricción de latencia por cifrado; costo de remediación de deuda técnica de seguridad.",
    milestones: [
      ["F4-M1", "Gates de seguridad en CI", "SAST + gitleaks + SCA bloqueantes; políticas de excepción firmadas.", "S17"],
      ["F4-M2", "Aislamiento verificado", "Suite de penetración RLS: cero accesos cross-tenant; PITR probado con restauración real.", "S18"],
      ["F4-M3", "Red Teaming ejecutado", "10 escenarios adversariales ejecutados; hallazgos priorizados y remediados los críticos.", "S19"],
      ["F4-M4", "Certificación y go-live", "DPIA firmada, ROPA completo, auditoría inmutable anclada y go-live autorizado.", "S20"],
    ],
  },
];

function hashPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
}

async function main() {
  console.log("🧹 Limpiando estado previo…");
  await prisma.simulationRun.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.repoSource.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();

  // 1. Categorías
  const catMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await prisma.skillCategory.create({ data: cat });
    catMap.set(cat.code, created.id);
  }
  console.log(`✅ ${CATEGORIES.length} categorías`);

  // 2. Skills
  let skillCount = 0;
  for (const [catCode, skills] of Object.entries(SKILLS)) {
    for (const [code, name, description, executionLogic, tooling, complexity, phase, criticality] of skills) {
      await prisma.skill.create({
        data: {
          code,
          name,
          description,
          executionLogic,
          tooling,
          complexity,
          phase,
          criticality,
          status: phase === 1 ? "IMPLEMENTADA" : "ESPECIFICADA",
          categoryId: catMap.get(catCode)!,
        },
      });
      skillCount++;
    }
  }
  console.log(`✅ ${skillCount} skills`);

  // 3. Fases + hitos
  for (const p of PHASES) {
    const phase = await prisma.phase.create({
      data: {
        number: p.number,
        name: p.name,
        objective: p.objective,
        duration: p.duration,
        status: p.status,
        deliverables: p.deliverables,
        risks: p.risks,
      },
    });
    for (const [code, title, description, week] of p.milestones) {
      await prisma.milestone.create({
        data: {
          code,
          title,
          description,
          week,
          status: p.status === "EN_CURSO" ? "EN_CURSO" : "PENDIENTE",
          phaseId: phase.id,
        },
      });
    }
  }
  console.log(`✅ ${PHASES.length} fases · ${PHASES.reduce((a, p) => a + p.milestones.length, 0)} hitos`);

  // 4. Repos reales del export GitHub
  const raw = readFileSync("/home/z/my-project/upload/GITHUB-BELENTANI7-COMPLETE.json", "utf-8");
  const exportData = JSON.parse(raw.replace(/^\uFEFF/, "")) as {
    repositories: { value: Array<Record<string, unknown>> };
  };
  const repos = exportData.repositories.value;
  const validRepos = repos.filter((r) => typeof r.name === "string");
  const ops = validRepos.map((r) => {
    const topics = Array.isArray(r.topics) ? (r.topics as string[]).join(",") : "";
    const updatedAt = typeof r.updated_at === "string" ? new Date(r.updated_at) : null;
    // Estado inicial realista de ingesta: los más recientes ya indexados
    const recency = updatedAt ? Date.now() - updatedAt.getTime() : Infinity;
    const status = recency < 3 * 864e5 ? "INDEXADO" : recency < 10 * 864e5 ? "EMBEDDING" : recency < 20 * 864e5 ? "CHUNKING" : "PENDIENTE";
    return prisma.repoSource.create({
      data: {
        name: r.name as string,
        fullName: (r.full_name as string) ?? (r.name as string),
        language: (r.language as string) ?? null,
        visibility: (r.visibility as string) ?? "public",
        fork: Boolean(r.fork),
        sizeKb: Number(r.size ?? 0),
        stars: Number(r.stargazers_count ?? 0),
        openIssues: Number(r.open_issues_count ?? 0),
        description: (r.description as string) ?? null,
        topics,
        updatedAt,
        embeddingStatus: status,
        chunkCount: status === "INDEXADO" ? 40 + Math.floor(Math.random() * 160) : 0,
        indexedAt: status === "INDEXADO" ? updatedAt : null,
      },
    });
  });
  await Promise.all(ops);
  console.log(`✅ ${validRepos.length} repositorios ingeridos`);

  // 5. Auditoría inicial (cadena hash)
  const events: Array<[action: string, entity: string, severity: string]> = [
    ["BOOTSTRAP_ECOSISTEMA", "nucleo", "INFO"],
    ["DESPLIEGUE_ESQUEMA_NUCLEO", "supabase:migraciones", "INFO"],
    ["INGESTA_CORPUS_GITHUB", "repositorios", "INFO"],
    ["CALIBRACION_INDICE_HNSW", "memoria_episodica", "WARN"],
    ["EMISION_CERTIFICADOS_MTLS", "mcp:servidores", "INFO"],
    ["POLITICA_RLS_DENY_DEFAULT", "seguridad", "CRITICAL"],
  ];
  let prevHash = "";
  for (const [action, entity, severity] of events) {
    const payloadHash = hashPayload({ action, entity, nonce: randomUUID(), prev: prevHash });
    await prisma.auditEvent.create({
      data: { action, entity, severity, payloadHash },
    });
    prevHash = payloadHash;
  }
  console.log(`✅ ${events.length} eventos de auditoría (cadena hash)`);

  const stats = {
    categorias: await prisma.skillCategory.count(),
    skills: await prisma.skill.count(),
    fases: await prisma.phase.count(),
    hitos: await prisma.milestone.count(),
    repos: await prisma.repoSource.count(),
  };
  console.log("📊 RESUMEN:", stats);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
