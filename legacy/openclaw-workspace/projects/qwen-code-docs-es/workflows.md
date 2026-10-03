# Flujos de trabajo

Qwen Code es componible y scriptable: funciona igual de bien en una sesión interactiva que dentro de una tubería Unix o un pipeline de CI. Esta guía muestra flujos de trabajo reales, con ejemplos que puedes copiar y adaptar.

## 1. Construir una funcionalidad de principio a fin

El flujo clásico: descripción → plan → código → verificación.

```text
> I need a rate limiter middleware for our Express API.
  Requirements: 100 requests per minute per IP, return 429 when exceeded,
  store counters in Redis with automatic expiry.
  First, show me your plan before writing code.
```

**Buenas prácticas:**

- Pide el plan primero (`First, show me your plan`) para revisiones de diseño.
- Especifica requisitos medibles (límites, códigos de error, almacenamiento).
- Deja que Qwen Code explore el código existente antes de proponer nada.

## 2. Debugging con contexto

Pega el error real y deja que Qwen Code investigue:

```text
> I'm getting this error when running the test suite:
  TypeError: Cannot read properties of undefined (reading 'toISOString')
  at OrderService.formatDate (src/services/orders.ts:142:31)
  Find the root cause and fix it without changing the public API.
```

**Técnicas que funcionan bien:**

- Incluye el stack trace completo.
- Añade restricciones («without changing the public API», «don't upgrade dependencies»).
- Pide el diagnóstico antes que el fix: `explain why this happens before fixing it`.

## 3. Git conversacional

Qwen Code convierte Git en una conversación:

```text
> what files have I changed?
> commit my changes with a descriptive message
> create a new branch called feature/rate-limiter
> show me the last 5 commits
> help me resolve merge conflicts
> squash my last 3 commits into one
```

**Flujo completo de PR:**

```text
> review my changes and suggest improvements     # auto-revisión
> fix the issues you found                       # aplica mejoras
> commit and push, then create a PR with a
  description summarizing the changes            # PR listo
```

> 💡 Por defecto, Qwen Code añade un trailer `Co-authored-by` a los commits y atribución a las descripciones de PR (`general.gitCoAuthor`). Puedes desactivarlo en `settings.json`.

## 4. Refactorización segura

```text
> refactor the authentication module to use async/await instead of callbacks.
  Keep all existing tests passing. Run them after each significant change.
```

Para refactorizaciones grandes, trabaja por etapas:

```text
1. first, list all call sites of the legacy `sendMail` function
2. create the new async version alongside it
3. migrate call sites one module at a time, running tests after each
4. delete the legacy version when nothing references it
```

## 5. Tests

```text
> write unit tests for the calculator functions
> what's our test coverage for src/services/? write tests for the gaps
> this test is flaky: it fails ~10% of the time. find out why.
```

## 6. Documentación

```text
> update the README with installation instructions
> generate JSDoc comments for all exported functions in src/utils/
> write a CHANGELOG entry for the changes since v1.4.0
```

## 7. Revisión de código

El comando `/review` hace revisiones estructuradas de tus cambios o de un PR:

```text
> /review                    # revisa los cambios actuales
```

Configura el comportamiento por defecto en `settings.json` (ámbito de usuario/sistema):

```json
{
  "review": {
    "effort": "auto",
    "attribution": true
  }
}
```

## 8. Automatización en tuberías y CI

La filosofía Unix de Qwen Code brilla fuera de la sesión interactiva:

```bash
# Analizar un log en tiempo real
tail -f app.log | qwen -p "Slack me if you see any anomalies appear in this log stream"

# Revisión de código en CI
qwen -p "review the diff in this PR and post findings as comments"

# Traducción automática de cadenas
qwen -p "If there are new text strings, translate them into French and raise a PR for @lang-fr-team to review"

# Generar notas de versión a partir del git log
git log --oneline v1.4.0..HEAD | qwen -p "turn this into user-facing release notes in markdown"
```

**Ejemplo de job en GitHub Actions** (modo headless con API key en secrets):

```yaml
jobs:
  qwen-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Qwen Code
        run: curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.sh | bash
      - name: Review PR
        env:
          BAILIAN_CODING_PLAN_API_KEY: *** secrets.BAILIAN_CODING_PLAN_API_KEY }}
          OPENAI_BASE_URL: https://coding.dashscope.aliyuncs.com/v1
          OPENAI_MODEL: qwen3-coder-plus
        run: qwen -p "review the changes in this branch and summarize risks"
```

> 💡 En entornos sin TTY (CI, SSH, contenedores) no puedes completar el login OAuth por navegador: usa API key, Coding Plan o Token Plan. Consulta [model-providers.md](model-providers.md).

## 9. Análisis de datos ad hoc

```text
> build a dashboard showing products that are most frequently returned
  by our UK customers

> analyze the database schema

> this CSV has 10k rows of survey data: summarize the top 5 complaints
  by category
```

## 10. Sesiones largas y contexto

| Comando | Cuándo usarlo |
|---|---|
| `/compress` | El historial crece demasiado: lo resume y ahorra tokens |
| `/clear` | Cambias de tarea y quieres pantalla limpia (`Ctrl+L`) |
| `/rewind` | Deshacer: vuelve a un punto anterior de la sesión |
| `qwen --continue` | Retoma la última sesión desde la terminal |
| `qwen --resume` | Elige qué sesión anterior retomar |

> 💡 Qwen Code guarda el historial en disco (`general.chatRecording`). Si lo desactivas, `--continue` y `--resume` dejan de funcionar.

## Consejos transversales

1. **Un objetivo por sesión**: las sesiones enfocadas producen mejores resultados.
2. **Verifica con tests reales**: pide siempre `run the tests` antes de dar el trabajo por bueno.
3. **Commits frecuentes**: deja que Qwen Code haga commits pequeños y descriptivos; `git` es tu red de seguridad.
4. **Modo plan para cambios grandes**: pide el plan, revísalo y después autoriza la implementación.
5. **Aprobaciones**: revisa cada diff antes de aprobar, o activa «Accept all» solo en tareas de confianza (p. ej. documentación).

---

← [Proveedores de modelos](model-providers.md) · [Consejos y mejores prácticas →](tips.md)
