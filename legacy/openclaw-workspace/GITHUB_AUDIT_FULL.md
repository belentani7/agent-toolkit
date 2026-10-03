# 🔍 Auditoría Completa de GitHub — belentani7

**Fecha:** 2026-08-31 13:42 UTC  
**Repos auditados:** 80 (públicos; la cuenta no tiene repos privados)  
**Herramientas:** gh CLI + API REST de GitHub + escáner de secretos propio  

> ⚠️ Nota: la tarea mencionaba 200 repos, pero la cuenta **belentani7 tiene exactamente 80 repos** (verificado con paginación completa de la API, tipo=all). Se auditó el 100%.

---

## 📊 Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| Repos totales | 80 |
| Con README.md | 68 (85%) |
| Sin README.md | 12 |
| Con .gitignore | 67 (83%) |
| Con GitHub Pages activo | 67 (83%) |
| Sin GitHub Pages | 13 |
| Hallazgos de secretos (scanner) | 12 |
| 🔴 Secretos REALES expuestos | 1 (CRÍTICO) |
| 🟠 Archivos .env commiteados (keys anon Supabase) | 2 |
| ⚪ Falsos positivos / fixtures de test | 9 hallazgos en 4 repos |
| Repos vacíos (0 commits) | 2 |

---

## 🚨 1. REPOS CRÍTICOS — Secretos Expuestos

### 🔴 CRÍTICO REAL — acción inmediata

| Repo | Archivo | Tipo | Detalle |
|---|---|---|---|
| [CARQUIDEC](https://github.com/belentani7/CARQUIDEC) | `settings.json` | **OpenRouter API key real** | `opencode.ai.apiKey` = `sk-or-v1-978a…` (64 hex). Key LIVE en repo público. |

**Acción obligatoria:**
1. **Revocar la key YA** en <https://openrouter.ai/keys> (aunque se borre del repo, queda en el histórico git).
2. Eliminar el archivo del histórico con `git filter-repo` o BFG (script incluido más abajo).
3. Generar key nueva y guardarla solo en variables de entorno.

### 🟠 Alto — archivos `.env` commiteados (keys de baja sensibilidad)

| Repo | Archivo | Contenido | Riesgo real |
|---|---|---|---|
| [abrazo-tender-words](https://github.com/belentani7/abrazo-tender-words) | `.env` | Supabase project ID + `PUBLISHABLE_KEY` (role=**anon**) | Bajo-medio: la anon key está diseñada para ser pública, pero **verifica que RLS esté activado** en todas las tablas del proyecto `ejkcfwcjreaobffuexsb`. |
| [tender-words-connect](https://github.com/belentani7/tender-words-connect) | `.env` | Idéntico (mismo proyecto Supabase) | Ídem. |

**Acción:** añadir `.env` al `.gitignore` de ambos, eliminar del tracking (`git rm --cached .env`) y **auditar políticas RLS** del proyecto Supabase. Si existe o existió alguna `service_role` key en algún sitio, rotarla.

### ⚪ Falsos positivos verificados (sin acción)

| Repo | Motivo |
|---|---|
| fashion-stylist-ai | `.env.example` con placeholder `your-api-key-here` |
| duck-unified-master | `mysql://user:password@` de ejemplo en `drizzle.config.ts` y `.env.example` |
| manus-ai-skill-pack | Documentación con template `${config.username}:${config.password}` |
| qwen-code | Fixtures de test en `secret-scanner.test.ts` (tests del propio escáner, irónico y correcto) |

---

## 📄 2. Tabla Resumen de Todos los Repos

| # | Repo | README | .gitignore | Pages | ⭐ | 🍴 | Última actualización | Archivos | Lenguaje |
|---|---|---|---|---|---|---|---|---|---|
| 1 | [abrazo-tender-words](https://github.com/belentani7/abrazo-tender-words) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-30 | 136 | TypeScript |
| 2 | [ai-command-center-level10](https://github.com/belentani7/ai-command-center-level10) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 159 | TypeScript |
| 3 | [arte-que-veste](https://github.com/belentani7/arte-que-veste) | ❌ | ✅ | ✅ | 0 | 0 | 2026-08-24 | 46 | HTML |
| 4 | [Belentani](https://github.com/belentani7/Belentani) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-30 | 286 | TypeScript |
| 5 | [belentani-judas](https://github.com/belentani7/belentani-judas) | ❌ | ❌ | ❌ | 0 | 0 | 2026-08-28 | 0 | — |
| 6 | [belentani-office](https://github.com/belentani7/belentani-office) | ✅ | ✅ | ❌ | 0 | 0 | 2026-08-30 | 5893 | JavaScript |
| 7 | [belentani-omega-immersive-portal](https://github.com/belentani7/belentani-omega-immersive-portal) | ✅ | ✅ | ❌ | 0 | 0 | 2026-08-28 | 45 | JavaScript |
| 8 | [belentani-omega-portal](https://github.com/belentani7/belentani-omega-portal) | ✅ | ❌ | ✅ | 0 | 0 | 2026-08-28 | 2 | HTML |
| 9 | [belentani-omega-template](https://github.com/belentani7/belentani-omega-template) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-28 | 304 | HTML |
| 10 | [belentani-video-forge](https://github.com/belentani7/belentani-video-forge) | ✅ | ❌ | ❌ | 0 | 0 | 2026-08-28 | 24 | Python |
| 11 | [Belentani.cv-ai](https://github.com/belentani7/Belentani.cv-ai) | ❌ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 199 | TypeScript |
| 12 | [belentani7](https://github.com/belentani7/belentani7) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 197 | TypeScript |
| 13 | [belentani7-gestaltAI](https://github.com/belentani7/belentani7-gestaltAI) | ✅ | ❌ | ✅ | 0 | 0 | 2026-08-26 | 10 | — |
| 14 | [belentani7.github.io](https://github.com/belentani7/belentani7.github.io) | ✅ | ❌ | ✅ | 0 | 0 | 2026-08-31 | 2 | HTML |
| 15 | [belentani_Omega](https://github.com/belentani7/belentani_Omega) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 44 | JavaScript |
| 16 | [belentaniexperience](https://github.com/belentani7/belentaniexperience) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 86 | TypeScript |
| 17 | [CARQUIDEC](https://github.com/belentani7/CARQUIDEC) | ❌ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 392 | HTML |
| 18 | [cinematic-prompt-formatter](https://github.com/belentani7/cinematic-prompt-formatter) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 27 | Python |
| 19 | [claude-skills-pack](https://github.com/belentani7/claude-skills-pack) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-24 | 30 | HTML |
| 20 | [CODEX-OMEGA-SKILL](https://github.com/belentani7/CODEX-OMEGA-SKILL) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-28 | 11 | PowerShell |
| 21 | [comfyui-json-compiler](https://github.com/belentani7/comfyui-json-compiler) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 31 | Python |
| 22 | [Cruzando-el-charco](https://github.com/belentani7/Cruzando-el-charco) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-31 | 54 | JavaScript |
| 23 | [duck-2026](https://github.com/belentani7/duck-2026) | ✅ | ❌ | ✅ | 0 | 0 | 2026-08-28 | 24 | HTML |
| 24 | [duck-apps](https://github.com/belentani7/duck-apps) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 68 | HTML |
| 25 | [duck-apps-web](https://github.com/belentani7/duck-apps-web) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-30 | 75 | HTML |
| 26 | [duck-belentani-os-audited-2026-08-23](https://github.com/belentani7/duck-belentani-os-audited-2026-08-23) | ✅ | ✅ | ❌ | 0 | 0 | 2026-08-28 | 196 | TypeScript |
| 27 | [Duck-Deck](https://github.com/belentani7/Duck-Deck) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 6 | — |
| 28 | [duck-docs](https://github.com/belentani7/duck-docs) | ✅ | ❌ | ❌ | 0 | 0 | 2026-08-30 | 234 | TypeScript |
| 29 | [duck-ecosystem](https://github.com/belentani7/duck-ecosystem) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-24 | 223 | TypeScript |
| 30 | [duck-full-studio-pro](https://github.com/belentani7/duck-full-studio-pro) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-28 | 213 | HTML |
| 31 | [duck-hub](https://github.com/belentani7/duck-hub) | ✅ | ✅ | ❌ | 0 | 0 | 2026-08-30 | 215 | TypeScript |
| 32 | [duck-lab](https://github.com/belentani7/duck-lab) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 99 | TypeScript |
| 33 | [duck-music-lab](https://github.com/belentani7/duck-music-lab) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-28 | 15 | Shell |
| 34 | [Duck-Omega](https://github.com/belentani7/Duck-Omega) | ❌ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 216 | TypeScript |
| 35 | [duck-studio-suite](https://github.com/belentani7/duck-studio-suite) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-28 | 87 | TypeScript |
| 36 | [duck-unified-master](https://github.com/belentani7/duck-unified-master) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-31 | 1073 | HTML |
| 37 | [duck-zion-apex-public](https://github.com/belentani7/duck-zion-apex-public) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 141 | TypeScript |
| 38 | [DUCK-ZION-PREMIUM](https://github.com/belentani7/DUCK-ZION-PREMIUM) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-28 | 757 | HTML |
| 39 | [DuckHTML](https://github.com/belentani7/DuckHTML) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 6 | HTML |
| 40 | [entrenador-jorge-bcn](https://github.com/belentani7/entrenador-jorge-bcn) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 152 | HTML |
| 41 | [evidence-ledger](https://github.com/belentani7/evidence-ledger) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 32 | TypeScript |
| 42 | [fashion-stylist-ai](https://github.com/belentani7/fashion-stylist-ai) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 9 | — |
| 43 | [first-contributions](https://github.com/belentani7/first-contributions) | ✅ | ✅ | ❌ | 0 | 0 | 2026-08-31 | 415 | — |
| 44 | [gpu-cost-optimizer](https://github.com/belentani7/gpu-cost-optimizer) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 33 | Python |
| 45 | [harmonia-hub](https://github.com/belentani7/harmonia-hub) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 174 | TypeScript |
| 46 | [heyduck](https://github.com/belentani7/heyduck) | ❌ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 156 | HTML |
| 47 | [ivy-la-vie](https://github.com/belentani7/ivy-la-vie) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-30 | 172 | HTML |
| 48 | [judas-experience](https://github.com/belentani7/judas-experience) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-30 | 20 | HTML |
| 49 | [judas-experience-galactic](https://github.com/belentani7/judas-experience-galactic) | ✅ | ❌ | ✅ | 0 | 0 | 2026-08-28 | 4 | CSS |
| 50 | [judas-omega-static](https://github.com/belentani7/judas-omega-static) | ❌ | ❌ | ✅ | 0 | 0 | 2026-08-24 | 5 | HTML |
| 51 | [jvictorbarbosa](https://github.com/belentani7/jvictorbarbosa) | ❌ | ❌ | ❌ | 0 | 0 | 2026-08-26 | 0 | — |
| 52 | [latent-consistency-bench](https://github.com/belentani7/latent-consistency-bench) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 28 | Python |
| 53 | [linguaforge](https://github.com/belentani7/linguaforge) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 229 | TypeScript |
| 54 | [llm-vfx-orchestrator](https://github.com/belentani7/llm-vfx-orchestrator) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 31 | Python |
| 55 | [local-agent](https://github.com/belentani7/local-agent) | ✅ | ✅ | ❌ | 0 | 0 | 2026-08-02 | 24 | PowerShell |
| 56 | [ManosAbiertas](https://github.com/belentani7/ManosAbiertas) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-30 | 6483 | HTML |
| 57 | [ManosAbiertas-backup-v1](https://github.com/belentani7/ManosAbiertas-backup-v1) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-25 | 1351 | TypeScript |
| 58 | [manus-ai-skill-pack](https://github.com/belentani7/manus-ai-skill-pack) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-27 | 2222 | Python |
| 59 | [meta-skill](https://github.com/belentani7/meta-skill) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 24 | HTML |
| 60 | [michelle-relayze-web](https://github.com/belentani7/michelle-relayze-web) | ✅ | ❌ | ✅ | 0 | 0 | 2026-08-30 | 13 | HTML |
| 61 | [mimo-companion](https://github.com/belentani7/mimo-companion) | ❌ | ✅ | ✅ | 0 | 0 | 2026-08-30 | 12 | HTML |
| 62 | [nataliamarinho](https://github.com/belentani7/nataliamarinho) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 14 | HTML |
| 63 | [Netlify](https://github.com/belentani7/Netlify) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 69 | JavaScript |
| 64 | [Oculus-Tv](https://github.com/belentani7/Oculus-Tv) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-29 | 238 | TypeScript |
| 65 | [omega-max-duck](https://github.com/belentani7/omega-max-duck) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-22 | 145 | TypeScript |
| 66 | [omniagent](https://github.com/belentani7/omniagent) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 35 | Python |
| 67 | [openclaw-workspace](https://github.com/belentani7/openclaw-workspace) | ❌ | ❌ | ✅ | 0 | 0 | 2026-08-28 | 9 | — |
| 68 | [oss-compass](https://github.com/belentani7/oss-compass) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 37 | Python |
| 69 | [pbr-validator](https://github.com/belentani7/pbr-validator) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 28 | Python |
| 70 | [proofmesh](https://github.com/belentani7/proofmesh) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-22 | 140 | TypeScript |
| 71 | [qbp-core](https://github.com/belentani7/qbp-core) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 28 | Python |
| 72 | [qwen-code](https://github.com/belentani7/qwen-code) | ✅ | ✅ | ❌ | 0 | 0 | 2026-08-31 | 7462 | — |
| 73 | [registro-proyectos-2026](https://github.com/belentani7/registro-proyectos-2026) | ❌ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 9 | — |
| 74 | [rh-fiscal-ultra-elite](https://github.com/belentani7/rh-fiscal-ultra-elite) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 12 | Python |
| 75 | [Steven-renovation](https://github.com/belentani7/Steven-renovation) | ❌ | ✅ | ✅ | 0 | 0 | 2026-08-28 | 13 | HTML |
| 76 | [temporal-artifact-detector](https://github.com/belentani7/temporal-artifact-detector) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-23 | 28 | Python |
| 77 | [tender-words-connect](https://github.com/belentani7/tender-words-connect) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-30 | 126 | TypeScript |
| 78 | [the-judas-experience](https://github.com/belentani7/the-judas-experience) | ✅ | ❌ | ❌ | 0 | 0 | 2026-08-29 | 11 | CSS |
| 79 | [transformers](https://github.com/belentani7/transformers) | ✅ | ✅ | ❌ | 0 | 0 | 2026-08-31 | 6471 | — |
| 80 | [ux-academy-professional-program](https://github.com/belentani7/ux-academy-professional-program) | ✅ | ✅ | ✅ | 0 | 0 | 2026-08-31 | 233 | TypeScript |

---

## 📕 3. Repos SIN README (12)

| Repo | Última actualización | Recomendación |
|---|---|---|
| [arte-que-veste](https://github.com/belentani7/arte-que-veste) | 2026-08-24 | Añadir README.md |
| [belentani-judas](https://github.com/belentani7/belentani-judas) | 2026-08-28 | Repo vacío (0 commits) — borrar o inicializar |
| [Belentani.cv-ai](https://github.com/belentani7/Belentani.cv-ai) | 2026-08-29 | Añadir README.md |
| [CARQUIDEC](https://github.com/belentani7/CARQUIDEC) | 2026-08-29 | Añadir README.md |
| [Duck-Omega](https://github.com/belentani7/Duck-Omega) | 2026-08-23 | Añadir README.md |
| [heyduck](https://github.com/belentani7/heyduck) | 2026-08-29 | Añadir README.md |
| [judas-omega-static](https://github.com/belentani7/judas-omega-static) | 2026-08-24 | Añadir README.md |
| [jvictorbarbosa](https://github.com/belentani7/jvictorbarbosa) | 2026-08-26 | Repo vacío (0 commits) — borrar o inicializar |
| [mimo-companion](https://github.com/belentani7/mimo-companion) | 2026-08-30 | Añadir README.md |
| [openclaw-workspace](https://github.com/belentani7/openclaw-workspace) | 2026-08-28 | Añadir README.md |
| [registro-proyectos-2026](https://github.com/belentani7/registro-proyectos-2026) | 2026-08-23 | Añadir README.md |
| [Steven-renovation](https://github.com/belentani7/Steven-renovation) | 2026-08-28 | Añadir README.md |

---

## 🌐 4. Repos SIN GitHub Pages activo (13)

| Repo | ¿Tiene contenido web? | Nota |
|---|---|---|
| [belentani-judas](https://github.com/belentani7/belentani-judas) | improbable | Repo vacío |
| [belentani-office](https://github.com/belentani7/belentani-office) | posible | Lenguaje: JavaScript — activar solo si es sitio web |
| [belentani-omega-immersive-portal](https://github.com/belentani7/belentani-omega-immersive-portal) | posible | Lenguaje: JavaScript — activar solo si es sitio web |
| [belentani-video-forge](https://github.com/belentani7/belentani-video-forge) | improbable | Lenguaje: Python — activar solo si es sitio web |
| [duck-belentani-os-audited-2026-08-23](https://github.com/belentani7/duck-belentani-os-audited-2026-08-23) | posible | Lenguaje: TypeScript — activar solo si es sitio web |
| [duck-docs](https://github.com/belentani7/duck-docs) | posible | Lenguaje: TypeScript — activar solo si es sitio web |
| [duck-hub](https://github.com/belentani7/duck-hub) | posible | Lenguaje: TypeScript — activar solo si es sitio web |
| [first-contributions](https://github.com/belentani7/first-contributions) | posible | Lenguaje: ninguno — activar solo si es sitio web |
| [jvictorbarbosa](https://github.com/belentani7/jvictorbarbosa) | improbable | Repo vacío |
| [local-agent](https://github.com/belentani7/local-agent) | improbable | Archivado |
| [qwen-code](https://github.com/belentani7/qwen-code) | posible | Lenguaje: ninguno — activar solo si es sitio web |
| [the-judas-experience](https://github.com/belentani7/the-judas-experience) | posible | Archivado |
| [transformers](https://github.com/belentani7/transformers) | posible | Lenguaje: ninguno — activar solo si es sitio web |

---

## 🗑️ 5. Repos Vacíos (candidatos a borrado)


| Repo | Creado/actualizado |
|---|---|
| [belentani-judas](https://github.com/belentani7/belentani-judas) | 2026-08-28 |
| [jvictorbarbosa](https://github.com/belentani7/jvictorbarbosa) | 2026-08-26 |

Estos repos no tienen ningún commit. Si no se van a usar, borrarlos limpia la cuenta.

---

## ✅ 6. Recomendaciones Priorizadas

### 🔴 Prioridad 1 — HOY (seguridad)
1. **Revocar la API key de OpenRouter** expuesta en `CARQUIDEC/settings.json` → <https://openrouter.ai/keys>.
2. Purgar el secreto del histórico de `CARQUIDEC` (script `Fix-GithubCritical.ps1` incluido, usa `git filter-repo`).
3. Verificar en Supabase (proyecto `ejkcfwcjreaobffuexsb`) que **RLS está activado en todas las tablas** y que no hay service_role keys públicas.

### 🟠 Prioridad 2 — Esta semana (higiene)
4. En `abrazo-tender-words` y `tender-words-connect`: `git rm --cached .env` + añadir `.env` al `.gitignore` + commit.
5. Añadir `.gitignore` a los 13 repos sin él (2 son repos vacíos sin commits; los 11 restantes los corrige el script automáticamente: `belentani-omega-portal`, `belentani-video-forge`, `belentani7-gestaltAI`, `belentani7.github.io`, `duck-2026`, `duck-docs`, `judas-experience-galactic`, `judas-omega-static`, `michelle-relayze-web`, `openclaw-workspace`, `the-judas-experience`).
6. Añadir README.md a los 12 repos sin README (10 tienen contenido; el script genera un README mínimo para esos).

### 🟡 Prioridad 3 — Mantenimiento
7. Decidir sobre los repos vacíos (`belentani-judas`, `jvictorbarbosa`): inicializar o borrar.
8. Activar GitHub Pages solo en los repos que son sitios web (no en herramientas/librerías).
9. Activar **secret scanning + push protection** en Settings → Code security de la cuenta (gratis para repos públicos; si tienes GitHub Pro, también push protection en privados).
10. Considerar agrupar los ~25 repos "duck-*" y "omega/judas" duplicados para reducir superficie de auditoría.

---

## 🛠️ Script de Corrección Automática

Ver `fix-github-critical.ps1` en este workspace. Ejecutarlo con:

```powershell
cd C:\Users\USER\.openclaw\workspace
.\fix-github-critical.ps1            # modo seguro: solo muestra lo que haría
.\fix-github-critical.ps1 -Apply     # aplica cambios reales
```

---
*Informe generado automáticamente por subagente de auditoría. Hallazgos de secretos verificados manualmente (no solo por scanner).*