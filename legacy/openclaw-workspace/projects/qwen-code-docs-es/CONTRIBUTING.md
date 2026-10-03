# CONTRIBUTING.md — Cómo enviar esta traducción como PR

Esta guía explica paso a paso cómo contribuir con la traducción al español de la documentación de Qwen Code al ecosistema QwenLM, en nombre de [@belentani7](https://github.com/belentani7).

## Contexto: dónde vive la documentación

Hay dos repositorios relevantes:

| Repositorio | Rol |
|---|---|
| [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) | El CLI. El contenido fuente de la documentación está en `docs/`. |
| [QwenLM/qwen-code-docs](https://github.com/QwenLM/qwen-code-docs) | El sitio de documentación (MDX/Next.js), publicado en https://qwenlm.github.io/qwen-code-docs/ — descrito como «herramienta de traducción de documentación diseñada específicamente para Qwen Code». |

La documentación oficial ya existe en varios idiomas (en, zh, ja, ko, de, fr, ru, pt-BR…). **El español es la lengua ausente más hablada de esa lista** — por eso esta contribución aporta valor real.

> ⚠️ Antes de empezar: verifica la estructura actual del repo (carpetas de idioma, convenciones de nombres) en `docs/` de qwen-code o en qwen-code-docs, porque puede evolucionar.

## Paso 0: Abre primero un issue

Las [directrices de contribución oficiales](https://qwenlm.github.io/qwen-code-docs/en/developers/contributing/) exigen que **todo PR esté vinculado a un issue existente**:

1. Ve a https://github.com/QwenLM/qwen-code-docs/issues (o https://github.com/QwenLM/qwen-code/issues si el contenido vive allí).
2. Abre un issue en inglés con un título como:
   > `docs(i18n): Add Spanish (es) translation of the user guide`
3. Describe: qué páginas traducirás, tu enfoque (traducción + ejemplos prácticos) y pide feedback a los maintainers.
4. Espera la aprobación antes de enviar el PR (o márcalo como Draft entretanto).

**Plantilla sugerida para el issue:**

```markdown
## Proposal: Spanish translation of the user guide

The user guide is available in en/zh/ja/ko/de/fr/ru/pt-BR, but Spanish —
one of the most spoken languages among developers — is missing.

I'd like to contribute a Spanish (es) translation of the core user guide
pages (overview, quickstart, configuration, model providers, auth), with
practical examples added where they help Spanish-speaking users.

Happy to split this into smaller PRs per page if maintainers prefer.
Feedback welcome!
```

## Paso 1: Haz un fork y clona

```bash
# Fork en la UI de GitHub, luego:
git clone https://github.com/belentani7/qwen-code-docs.git
cd qwen-code-docs
git checkout -b docs/es-user-guide
```

## Paso 2: Adapta el contenido a la estructura del sitio

Este paquete contiene la traducción como Markdown plano, listo para adaptarse al formato del sitio (MDX con frontmatter). Probablemente querrás:

1. Colocar los archivos en la carpeta de idioma que corresponda (p. ej. `docs/es/users/…` o equivalente según la convención actual).
2. Añadir el frontmatter/títulos que usen las demás traducciones (compara con `docs/de/` o `docs/fr/`).
3. Renombrar los documentos según la nomenclatura oficial:

| Este paquete | Página oficial equivalente |
|---|---|
| `README.md` | `users/overview` |
| `getting-started.md` | `users/quickstart` |
| `configuration.md` | `users/configuration/settings` |
| `model-providers.md` | `users/configuration/model-providers` + `users/configuration/auth` |
| `workflows.md` | Guías de `users/features/` |
| `tips.md` | `users/features/tips` |

4. Considera **dividir el PR en varios pequeños** (uno por página): las directrices oficiales favorecen PRs pequeños y atómicos, y sugieren dividir a partir de ~1.200 líneas cambiadas.

## Paso 3: Verifica localmente

```bash
npm install
npm run preflight    # tests, lint y checks de estilo
```

Si el sitio tiene un modo de desarrollo de documentación:

```bash
cd docs-site
npm install
npm run link
npm run dev
# abre http://localhost:3000 y revisa las páginas en español
```

## Paso 4: Commits y PR con Conventional Commits

Las directrices piden mensajes [Conventional Commits](https://www.conventionalcommits.org/) y un título descriptivo:

```bash
git commit -m "docs(i18n): add Spanish translation of user guide overview and quickstart"
git push origin docs/es-user-guide
```

Luego abre el PR contra `QwenLM/qwen-code-docs` (o el repo correcto) con:

**Título:** `docs(i18n): add Spanish (es) translation of the user guide`

**Descripción (plantilla):**

```markdown
## Summary
Adds a Spanish translation of the core user guide pages: overview,
quickstart, configuration, model providers (incl. Coding Plan & Token Plan),
workflows, and tips. Closes #<número del issue>.

## Notes
- Technical identifiers (commands, settings keys, model IDs) kept in
  English to match the tool's actual UI.
- Practical examples added for Spanish-speaking developers.
- Follows the structure of existing translations (de/fr/pt-BR).

## Checklist
- [x] Linked to issue #<número>
- [x] `npm run preflight` passes
- [x] Previewed locally with the docs dev server
```

## Paso 5: Responde al review

- Todos los PRs pasan code review, incluidos los de miembros del proyecto.
- Si piden cambios, responde con prontitud y mantén el PR enfocado.
- Usa **Draft PR** si quieres feedback temprano antes del review formal.

## Criterios de calidad de la traducción

Para mantener el nivel de las demás traducciones del sitio:

1. **Fidelidad técnica**: comandos, rutas, claves de configuración y nombres de modelos siempre en inglés, tal como aparecen en la herramienta.
2. **Español neutro**: evita localismos (usa «vosotros/ustedes» de forma consistente o forma impersonal; preferible impersonal: «se recomienda»).
3. **Ejemplos añadidos señalados**: si añades ejemplos que no están en el original, indícalo en el PR para que los maintainers lo sepan.
4. **Sincronización**: anota la fecha/commit del original desde el que tradujiste, para facilitar actualizaciones futuras.

## Más allá de la documentación: el pack de idioma de la UI

Qwen Code soporta packs de idioma personalizados (`~/.qwen/locales/es.js`). Una segunda contribución de gran impacto sería un pack `es.js` completo en el repo de qwen-code, para que la propia interfaz esté en español. ¡Buen siguiente paso después de que este PR aterrice!

---

Autor de esta traducción: [@belentani7](https://github.com/belentani7) · Agosto de 2026
