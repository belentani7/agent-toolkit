# Prompts para Z.AI - Mejora de Repositorios Belentani

## Contexto
Z.AI genera apps fullstack gratis con sandbox propio. Estos prompts están diseñados para que Z.AI cree herramientas que mejoren tus repos de GitHub.

---

## 1. AUDITOR AUTOMÁTICO DE REPOS

### Prompt: Repo Auditor Dashboard
```
Crea un dashboard fullstack que audite repositorios de GitHub automáticamente:

BACKEND (Node.js + Express):
- Endpoint POST /audit que reciba: { repoUrl, githubToken }
- Use GitHub API para obtener: estructura de archivos, package.json, README, issues abiertos
- Analice: secretos expuestos (patrones sk-, ghp_, password=), dependencias desactualizadas, ausencia de CI/CD, README incompleto
- Guarde resultados en SQLite
- Endpoint GET /reports para listar auditorías

FRONTEND (React + Tailwind):
- Formulario para ingresar URL del repo y token de GitHub
- Tabla con resultados: repo, score (0-100), problemas críticos, warnings
- Gráfico de radar con métricas: seguridad, documentación, calidad, actividad
- Botón "Exportar PDF" para generar informe

ESTÉTICA: Cyberpunk con negro + rojo sangre (#ff073a) + glassmorphism
Starfield animado de fondo con Three.js

DEPLOY: Docker-compose con backend + frontend + nginx reverse proxy
```

---

## 2. GENERADOR DE README INTELIGENTE

### Prompt: README Generator
```
Crea una app que genere READMEs profesionales para repos de GitHub:

BACKEND (Python + FastAPI):
- Endpoint POST /generate que reciba: { repoUrl, language, framework }
- Clone el repo temporalmente, analice estructura
- Use LLM (Qwen API) para generar: descripción, instalación, uso, ejemplos, licencia
- Detecte automáticamente: dependencias, comandos de build/test, variables de entorno
- Endpoint GET /templates con 10 templates predefinidos (minimalista, detallado, badge-heavy)

FRONTEND (Next.js + TypeScript):
- Input para URL del repo
- Selector de estilo de README
- Preview en tiempo real con markdown renderizado
- Botón "Copiar" y "Descargar README.md"
- Historial de READMEs generados (localStorage)

EXTRA: Integración con GitHub API para crear PR automático con el nuevo README
```

---

## 3. SECRET SCANNER VISUAL

### Prompt: Secret Scanner
```
Crea un visualizador de secretos expuestos en repos:

BACKEND (Node.js):
- Endpoint POST /scan que reciba: { repoUrl, depth: 'shallow' | 'full' }
- Clone el repo, escanee TODOS los archivos (incluyendo historial git si depth='full')
- Patrones a detectar:
  * API keys: sk-*, ghp_*, nvapi-*, xai-*, AKIA*, AIza*
  * Passwords: password=*** token:*** secret:
  * Private keys: BEGIN PRIVATE KEY, BEGIN RSA PRIVATE KEY
  * .env files versionados
  * Tokens en config/yml/json
- Para cada hallazgo: archivo, línea, tipo de secreto, severidad (CRITICAL/HIGH/MEDIUM)
- NO mostrar el secreto completo, solo máscara (primeros 4 + últimos 4 chars)

FRONTEND (React + D3.js):
- Tree map visual del repo con nodos coloreados por severidad
- Click en archivo para ver detalles del secreto (mascarado)
- Timeline de commits donde se introdujo el secreto
- Exportar reporte JSON/CSV

ANIMACIONES: Framer Motion para transiciones, efectos de glitch en hover
```

---

## 4. DEPENDENCY UPDATER AUTOMÁTICO

### Prompt: Dependency Updater
```
Crea una app que actualice dependencias automáticamente con PRs:

BACKEND (Python):
- Endpoint POST /update que reciba: { repoUrl, strategy: 'minor' | 'major' | 'security' }
- Clone el repo, detecte manifiesto (package.json, requirements.txt, go.mod, etc.)
- Para cada dependencia:
  * Verifique versión actual vs última disponible
  * Si strategy='security', solo actualice vulnerabilidades conocidas (use npm audit / safety check)
  * Si strategy='minor', actualice minor/patch
  * Si strategy='major', actualice todo
- Ejecute tests después de cada actualización
- Si tests pasan: commit + push + PR automático
- Si tests fallan: rollback y reporte

FRONTEND (Vue.js + Vuetify):
- Dashboard con lista de dependencias: nombre, versión actual, última, estado (actualizado/outdated/vulnerable)
- Selector de estrategia de actualización
- Log en tiempo real del proceso
- Lista de PRs creados con estado (open/merged/closed)

INTEGRACIÓN: GitHub Actions workflow para ejecutar automáticamente cada lunes
```

---

## 5. CODE QUALITY DASHBOARD

### Prompt: Code Quality Dashboard
```
Crea un dashboard de calidad de código para múltiples repos:

BACKEND (Node.js + GraphQL):
- Queries:
  * repos: lista todos los repos monitoreados
  * repo(id): métricas detalladas de un repo
  * metrics(repoId): líneas de código, complejidad ciclomática, duplicación, cobertura de tests
- Usa: SonarQube API (si está disponible) o análisis estático local (ESLint, Pylint, etc.)
- Cron job diario para actualizar métricas de todos los repos
- Webhook de GitHub para actualizar en cada push

FRONTEND (React + Recharts):
- Grid de cards con todos los repos: score de calidad, tendencia (subiendo/bajando), últimos commits
- Click en repo para ver: gráfico de líneas de código en el tiempo, distribución de lenguajes, top 10 archivos más complejos
- Comparador lado a lado de 2 repos
- Alertas: repos con calidad decreciente, dependencias vulnerables, sin tests

ESTÉTICA: Dark mode con acentos en cyan (#00f0ff) y rojo sangre (#ff073a)
```

---

## 6. MULTI-REPO SEARCH ENGINE

### Prompt: Cross-Repo Search
```
Crea un buscador que indexe todos tus repos de GitHub:

BACKEND (Python + Elasticsearch):
- Endpoint POST /index que clone todos los repos de un usuario y los indexe
- Endpoint GET /search?q={query}&lang={language}&repo={repo}
- Indexe: código, comentarios, READMEs, nombres de archivos
- Soporte para búsqueda fuzzy y regex
- Autocompletado de queries comunes

FRONTEND (Svelte + Tailwind):
- Barra de búsqueda prominente con autocompletado
- Filtros: por lenguaje, por repo, por tipo (código/docs/config)
- Resultados con syntax highlighting y contexto (líneas antes/después)
- Click para abrir en GitHub en la línea exacta
- Búsquedas guardadas (localStorage)

PERFORMANCE: Debounce de 300ms en búsqueda, paginación infinita
```

---

## 7. AUTOMATED CHANGELOG GENERATOR

### Prompt: Changelog Generator
```
Crea una app que genere changelogs automáticos desde commits:

BACKEND (Node.js):
- Endpoint POST /changelog que reciba: { repoUrl, fromTag, toTag }
- Obtenga commits entre las dos tags
- Clasifique automáticamente por tipo (feat/fix/docs/refactor/test/chore) usando conventional commits
- Si no hay conventional commits, use LLM para clasificar
- Genere changelog en formato Keep a Changelog
- Soporte para múltiples idiomas (ES/EN/PT)

FRONTEND (React):
- Selector de repo y rango de tags/commits
- Preview del changelog generado
- Editor para ajustar manualmente
- Botón "Crear Release" en GitHub con el changelog como body
- Historial de changelogs generados

EXTRA: GitHub Action para generar changelog automáticamente en cada release
```

---

## 8. REPO HEALTH MONITOR

### Prompt: Repo Health Monitor
```
Crea un monitor de salud de repos en tiempo real:

BACKEND (Node.js + WebSocket):
- Monitoreo continuo de: último commit, issues abiertos, PRs pendientes, CI status, dependencias vulnerables
- WebSocket para notificaciones en tiempo real
- Alertas configurables: si pasan >7 días sin commits, si hay >10 issues abiertos, si CI falla
- Integración con Slack/Discord webhooks para notificaciones

FRONTEND (React + Socket.io-client):
- Dashboard con semáforos: verde (sano), amarillo (atención), rojo (crítico)
- Lista de repos con métricas en tiempo real
- Gráfico de actividad (commits por día)
- Timeline de eventos (commits, issues, PRs)
- Configuración de alertas por repo

ANIMACIONES: Pulso en los semáforos, transiciones suaves entre estados
```

---

## 9. API MOCK GENERATOR

### Prompt: API Mock Generator
```
Crea un generador de mocks de API desde OpenAPI/Swagger specs:

BACKEND (Python + FastAPI):
- Endpoint POST /mock que reciba: { specUrl } (OpenAPI 3.0 spec)
- Parse la spec, genere endpoints mock con datos realistas (usando Faker)
- Soporte para: GET (listar/detalle), POST (crear), PUT (actualizar), DELETE
- Simule latencia de red configurable
- Soporte para autenticación mock (API key, OAuth2)

FRONTEND (Vue.js):
- Input para URL del spec OpenAPI
- Lista de endpoints generados con método, path, descripción
- Editor para ajustar respuestas mock
- Toggle para activar/desactivar endpoints
- Botón "Deploy" para generar URL pública del mock server

EXTRA: Generar tests automatizados que validen que la API real cumple el spec
```

---

## 10. CONTRIBUTION TRACKER

### Prompt: Contribution Tracker
```
Crea un tracker de contribuciones a open source:

BACKEND (Node.js):
- Endpoint POST /track que reciba: { githubUsername }
- Use GitHub API para obtener: PRs creados, issues abiertos, commits en repos ajenos
- Clasifique por: repo, tipo (code/docs/review), lenguaje
- Calcule métricas: repos contribuidos, líneas de código añadidas, PRs mergeados

FRONTEND (React + D3.js):
- Mapa de calor estilo GitHub contributions pero por repos externos
- Gráfico de torta: distribución por lenguaje
- Timeline de contribuciones
- Leaderboard personal: top repos contribuidos
- Exportar como imagen para compartir en redes

ESTÉTICA: Cyberpunk con gradientes de rojo a púrpura
```

---

## Notas de Implementación

### Para todos los prompts:
- **Stack recomendado**: Next.js o React + Node.js/Python backend + PostgreSQL/SQLite
- **Autenticación**: JWT para APIs, OAuth2 para GitHub
- **Deploy**: Docker-compose para desarrollo, Vercel/Railway para producción
- **Estética común**: Negro (#0a0a0a) + Rojo sangre (#ff073a) + Glassmorphism + Starfield
- **Responsive**: Mobile-first, breakpoints en 640px, 1024px, 1280px

### Integración con Belentani:
- Todos pueden conectarse a tu GitHub personal (belentani7)
- Usar Qwen API para análisis inteligente de código
- Integrar con el sistema de créditos de BELENTANI NEXUS
- Estética coherente con JUDAS_OS y el universo Belentani

### Prioridad sugerida:
1. **Repo Auditor Dashboard** - Más impacto inmediato
2. **Secret Scanner** - Seguridad crítica
3. **README Generator** - Mejora rápida de todos los repos
4. **Dependency Updater** - Mantenimiento automático
5. **Code Quality Dashboard** - Visibilidad a largo plazo
