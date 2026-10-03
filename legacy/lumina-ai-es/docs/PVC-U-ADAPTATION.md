# PVC-U Ω-Max aplicado a Lúmina

## Decisión de arquitectura

Lúmina conserva su stack existente de **React 19 + Vite + Tailwind CSS 4 + Express + tRPC + Drizzle**. El protocolo adjunto se aplica como un sistema de contratos, validación y trazabilidad, no como una migración artificial a Next.js. Esta decisión reduce riesgo, evita reescritura innecesaria y mantiene la compatibilidad con el proyecto ya funcional.

El objetivo de esta adaptación es que cada flujo crítico tenga una frontera verificable: entrada validada, reglas explícitas, estado observable, guardrails de IA, errores normalizados, trazabilidad y pruebas automatizadas.

## Mapa de implementación

| Esfera | Aplicación en Lúmina | Evidencia |
|---|---|---|
| 1. Estructural | Esquemas Zod para solicitudes de chat y opciones del modelo. | `shared/pvcProtocol.ts` |
| 2. Semántica | Límites de mensajes, tamaño total, limpieza de contenido y reglas de respuesta. | `shared/chatPolicy.ts` y `server/chatStream.ts` |
| 3. Estado | Estados explícitos `idle`, `streaming` y `error` en la interfaz de conversación. | `client/src/pages/Home.tsx` |
| 4. Seguridad | Sanitización de control characters y bloques `<script>`, guardrails de prompt, límites de payload y fallback seguro. | `shared/chatPolicy.ts`, `server/chatStream.ts` |
| 5. Protocolo | `X-Trace-Id`, `X-Client-Version`, `Accept-Version` y versión `1.0.0`. | `server/chatStream.ts` |
| 6. Integridad | Credenciales del LLM únicamente en servidor; no se exponen claves al cliente. | `server/_core/llm.ts` y `server/chatStream.ts` |
| 7. Cumplimiento | Minimización de datos en el cliente, historial local explícito y advertencia visible sobre verificación de información. | `client/src/pages/Home.tsx` |
| 4-A. IA | Prompt de sistema centralizado, resistencia básica a prompt injection, sanitización de salida y errores con `traceId`. | `shared/chatPolicy.ts` |

## Validation Envelope

Los errores de frontera utilizan un sobre con `validationId`, `traceId`, `validationStatus`, `layer`, `errors` y `timestamp`. Esto permite que el cliente muestre un error entendible y que una incidencia pueda localizarse mediante la traza sin revelar información sensible del proveedor LLM.

Los códigos se agrupan por esfera. `PVC-101` representa un error estructural de entrada, `PVC-102` una violación de tamaño o contenido, `PVC-502` un fallo del adaptador del modelo y `PVC-503` una integración no configurada.

## Flujo verificable

```text
Cliente
  → headers de versión y traceId
  → Zod / esfera estructural
  → sanitización y límites / seguridad
  → prompt de sistema y guardrails de IA
  → adaptador LLM con streaming SSE
  → respuesta progresiva
  → sanitización de salida en cliente y servidor
  → historial de sesión
```

## Lo que no se implementa por defecto

Las partes del documento adjunto que requieren hardware cuántico, QKD, criptografía homomórfica, simulaciones PINN, límites termodinámicos de Landauer o reescritura de axiomas de Gödel no se presentan como funcionalidades reales de Lúmina. No sería técnicamente honesto simularlas con nombres de marketing. Si el producto evoluciona hacia sectores regulados, podrán añadirse controles de seguridad y cumplimiento específicos con evidencias auditables.

## Criterios de aceptación

Una versión puede considerarse lista para revisión cuando `pnpm check` no reporta errores, `pnpm test` está verde, el endpoint devuelve Validation Envelope para entradas inválidas, las respuestas de chat conservan `traceId`, el flujo de streaming muestra estados visibles, el Markdown se renderiza correctamente, el cliente permanece utilizable con teclado y la documentación describe las decisiones y límites reales del sistema.

## Controles adicionales de operación

El servidor añade un límite temporal best-effort de 20 solicitudes de streaming por cliente y minuto, devolviendo un sobre `PVC-429` cuando se supera. También desactiva la firma `X-Powered-By`, emite headers `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`, y publica una política CSP en modo report-only para detectar cargas incompatibles antes de endurecerla en producción.
