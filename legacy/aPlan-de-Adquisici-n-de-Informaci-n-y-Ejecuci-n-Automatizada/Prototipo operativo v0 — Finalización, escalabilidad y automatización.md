# Prototipo operativo v0 — Finalización, escalabilidad y automatización

Este prototipo define cómo el agente trabajará sobre el proyecto sin ejecutar cambios externos no aprobados.

## Flujo de trabajo del agente

```text
Entrada del usuario
  -> clasificar objetivo y nivel de riesgo
  -> reunir contexto permitido (workspace, GitHub/Drive/Gmail solo si aplica)
  -> plan estructurado con archivos afectados y pruebas
  -> ejecutar en rama/copia aislada
  -> lint + tests + build + smoke/e2e
  -> revisión de seguridad y diff
  -> informe con evidencias
  -> aprobación humana solo para acciones de alto impacto
```

## Contrato de un job

```ts
type JobStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";

type AgentJob = {
  id: string;
  objective: string;
  source: "local" | "github" | "drive" | "gmail";
  status: JobStatus;
  idempotencyKey: string;
  attempts: number;
  maxAttempts: number;
  requiresApproval: boolean;
  artifacts: string[];
  error?: string;
};
```

## Reglas de escalabilidad

1. **Idempotencia:** toda ingesta usa `source + externalId + revision` como clave lógica.
2. **Backpressure:** límite inicial de 4 repositorios concurrentes; aumentar solo con métricas de CPU, memoria, rate limit y latencia.
3. **Checkpoint:** cada lote registra último elemento procesado y puede reanudarse sin duplicar.
4. **Aislamiento:** no se ejecuta código obtenido de repositorios; solo se analiza como texto hasta que exista sandbox explícito.
5. **Fallos:** reintentos exponenciales para errores transitorios y cola de fallos para errores permanentes.
6. **Observabilidad:** duración, tamaño, estado, causa y correlación por job; nunca secretos ni contenido sensible en logs.
7. **Degradación:** si falla embeddings, la búsqueda lexical sigue disponible y el estado se muestra como `fallback`.

## Automatizaciones iniciales

| Job | Tipo | Frecuencia sugerida | Aprobación |
|---|---|---:|---|
| Reconciliar catálogo GitHub | Determinista | Bajo demanda/diaria | No, lectura |
| Indexar repositorio seleccionado | Determinista + extracción | Bajo demanda | No para lectura; sí para escritura |
| Generar resumen de cambios | IA estructurada | Bajo demanda | Sí si se publica fuera |
| Proponer refactor | IA + tests | Bajo demanda | Sí antes de commit/PR |
| Enviar correo | Externo | Nunca automático al inicio | Siempre |
| Borrar o cambiar permisos | Alto impacto | Nunca automático | Siempre |

## Checklist de verificación por entrega

- [ ] El diff solo contiene archivos previstos.
- [ ] No hay secretos, certificados privados ni `.env` en el diff.
- [ ] El job se puede repetir sin duplicar datos.
- [ ] Hay prueba de éxito y prueba de fallo.
- [ ] El usuario puede cancelar o reanudar.
- [ ] Las acciones externas tienen alcance mínimo.
- [ ] La salida distingue hechos, inferencias y pendientes.
- [ ] La UI muestra loading, empty, error y success.
- [ ] `prefers-reduced-motion`, teclado y focus states están cubiertos.
- [ ] Build y pruebas quedan registrados con versión y timestamp.

## Prueba de humo propuesta

1. Cargar un repositorio público pequeño del export.
2. Normalizarlo una vez y repetir la operación.
3. Confirmar que no se duplica.
4. Simular un fallo transitorio y comprobar reintento.
5. Simular un fallo permanente y comprobar cola de fallos.
6. Ejecutar búsqueda lexical y comprobar que se declara lexical.
7. Generar una propuesta sin aplicarla.
8. Verificar auditoría y artefactos.

Este prototipo es una especificación de trabajo, no afirma que las funciones estén implementadas en la base actual.
