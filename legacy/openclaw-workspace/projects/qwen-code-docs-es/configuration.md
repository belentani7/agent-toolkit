# Configuración

Qwen Code ofrece varias formas de configurar su comportamiento: variables de entorno, argumentos de línea de comandos y archivos de configuración. Esta guía explica todos los métodos y las opciones disponibles.

> 🔑 **Autenticación / API keys**: la autenticación (API key, Coding Plan, Token Plan) y las variables de entorno relacionadas (como `OPENAI_API_KEY`) se documentan en [model-providers.md](model-providers.md).

> 📝 **Nuevo formato de configuración**: el formato de `settings.json` se ha actualizado a una estructura más organizada. El formato antiguo se migra automáticamente.

## Capas de configuración

La configuración se aplica en el siguiente orden de precedencia (los niveles bajos son sobrescritos por los altos):

| Nivel | Fuente | Descripción |
|---|---|---|
| 1 | Valores por defecto | Valores codificados en la aplicación |
| 2 | Archivo de valores por defecto del sistema | Valores por defecto globales que pueden ser sobrescritos por otros archivos |
| 3 | Archivo de configuración del usuario | Configuración global del usuario actual |
| 4 | Archivo de configuración del proyecto | Configuración específica de un proyecto |
| 5 | Archivo de configuración del sistema | Configuración global que sobrescribe todos los demás archivos |
| 6 | Variables de entorno | Variables globales o de sesión, posiblemente cargadas desde archivos `.env` |
| 7 | Argumentos de línea de comandos | Valores pasados al lanzar el CLI |

## Archivos de configuración

Qwen Code usa archivos JSON para la configuración persistente. Hay cuatro ubicaciones:

| Tipo | Ubicación | Ámbito |
|---|---|---|
| **Valores por defecto del sistema** | Linux: `/etc/qwen-code/system-defaults.json` · Windows: `C:\ProgramData\qwen-code\system-defaults.json` · macOS: `/Library/Application Support/QwenCode/system-defaults.json` | Capa base de valores por defecto. La precedencia más baja. |
| **Usuario** | `~/.qwen/settings.json` | Todas las sesiones del usuario actual. |
| **Proyecto** | `.qwen/settings.json` en la raíz del proyecto | Solo al ejecutar Qwen Code desde ese proyecto. Sobrescribe la configuración de usuario. |
| **Sistema** | Linux: `/etc/qwen-code/settings.json` · Windows: `C:\ProgramData\qwen-code\settings.json` · macOS: `/Library/Application Support/QwenCode/settings.json` | Todas las sesiones del sistema, para todos los usuarios. Útil para administradores de sistemas en empresas. |

> 💡 **Variables de entorno en settings**: los valores de cadena en `settings.json` pueden referenciar variables de entorno con la sintaxis `$VAR_NAME` o `${VAR_NAME}`. Se resuelven automáticamente al cargar. Ejemplo: `"apiKey": "$MY_API_TOKEN"`.

### El directorio `.qwen` de tu proyecto

Además del archivo de configuración, el directorio `.qwen` de un proyecto puede contener:

- **Perfiles de sandbox personalizados** (p. ej. `.qwen/sandbox-macos-custom.sb`, `.qwen/sandbox.Dockerfile`)
- **Agent Skills** bajo `.qwen/skills/` (cada Skill es un directorio con un `SKILL.md`)

### Migración de configuración

Qwen Code migra automáticamente la configuración heredada al nuevo formato, creando copias de seguridad antes. Algunas opciones cambiaron de nombre negativo (`disable*`) a positivo (`enable*`):

| Opción antigua | Opción nueva |
|---|---|
| `disableAutoUpdate` + `disableUpdateNag` | `general.enableAutoUpdate` (consolidadas) |
| `disableLoadingPhrases` | `ui.accessibility.enableLoadingPhrases` |
| `disableFuzzySearch` | `context.fileFiltering.enableFuzzySearch` |
| `disableCacheControl` | `model.generationConfig.enableCacheControl` |

> ⚠️ Al migrar, los valores booleanos se invierten: `disableAutoUpdate: true` pasa a ser `enableAutoUpdate: false`.

## Opciones disponibles en settings.json

La mayoría de las opciones se colocan dentro de su categoría correspondiente (`general`, `ui`, `output`, `model`, etc.). Unas pocas, como `proxy` y `plansDirectory`, siguen siendo claves raíz por compatibilidad.

### general

| Opción | Tipo | Descripción | Por defecto |
|---|---|---|---|
| `general.preferredEditor` | string | Editor preferido para abrir archivos | `undefined` |
| `general.vimMode` | boolean | Activa los atajos de Vim | `false` |
| `general.enableAutoUpdate` | boolean | Actualizaciones automáticas al arrancar | `true` |
| `general.gitCoAuthor.commit` | boolean | Añade el trailer `Co-authored-by` y notas de atribución IA a los commits hechos a través de Qwen Code | `true` |
| `general.gitCoAuthor.pr` | boolean | Añade línea de atribución a las descripciones de PR creadas con `gh pr create` | — |
| `general.defaultFileEncoding` | enum | Codificación de archivos nuevos: `"utf-8"` o `"utf-8-bom"` | `"utf-8"` |
| `general.language` | enum | Idioma de la interfaz: `"auto"` o un código de idioma (p. ej. `"es"`, `"zh-CN"`, `"fr"`). Requiere reinicio | `"auto"` |
| `general.outputLanguage` | string | Idioma de salida del modelo: `"auto"` o un idioma concreto. Requiere reinicio | `"auto"` |
| `general.terminalBell` | boolean | Suena la campana de la terminal al completar una respuesta o pedir aprobación | `true` |
| `general.preventSystemSleep` | boolean | Evita que el sistema entre en suspensión mientras hay respuestas en streaming | `true` |
| `general.chatRecording` | boolean | Guarda el historial de chat en disco (necesario para `--continue` y `--resume`) | `true` |
| `general.cleanupPeriodDays` | number | Días a conservar las copias de seguridad de `~/.qwen/file-history/` para `/rewind` | `30` |
| `general.voice.enabled` | boolean | Dictado por voz en el prompt (también con `/voice`) | `false` |

### output

| Opción | Tipo | Descripción | Por defecto |
|---|---|---|---|
| `output.format` | string | Formato de salida del CLI: `"text"`, `"json"` o `"stream-json"` | `"text"` |
| `output.showTimestamps` | boolean | Muestra `[HH:MM:SS]` antes de cada respuesta del asistente | `false` |

### ui

| Opción | Tipo | Descripción | Por defecto |
|---|---|---|---|
| `ui.theme` | string | Tema de color de la interfaz | `"Qwen Dark"` |
| `ui.customThemes` | object | Definiciones de temas personalizados | `{}` |
| `ui.statusLine` | object | Línea de estado personalizada | `undefined` |
| `ui.hideWindowTitle` | boolean | Oculta la barra de título de la ventana | `false` |
| `ui.hideTips` | boolean | Oculta todos los consejos en la interfaz | `false` |
| `ui.hideBanner` | boolean | Oculta el logo ASCII y panel de información de arranque | `false` |
| `ui.customBannerTitle` | string | Sustituye el título `>_ Qwen Code` del banner (máx. 80 caracteres) | `""` |

## Ejemplo completo de settings.json

Un ejemplo realista para un desarrollador hispanohablante con un modelo local y otro en la nube:

```json
{
  "general": {
    "language": "auto",
    "outputLanguage": "Spanish",
    "terminalBell": true
  },
  "ui": {
    "theme": "Qwen Dark"
  },
  "model": {
    "name": "qwen3-coder-plus"
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "env": {
    "BAILIAN_CODING_PLAN_API_KEY": "$BAILIAN_CODING_PLAN_API_KEY"
  }
}
```

> 🔒 En lugar de pegar tu API key en el archivo, referencia una variable de entorno (`"$BAILIAN_CODING_PLAN_API_KEY"`) o usa un archivo `.qwen/.env`. Más detalles en [model-providers.md](model-providers.md).

## Idioma: interfaz y salida del modelo

Qwen Code distingue dos conceptos de idioma:

| Comando | Qué controla | Dónde se guarda |
|---|---|---|
| `/language ui [idioma]` | Texto de la interfaz (menús, mensajes del sistema, prompts) | `~/.qwen/settings.json` |
| `/language output [idioma]` | Idioma en el que responde la IA | `~/.qwen/output-language.md` |

### Idioma de la interfaz

```text
/language ui es-ES    # Español
/language ui en-US    # Inglés
/language ui ca-ES    # Catalán
/language ui pt-BR    # Portugués (Brasil)
```

En el primer arranque, Qwen Code detecta el idioma del sistema automáticamente (prioridad: variable `QWEN_CODE_LANG` → `LANG` → configuración regional del sistema → inglés).

> 💡 Puedes forzar la detección con `export QWEN_CODE_LANG=es`.

### Idioma de respuesta del modelo

```text
/language output Spanish
```

Esto crea o actualiza `~/.qwen/output-language.md`, un archivo de reglas que se incluye en el contexto del modelo al arrancar. Reinicia Qwen Code para que el cambio surta efecto.

### Packs de idioma personalizados

Puedes crear o sobrescribir traducciones de la interfaz en `~/.qwen/locales/`:

```javascript
// ~/.qwen/locales/es.js
export default {
  Hello: 'Hola',
  Settings: 'Configuración',
  // ... más traducciones
};
```

El directorio de usuario tiene prioridad sobre las traducciones incluidas.

> 📌 Este es precisamente el mecanismo que hace posible esta documentación: si mantienes un pack `es.js` completo, la interfaz de Qwen Code puede funcionar íntegramente en español.

## Temas

Cambia el tema con `/theme` o en `settings.json`:

```json
{
  "ui": {
    "theme": "Qwen Dark"
  }
}
```

Puedes definir temas propios en `ui.customThemes`.

## Consejos de configuración

1. **Define `modelProviders` en el ámbito de usuario** (`~/.qwen/settings.json`) para evitar conflictos entre configuración de proyecto y de usuario.
2. **Prefiere `.qwen/.env` para secretos**: Qwen Code lo busca antes que `.env`, evitando conflictos con otras herramientas.
3. **No subas secretos a git**: añade `.qwen/.env` y `settings.json` con credenciales a tu `.gitignore`.
4. **Comprueba siempre con `/doctor`** después de cambiar la autenticación o el proveedor.
5. **Reinicia tras cambiar idiomas** (`general.language`, `general.outputLanguage`): requieren reinicio.

---

← [Guía de inicio rápido](getting-started.md) · [Proveedores de modelos →](model-providers.md)
