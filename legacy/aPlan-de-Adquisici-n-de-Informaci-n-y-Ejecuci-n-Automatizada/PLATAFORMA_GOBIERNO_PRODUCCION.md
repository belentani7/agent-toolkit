# Plataforma de Gobierno de Producción — Belentani Command Center

## Propósito

El Command Center deja de ser únicamente un inventario de proyectos y pasa a ser el **control plane operativo** de una línea de producción de software y agentes. Su responsabilidad es observar fuentes autorizadas, ejecutar sincronizaciones reproducibles, separar plan de ejecución de verificación, y dejar una prueba criptográfica de cada decisión relevante.

## Fusión de contexto

La primera base NEXUS-Ω aporta el catálogo conceptual de skills, fases, repositorios y objetivos de automatización. El Command Center aporta la superficie operativa real: React/Vite, Express, tRPC, Drizzle/MySQL, autenticación y pruebas Vitest. El repositorio [obra/superpowers](https://github.com/obra/superpowers), clonado en `vendor/superpowers` para auditoría, se incorpora como **referencia metodológica MIT**, no como código ejecutado automáticamente ni como autoridad sobre el agente.

## Contrato del pipeline

Cada ejecución debe atravesar seis estados persistidos: `discovery`, `analysis`, `decision`, `execution`, `verification` y `audit`. Una ejecución tiene una clave idempotente, contador de elementos, estado global, etapa actual, timestamps y error controlado. Cada etapa guarda intentos, hashes de entrada/salida y resultado. Un reinicio no debe convertir una sincronización parcial en un inventario inconsistente.

La primera automatización productiva es la sincronización de repositorios GitHub. Descubre páginas de hasta 100 elementos, excluye forks, calcula una selección explícita, hace upsert por URL canónica, verifica el número persistido y registra el resultado. No usa `simulate()` ni transforma una estimación en una afirmación de producción.

## Auditoría encadenada

Cada evento contiene `eventHash`, `previousHash`, actor, acción, recurso, resultado, metadata y timestamp. El hash se calcula sobre JSON canónico ordenado. La función `verifyAuditChain` detecta una referencia previa rota, metadata corrupta o alteración de cualquier campo. Para producción se requiere serializar el append bajo una transacción o lock de base de datos para evitar dos cabezas concurrentes; la siguiente iteración debe añadir ese lock y una prueba de concurrencia.

## Seguridad y límites

Las acciones de escritura quedan protegidas por `protectedProcedure`. Los inputs existentes mantienen límites Zod y tamaño de importación. Los tokens nunca se almacenan en el repositorio. GitHub usa `GITHUB_TOKEN` opcional para elevar rate limit; sin él, el producto debe devolver un error claro y no inventar sincronización. Supabase y Hugging Face no se activan sin credenciales aportadas y una configuración explícita.

## Build y calidad

El contrato mínimo de cada cambio es: migración versionada, typecheck, pruebas unitarias, build, smoke test HTTP, verificación de logs y evidencia de estado. El dashboard debe mostrar estados vacíos, pendientes y simulados de forma inequívoca. El score de proyectos es una heurística de priorización; no es revenue ni validación de mercado.

## Roadmap operativo

La siguiente prioridad es: (1) lock transaccional de audit append y endpoint de verificación; (2) persistencia y consulta de pasos del pipeline; (3) retry con backoff y timeout por fuente; (4) ingestión incremental por `syncVersion`/ETag; (5) pruebas de recuperación; (6) conexión opcional a Supabase/Hugging Face detrás de adaptadores y health checks; (7) observabilidad del dashboard con errores y latencias reales.
