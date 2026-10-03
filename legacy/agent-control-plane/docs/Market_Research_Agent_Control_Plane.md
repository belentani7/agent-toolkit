# Investigación externa: AI Agent Control Plane

## Fuentes verificadas

### Langfuse
Fuente: https://langfuse.com/docs

Langfuse se presenta como una plataforma open source de ingeniería de IA, self-hostable y extensible. La documentación describe observabilidad con trazas de llamadas LLM y no-LLM, recuperación, embeddings y API calls; seguimiento de sesiones y usuarios; representación de agentes como grafos; integraciones nativas, OpenTelemetry y gateways LLM; y análisis de coste y latencia. También integra gestión de prompts y evaluación, incluyendo datasets, experimentos, LLM-as-a-Judge, colas de anotación y evaluaciones personalizadas.

Implicación para PAEA: no conviene competir con Langfuse como herramienta genérica de trazas. La diferenciación debe situarse por encima: control operativo y de permisos, aislamiento multi-tenant, validación previa a efectos, aprobación humana, evidencia de decisiones y administración de la flota de agentes.

### Open Policy Agent
Fuente: https://www.openpolicyagent.org/docs

OPA es un motor de políticas open source y generalista que unifica el enforcement en diferentes capas. Su patrón central separa la decisión de política de la aplicación: el software consulta OPA con datos estructurados y recibe una decisión estructurada. Rego es agnóstico al dominio y las políticas pueden cubrir autorización, redes, registros, horarios y otras reglas. La documentación lista integraciones para microservicios, Kubernetes, CI/CD, gateways, APIs HTTP/GraphQL, Kafka, Terraform y otros sistemas.

Implicación para PAEA: el producto debe aplicar policy-as-code y conservar la decisión junto con su contexto, versión de política, identidad, riesgo y efecto permitido. PVC-U puede actuar como capa de validación y evidencia sobre las decisiones, usando una interfaz sustituible para OPA/Rego u otros motores.

## Hipótesis de producto

La candidata más defendible es un **AI Agent Control Plane** para consultoras y equipos TI: registro de agentes, permisos y herramientas, trazabilidad, evaluación, control de costes, aprobación humana, aislamiento por tenant y evidencia auditable. El MVP no debe sustituir a Langfuse ni a OPA; debe integrarlos mediante adaptadores y resolver el vacío entre observabilidad y control operativo.

## Criterios de diferenciación

| Criterio | Decisión | Evidencia o justificación |
|---|---|---|
| Backend | Kernel de políticas, identidad, tenants, validación y evidence ledger | Reutiliza patrones de OPA, OpenTelemetry y PVC-U |
| Frontend | Sala de control operativa, no un simple dashboard de métricas | Permite ver riesgos, permisos, aprobaciones y efectos |
| Utilidad | Reducir riesgo operativo al usar agentes en producción | El comprador necesita gobernar acciones, no solo observar tokens |
| Relevancia | Interoperable y agnóstico de proveedor | Langfuse muestra demanda de integración y menor lock-in |
| Potencial | Producto SaaS o despliegue privado para consultoras y sectores regulados | Multi-tenant, módulos, auditoría y control de costes |
| Identidad | “Agent Control Plane” / “Kernel de Operaciones de IA” | Diferencia frente a chatbot, APM y LLM observability |

## Límites de la evidencia

Estas fuentes verifican capacidades de proyectos concretos, pero no prueban por sí solas tamaño de mercado, adopción, ingresos ni éxito comercial. Esas afirmaciones deben investigarse con fuentes de mercado independientes y tratarse como hipótesis hasta validación con usuarios.

### LangSmith
Fuente: https://docs.langchain.com/langsmith/observability

La documentación oficial describe observabilidad desde trazas individuales hasta métricas de producción, integraciones con múltiples frameworks y proveedores, filtrado/exportación/comparación de trazas, dashboards y alertas, automatizaciones con reglas/webhooks/evaluaciones online, feedback y detección de fallos recurrentes. Ofrece opciones cloud, híbrida y self-hosted con observabilidad, evaluación, prompt engineering y deployment.

Implicación para PAEA: competir con tracing, dashboards y evaluación genérica sería insuficiente. La ventaja debe ser el control previo y posterior al efecto: autorización de herramientas, límites por tenant, aprobaciones, cuarentena, evidencia y operaciones de la flota.

### Portkey
Fuente: https://portkey.ai/docs/product/ai-gateway

La documentación oficial describe un AI Gateway con API universal, caché, MCP remoto, fallbacks, routing condicional, multimodalidad, reintentos, circuit breakers, balanceo, canary testing, timeouts, límites de presupuesto/tokens, rate limits y hosts privados. También anuncia Agent Gateway para governance, observability y control.

Implicación para PAEA: el Model Router no debe reinventar todas esas capacidades. Debe ofrecer adaptadores y añadir una capa que vincule el routing con identidad de agente, permisos, riesgo, aprobación y ledger de evidencia. La arquitectura propuesta es complementaria, no una copia.

## Comparativa actualizada

| Competidor o componente | Fortaleza cubierta | Hueco donde PAEA puede diferenciarse |
|---|---|---|
| Langfuse | Open source, self-hosting, trazas, costes, evaluación y grafos | Enforcement operacional, permisos y efectos multi-tenant |
| LangSmith | Tracing, dashboards, alertas, automatizaciones, evaluación y deployment | Kernel agnóstico de proveedor con ledger y aprobación independiente |
| Portkey | Gateway, routing, fallbacks, límites, MCP y guardrails | Identidad, workflow authority, evidencia y control de acciones externas |
| OPA | Policy-as-code y decisión desacoplada | Contexto de agente, riesgo, ciclo de vida y UX de control operativo |

## Conclusión de selección

La candidata sigue siendo un **AI Agent Control Plane para consultoras y equipos TI**, pero con un enfoque estrecho y defendible: **pre-flight authorization + runtime evidence + human approval para efectos de agentes multi-tenant**. Esto reduce la competencia frontal con observabilidad y gateways ya maduros y convierte PAEA en una capa de control interoperable.
