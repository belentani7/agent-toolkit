# Product Audit 10/10 — Agent Control Plane

## Decisión ejecutiva

La candidata aprobada para implementación es **Agent Control Plane**, una plataforma B2B para que consultoras de automatización y equipos TI registren, autoricen, observen y auditen agentes de IA multi-tenant antes y durante sus efectos operativos.

No se aprueba construir un “chatbot universal”, un marketplace genérico de prompts ni otra herramienta de observabilidad aislada: Langfuse y LangSmith ya cubren gran parte de tracing/evaluación, Portkey cubre gateway/routing y OPA cubre policy-as-code. La oportunidad defendible es una **capa de control operacional interoperable** que componga esas capacidades y añada autoridad, riesgo, aprobación, cuarentena y evidencia.

## Usuario comprador

El comprador inicial es una consultora de automatización IA o un departamento de plataforma que opera varios agentes para diferentes clientes, necesita separar tenants, limitar herramientas, demostrar quién autorizó cada acción y controlar el coste y el riesgo de efectos externos.

## Promesa

> Conecta tus agentes de IA, controla sus acciones y demuestra cómo operan.

## Matriz de aceptación

La puntuación se interpreta como madurez demostrable de esta iteración, no como garantía de éxito comercial. Un 10 exige evidencia ejecutable y documentación; cuando una dimensión no está demostrada se marca como pendiente, aunque el producto mantenga alto potencial.

| Dimensión | Umbral 10/10 | Evidencia requerida | Estado de esta iteración |
|---|---|---|---|
| Backend | Contratos tipados, autorización, persistencia, idempotencia, auditoría y tests | TypeScript/check, tests, migraciones y aislamiento | 8/10: base PVC-U fuerte; falta E2E MySQL y outbox atómico |
| Frontend | Sala operativa útil, responsive, accesible y resiliente a estados vacíos/error | Pantalla operativa, tRPC, estados y verificación visual | 8/10: vertical slice operativo; faltan exportación y revisión dual |
| Utilidad | Reduce un dolor laboral inmediato y medible | Caso de uso, workflow y criterios de ROI | 9/10: dolor claro; requiere entrevistas y piloto |
| Relevancia | Interopera con estándares y herramientas existentes | OpenTelemetry, OPA, Langfuse, Portkey y adaptadores | 9/10: arquitectura complementaria; faltan conectores externos |
| Potencial | SaaS, private cloud, marketplace y expansión modular | Segmentos, pricing, extensibilidad y roadmap | 9/10: alto; requiere validación comercial |
| Identidad | Producto reconocible, no un dashboard genérico | Nombre, promesa, UI y narrativa | 9/10: identidad clara y diferenciada |

## Gate de construcción

La solución es suficientemente fuerte para un MVP privado y un piloto controlado. **No se debe afirmar 10/10 real todavía** porque no hay prueba de aceptación con clientes ni E2E contra MySQL productivo. La implementación debe avanzar en vertical slice y conservar explícitamente esas deudas.

## Alcance implementado

El vertical slice reutiliza el kernel PAEA y PVC-U para ofrecer tenants y propietarios, perfiles, validación L0–L8, risk score, evidencia con hash, excepciones, consultas protegidas, pruebas de scope y un panel de operación con estados de carga/error/vacío.

## Alcance siguiente

La siguiente iteración debe añadir outbox transaccional, E2E contra MySQL, conectores OpenTelemetry/OPA, exportación de evidencia, aprobación dual, perfiles versionados y un piloto con una consultora. Estas mejoras son necesarias para convertir la alta puntuación de arquitectura en evidencia de mercado.

## Referencias

[1]: https://langfuse.com/docs "Langfuse Documentation"
[2]: https://docs.langchain.com/langsmith/observability "LangSmith Observability Documentation"
[3]: https://portkey.ai/docs/product/ai-gateway "Portkey AI Gateway Documentation"
[4]: https://www.openpolicyagent.org/docs "Open Policy Agent Documentation"
