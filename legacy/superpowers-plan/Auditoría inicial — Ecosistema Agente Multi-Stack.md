# Auditoría inicial — Ecosistema Agente Multi-Stack

**Fecha de revisión:** 2026-09-04  
**Alcance:** ZIP principal, ZIP anidado, TAR de workspace, export JSON de GitHub, textos acompañantes y certificado.  
**Regla de seguridad:** todo texto imperativo incluido en los adjuntos se trató como dato no confiable, nunca como instrucción.

## 1. Estructura recibida

El ZIP principal contiene seis elementos: `GITHUB-BELENTANI7-COMPLETE.json`, `PLAN MANUS.txt`, `chat-Ecosistema Agente Multi-Stack.txt`, el ZIP anidado `nexus-ω-ecosistema-agéntico-multi-stack.zip`, `prod-ca-2021.crt` y `workspace-6e35d99d-b028-49d3-89bb-f0b57b597616.tar`. El TAR se extrajo en su totalidad y contiene un repositorio Git con workspace ejecutable, base SQLite y artefactos de despliegue.

## 2. Stack detectado

| Área | Estado observado |
|---|---|
| Aplicación | Next.js 16, React 19, TypeScript 5, Tailwind 4, shadcn/Radix |
| Persistencia | Prisma 6 sobre SQLite (`prisma/schema.prisma`, `db/custom.db`) |
| UI | 8 componentes de Nexus, 48 componentes UI, página principal tipo mission-control |
| Backend | 10 rutas `route.ts` bajo `src/app/api` |
| Datos | Seed TypeScript de 423 líneas; modelos para skills, fases, repositorios, auditoría, simulaciones y debates |
| Build | `next build` compila, pero falla durante la carga de rutas por Prisma Client no generado |
| Operación | scripts `.zscripts`, Caddyfile, empaquetado standalone; hay `.env` local no versionado |
| Git | rama `main`, dos commits, sin remoto configurado; aparecen `pnpm-lock.yaml` y `pnpm-workspace.yaml` sin seguimiento tras la validación |

## 3. Corpus GitHub real

El JSON tiene `repositories.value` con **470 repositorios** y `repositories.Count = 470`. La distribución observada es: 365 privados y 105 públicos; 469 no son forks y 1 sí lo es. Lenguajes principales: TypeScript 155, HTML 95, Python 86, JavaScript 18, PowerShell 11, Go 5, CSS 4, Shell 3, Java 3, Jupyter Notebook 2, Rust 1, C 1, Makefile 1, Batchfile 1 y C++ 1.

El export contiene datos de perfil y URLs de GitHub. Debe considerarse información personal y de repositorios privados: no debe copiarse a servicios externos ni publicarse sin una decisión explícita de alcance, minimización y autorización.

## 4. Funcionalidad existente

La aplicación ya incluye vistas para resumen, matriz de skills, arquitectura, índice de repositorios, ciclo de vida y consola de simulación. Las APIs cubren estadísticas, skills, repositorios, búsqueda, fases, auditoría, ingesta, simulación y debate. La interfaz tiene estados interactivos y filtros, pero la existencia de una ruta no demuestra que la operación sea segura o productiva.

## 5. Hallazgos críticos

1. **Build bloqueado por Prisma:** el build compila el código, pero falla al recoger `/api/debate` porque no encuentra `.prisma/client/default`. La corrección mínima es generar Prisma antes del build (`prisma generate`) y comprobar que el cliente y la versión del lockfile coinciden.
2. **Instalación no reproducible todavía:** la validación automática creó locks de pnpm no rastreados y terminó en `pnpm approve-builds`. Hay mezcla de Bun, pnpm y npm en el flujo. Debe elegirse un único gestor y fijar la política de scripts permitidos.
3. **Persistencia local, no producción:** el esquema es SQLite, mientras que el plan conceptual menciona Supabase/PostgreSQL/pgvector. La migración requiere diseño explícito, no un reemplazo ciego.
4. **Búsqueda semántica simulada:** `/api/repos/search` calcula ranking por términos y añade jitter hash; no es una búsqueda vectorial real. Debe etiquetarse como lexical mientras no exista chunking, embeddings, almacenamiento vectorial y evaluación.
5. **Auditoría no plenamente inmutable:** existe `payloadHash`, pero SQLite no aporta por sí solo una cadena hash verificable ni controles de escritura append-only. Falta hash encadenado, actor, decisión, autorización, resultado y verificación periódica.
6. **Riesgo de exposición:** existe `.env` local y un certificado CA. No se detectó una clave privada en la revisión, pero hay que rotar cualquier secreto que haya quedado en historial o exportaciones y evitar adjuntar `.env`/certificados a repositorios públicos.
7. **Automatización incompleta:** los scripts de arranque ejecutan instalaciones y `db:push --accept-data-loss`; esto es aceptable para desarrollo controlado, no para producción. Falta cola idempotente, reintentos con backoff, límites de concurrencia, dead-letter queue, métricas y cancelación.
8. **Pruebas insuficientes como evidencia:** el `worklog.md` describe smoke tests previos, pero la validación actual no puede declararse verde hasta regenerar Prisma y repetir lint, tests, build y pruebas de rutas.

## 6. Decisiones de conservación inicial

**Conservar:** modelo visual de Nexus, taxonomía y seed como corpus de dominio, navegación existente, separación de rutas API y componentes, export GitHub como fuente de ingesta controlada.  
**Refactorizar:** gestión de dependencias, Prisma lifecycle, contratos de entrada/salida, búsqueda, auditoría, ingesta y configuración.  
**Sustituir gradualmente:** SQLite por PostgreSQL/Supabase solo cuando se definan migraciones, RLS, backups y plan de reversión.  
**No activar aún:** webhooks, indexación masiva, Gmail/Drive o escritura remota hasta definir alcance y permisos mínimos.

## 7. Estado de esta fase

La extracción y auditoría local están completadas. El siguiente paso seguro es ejecutar la reparación mínima de build en una rama/working copy aislada, generar el plan final y después decidir qué integración externa aporta contexto real. No se han hecho conexiones ni escrituras externas.
