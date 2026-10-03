[![Open in VS Code](https://img.shields.io/badge/Open_in-VS_Code-007ACC?logo=visualstudiocode&logoColor=white)](https://github.dev/belentani7/skills-registry)

# 🌐 Skills Registry — Global CLI Agent Skills System

**El NPM de las Skills para Agents CLI.**  
Un sistema universal para organizar, distribuir e instanciar skills en agentes CLI (Qwen Code, Claude Code, Cline, OpenCode, Codex CLI, Gemini CLI).

## 🔗 Schema completo

📄 [SCHEMA.md](./SCHEMA.md) — Especificación completa del sistema

## ⚡ Quick Start

### Instalar una Skill

```bash
npx skills add belentani7/skills-registry open-school
npx skills add belentani7/skills-registry cursor-ai-cli-unified
```

### Buscar Skills

```bash
npx skills search "education"
npx skills search "multi-file editing"
npx skills search "token optimization"
```

### Ver Info

```bash
npx skills info open-school
```

### Listar Instaladas

```bash
npx skills list
```

## 📦 Skills Disponibles

| ID | Versión | Categoría | Descripción |
|----|---------|-----------|-------------|
| `cursor-ai-cli-unified` | 1.0.0 | Coding Agents | Unified CLI coding agent workflow based on Cursor IDE patterns |
| `open-school` | 2.0.0 | Education | Universal digital education platform — modular courses, QR certifications |
| `caveman` | 1.0.0 | Token Opt | Ultra-compressed mode. Cuts tokens 65%. |
| `testing-driven-development` | 1.0.0 | Workflows | Use before implementing any feature or bugfix |
| `brainstorming` | 1.0.0 | Planning | MUST use before creative work: classify → explore → design → approve → implement |
| ... +18 más en registry.json | | | |

## 🏗️ Arquitectura

```
github.com/belentani7/skills-registry/
├── registry.json       ← Índice MAESTRO de todas las skills
├── cli/src/index.ts    ← Resolver CLI (Node.js)
└── skills/             ← Cada skill = un directorio con SKILL.md
    ├── open-school/
    │   ├── SKILL.md
    │   └── manifest.json
    ├── cursor-ai-cli-unified/
    │   └── ...
    └── caveman/
        └── ...
```

## 🤝 Contribuir

¿Tienes una skill que quieres compartir?

1. Fork el repositorio
2. Crear carpeta: `skills/mi-skill/SKILL.md`
3. Añadir `manifest.json` con metadatos correctos
4. Commit + Pull Request
5. CI valida automáticamente
6. Merge → auto-publish

Más detalles en [SCHEMA.md](./SCHEMA.md).

## 🔑 Principios

- **Open Source** — MIT, cualquiera puede contribuir
- **Versionado Semántico** — v1.0.0 → v1.0.1 → v2.0.0
- **Zero Lock-in** — Skills funcionan offline después de descargar
- **Dependencias Declarativas** — Skills pueden depender de otras
- **Discovery por Tags** — Búsqueda semántica en el registry

## 📊 Estadísticas

- **Total Skills:** 23+
- **Categorías:** 5 principales (Coding Workflows, Coding Agents, Education, Brainstorming, Token Optimization)
- **CLI Tools Soportadas:** Qwen Code, Claude Code, Cline, OpenCode/Crush, Codex CLI, Gemini CLI
