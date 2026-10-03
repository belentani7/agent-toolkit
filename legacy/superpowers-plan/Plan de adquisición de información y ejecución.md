# Plan de adquisición de información y ejecución

## Objetivo personalizado

Convertir la base entregada en un **control plane personal para Belentani7**: una aplicación que conozca su corpus de 470 repositorios, catalogue capacidades agénticas, permita planificar trabajos, registre decisiones y evolucione hacia ingesta real, búsqueda vectorial y automatización segura. La prioridad será utilidad operacional y trazabilidad, no una demo visual.

## Información que falta adquirir

| Pregunta | Por qué cambia la arquitectura | Fuente mínima | Criterio de cierre |
|---|---|---|---|
| ¿Qué repositorios se pueden leer y modificar? | Define permisos, aislamiento y coste de indexación | Export actual + GitHub | Matriz público/privado, repos excluidos y permisos aprobados |
| ¿Cuál es el primer flujo de valor? | Evita construir 50 skills sin uso | Decisión del propietario | Un caso de uso con entrada, salida, SLA y responsable |
| ¿Se requiere memoria multiusuario? | Cambia auth, RLS y modelo de tenancy | Requisito del propietario | Tenant/usuario/roles definidos |
| ¿Dónde debe vivir la persistencia? | SQLite local vs PostgreSQL/Supabase | Restricciones de operación | Decisión con backup y rollback |
| ¿Qué automatizaciones son deterministas y cuáles requieren IA? | Determina coste, latencia y seguridad | Catálogo de trabajos | Cada job clasificado como código, LLM o aprobación humana |
| ¿Qué canales son necesarios? | Justifica GitHub, Drive o Gmail | Inventario de trabajo real | Integración mínima seleccionada y alcance de lectura/escritura |
| ¿Qué acciones requieren aprobación? | Evita cambios irreversibles | Política personal | Matriz de aprobación para merge, envío, borrado y despliegue |

## Ejecución propuesta

### Fase 0 — Recuperación y baseline

Crear una rama de trabajo, elegir Bun o pnpm como gestor único, generar Prisma, congelar un lockfile y hacer que lint, tests y build produzcan resultados reproducibles. Añadir un comando de verificación que no use `db:push --accept-data-loss` en producción.

### Fase 1 — Núcleo confiable

Validar contratos de todas las APIs con Zod, limitar tamaño y frecuencia de entradas, sustituir logs de queries por configuración de entorno, añadir health/readiness checks, manejo uniforme de errores y pruebas de rutas. Implementar auditoría con hash encadenado, actor, acción, recurso, autorización y resultado.

### Fase 2 — Ingesta real controlada

Normalizar el export de GitHub, conservar `full_name` como clave idempotente, añadir `source`, `visibility`, `etag`, `commitSha`, `lastIndexedAt` y estado de error. Procesar por lotes pequeños con reintentos, backoff, deduplicación, checkpoint y cola de fallos. Empezar con repositorios seleccionados, no con los 470.

### Fase 3 — Memoria y búsqueda

Mantener SQLite para desarrollo local y diseñar migración PostgreSQL/Supabase para producción. Separar metadatos de repositorio, documentos/chunks, embeddings y permisos. Solo llamar “semántica” a una búsqueda con embeddings reales y evaluación de calidad; conservar el ranking lexical como fallback.

### Fase 4 — Automatización máxima segura

Crear un registro de jobs con `queued`, `running`, `succeeded`, `failed`, `cancelled`, idempotency key, límites de concurrencia, reintentos y dead-letter queue. Los trabajos deterministas se ejecutarán en código; los que necesiten juicio usarán un modelo con presupuesto y salida estructurada; las acciones de alto impacto quedarán bloqueadas hasta aprobación humana.

### Fase 5 — Integraciones mínimas

- **GitHub:** usar el export local para baseline; después, solo lectura de repositorios seleccionados, issues y pull requests. Webhooks únicamente después de verificar el contrato y firmar/validar el secreto.
- **Google Drive:** conectar solo si existen documentos de arquitectura, requisitos o decisiones que deban alimentar el contexto; indexar metadatos y contenido permitido, con exclusiones explícitas.
- **Gmail:** no es necesario para el baseline. Incorporarlo únicamente para un flujo definido, inicialmente lectura de mensajes etiquetados y sin envío automático.

## Alternativas de ejecución automática

| Enfoque | Tradeoffs | Coste | Complejidad de configuración |
|---|---|---:|---:|
| Jobs deterministas dentro de la aplicación con cron y cola | Barato, rápido y auditable; requiere mantener estados y reintentos | Bajo por ejecución | Media |
| Servicio persistente que escucha eventos y llama a IA solo cuando corresponde | Respuesta cercana a tiempo real y desacoplamiento; requiere hosting continuo y observabilidad | Medio, según hosting y modelo | Alta |
| Tarea programada con juicio de IA pocas veces al día | Casi sin infraestructura; más lenta y consume créditos por ejecución | Variable por ejecución | Baja |

**Recomendación provisional:** empezar con la primera opción para ingesta, auditoría y sincronización; añadir la segunda solo si se necesita tiempo real; reservar la tercera para informes periódicos con decisión semántica.

## Criterios de terminado

El producto no se declarará terminado hasta que exista: build reproducible, migración documentada, pruebas de API y UI, búsqueda honesta (lexical o vectorial según implementación), auditoría verificable, jobs idempotentes, backup/restauración ensayados, permisos mínimos, monitorización, documentación de operación y una prueba end-to-end sobre repositorios autorizados.

## Próxima acción segura

Aplicar primero el baseline técnico en una copia/branch: `prisma generate`, elección de gestor, lint, tests y build; después corregir los fallos que aparezcan. No activar Gmail/Drive ni publicar cambios hasta que el primer flujo de valor y los permisos estén definidos.
