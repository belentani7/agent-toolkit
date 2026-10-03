# Qwen Code — Documentación en Español (ES)

> Traducción comunitaria al español de la [documentación oficial de Qwen Code](https://qwenlm.github.io/qwen-code-docs/en/users/overview/).
> **Qwen Code** es la herramienta de programación agéntica de Qwen: vive en tu terminal y te ayuda a convertir ideas en código más rápido que nunca.

---

## ¿Qué es Qwen Code?

Qwen Code es un asistente de código basado en IA que funciona directamente en tu terminal. No es otra ventana de chat ni otro IDE: Qwen Code te acompaña donde ya trabajas, con las herramientas que ya usas.

### Qué puede hacer por ti

| Capacidad | Descripción |
|---|---|
| **Construir funcionalidades desde descripciones** | Describe en lenguaje natural lo que quieres construir. Qwen Code elabora un plan, escribe el código y verifica que funcione. |
| **Depurar y corregir errores** | Describe un bug o pega un mensaje de error. Analiza tu base de código, identifica el problema e implementa la solución. |
| **Navegar cualquier base de código** | Pregunta cualquier cosa sobre el código de tu equipo y recibe una respuesta razonada. Con [MCP](https://qwenlm.github.io/qwen-code-docs/en/users/features/mcp/) puede consultar fuentes externas como Google Drive, Figma o Slack. |
| **Automatizar tareas tediosas** | Corrige problemas de lint, resuelve conflictos de merge y escribe notas de versión, todo desde un solo comando o automáticamente en tu CI. |
| **Sugerencias de seguimiento** | Predice lo que vas a escribir y lo muestra como texto fantasma. Pulsa `Tab` para aceptar o sigue escribiendo para descartar. |

### Filosofía Unix

Qwen Code es **componible y scriptable**. Puedes usarlo en tuberías y en CI:

```bash
# Analiza un log en tiempo real y avísame por Slack si ves anomalías
tail -f app.log | qwen -p "Slack me if you see any anomalies appear in this log stream"

# En tu pipeline de CI: traduce cadenas nuevas y crea un PR
qwen -p "If there are new text strings, translate them into French and raise a PR for @lang-fr-team to review"
```

---

## Empieza en 30 segundos

### 1. Instala Qwen Code

**Linux / macOS**

```bash
curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.sh | bash
```

**Windows (PowerShell)**

```powershell
irm https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.ps1 | iex
```

> 💡 Reinicia tu terminal tras la instalación si `qwen` no está disponible de inmediato. Si la instalación falla, consulta la [instalación manual](getting-started.md#instalación-manual).

**Instalación manual (alternativa):** requiere Node.js 22 o superior.

```bash
npm install -g @qwen-code/qwen-code@latest
# o en macOS/Linux:
brew install qwen-code
```

### 2. Entra en tu proyecto y ejecuta Qwen Code

```bash
cd tu-proyecto
qwen
```

En el primer arranque se te pedirá conectar un proveedor de modelos. El menú ofrece:

- **Alibaba ModelStudio** (recomendado): Coding Plan, Token Plan o Standard API Key
- **Third-party Providers**: DeepSeek, Grok, MiniMax, Z.AI, Kimi, OpenRouter y más, mediante API key
- **Custom Provider**: servidor local, proxy o proveedor no soportado

### 3. Haz tu primera pregunta

```text
> what does this project do?
```

Eso es todo. 👏

---

## Índice de esta guía

| Documento | Contenido |
|---|---|
| [getting-started.md](getting-started.md) | Guía de inicio rápido: instalación, autenticación, primera sesión, comandos esenciales |
| [configuration.md](configuration.md) | Configuración completa: capas de configuración, `settings.json`, variables de entorno, temas e idioma |
| [model-providers.md](model-providers.md) | Proveedores de modelos: Coding Plan, **Token Plan**, API keys, modelos locales |
| [workflows.md](workflows.md) | Flujos de trabajo reales: features, debugging, Git, tests, refactorización, automatización en CI |
| [tips.md](tips.md) | Consejos y mejores prácticas para sacarle el máximo partido |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Cómo enviar esta traducción como PR a QwenLM |

---

## Consejos rápidos para empezar

- **Sé específico**: en lugar de «fix the bug», prueba con «fix the login bug where users see a blank screen after entering wrong credentials».
- **Deja que explore primero**: `analyze the database schema` antes de pedir cambios.
- **Pulsa `?`** dentro de una sesión para ver todos los atajos de teclado.
- **`/language output Spanish`**: haz que Qwen Code te responda en español.
- **`/doctor`**: comprueba tu configuración en cualquier momento.

> ⚠️ **Nota**: Qwen OAuth fue descontinuado el 15 de abril de 2026. Si lo usabas, cambia a Coding Plan, Token Plan o una API key con `/auth`.

---

## Nota sobre la extensión de VS Code (Beta)

¿Prefieres una interfaz gráfica? La extensión oficial de VS Code ofrece una experiencia nativa de IDE sin necesidad de conocer la terminal: instala [Qwen Code Companion](https://marketplace.visualstudio.com/items?itemName=qwenlm.qwen-code-vscode-ide-companion) desde el marketplace y empieza a programar con Qwen Code directamente en tu barra lateral.

---

## Estado de esta traducción

Esta traducción comunitaria cubre la guía de usuario principal (sección `users/`) de la documentación oficial en inglés, con ejemplos prácticos añadidos para hispanohablantes. Los comandos, nombres de configuración y valores técnicos se mantienen en inglés deliberadamente, ya que así aparecen en la herramienta.

- **Fuente original**: https://qwenlm.github.io/qwen-code-docs/en/users/overview/
- **Última sincronización**: agosto de 2026
- **Mantenedor**: [@belentani7](https://github.com/belentani7)

¿Encontraste un error o quieres mejorar algo? Lee [CONTRIBUTING.md](CONTRIBUTING.md).
