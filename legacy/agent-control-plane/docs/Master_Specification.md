# Especificación Maestra y Arquitectura Unificada: PAEA Supra-Kernel

## 1. Visión y Propósito
PAEA Supra-Kernel (Agent Control Plane) es una infraestructura universal de agentes de inteligencia artificial basada en el núcleo de validación de políticas **PVC-U (Policy Validation Control Unit)** con aislamiento multi-tenant estricto (L0-L8). Su objetivo es proporcionar gobernanza proactiva, seguridad, trazabilidad criptográfica SHA-256 y cumplimiento normativo (EU AI Act, SOC2, GDPR) antes de que un agente ejecute acciones de riesgo.

## 2. Arquitectura de Backend y Base de Datos
- **Stack:** Express 4, tRPC 11, Drizzle ORM, MySQL.
- **Persistencia Atómica y Outbox:** Cada validación, evidencia y evento se agrupa en una única transacción ACID, garantizando que el ledger y el outbox de tiempo real estén perfectamente sincronizados.
- **Canal Realtime SSE:** Canal de eventos autenticado y delimitado por `tenantKey` con heartbeats y deduplicación.
- **Adaptadores de Ecosistema:** Exportación de políticas Rego para Open Policy Agent (OPA), trazas estándar OTLP y observaciones Langfuse.

## 3. Experiencia Frontend (Cockpit Operativo)
- **Estética de Ingeniería (Blueprint):** Interfaz en azul profundo con rejilla de precisión, indicadores de estado del kernel, ledger de validación interactivo, gates de aprobación dual humana, transición a cuarentena con motivo obligatorio y exportación firmada de evidencias (HMAC-SHA256).
- **Accesibilidad y Pruebas:** Pruebas rigurosas de accesibilidad, smoke de teclado y pruebas UI autenticadas con Vitest y jsdom.

## 4. Estado de Verificación y Calidad
- **Pruebas:** 71 pruebas automatizadas correctas (incluyendo E2E contra MySQL real, pruebas de carga P99 y adaptadores de ecosistema).
- **Cobertura:** 100% de statements, ramas, funciones y líneas en la superficie crítica del kernel, routers y adaptadores.
- **Git y Publicación:** Sincronizado en la repo privada de GitHub `belentani7/agent-control-plane` tras autorización explícita, manteniendo un historial limpio y trazable.
