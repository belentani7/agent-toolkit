# Consejos y mejores prácticas

Recopilación de consejos para sacarle el máximo partido a Qwen Code, desde trucos de prompt hasta seguridad y ahorro de tokens.

## Prompts efectivos

### Sé específico

| ❌ Vago | ✅ Específico |
|---|---|
| «fix the bug» | «fix the login bug where users see a blank screen after entering wrong credentials» |
| «improve performance» | «the /users endpoint takes 4s with 10k rows; add pagination and an index on created_at» |
| «write tests» | «write unit tests for src/utils/date.ts covering leap years and timezone edge cases» |

### Divide y vencerás

Las tareas complejas funcionan mejor como pasos numerados:

```text
1. create a new database table for user profiles
2. create an API endpoint to get and update user profiles
3. build a webpage that allows users to see and edit their information
```

### Explorar antes de actuar

Deja que Qwen Code entienda el código antes de modificarlo:

```text
analyze the database schema
```

```text
explain how the payment flow works before we change anything
```

### Establece restricciones

Las restricciones producen soluciones más ajustadas:

```text
fix it without upgrading any dependencies
refactor this module but don't change any public function signatures
```

## Atajos y productividad

| Atajo | Qué hace |
|---|---|
| `?` | Muestra todos los atajos de teclado |
| `Tab` | Autocompleta comandos (y acepta sugerencias fantasma) |
| `↑` | Historial de comandos |
| `/` | Lista de slash commands |
| `Ctrl+L` | Limpia la pantalla (equivalente a `/clear`) |

## Ahorro de tokens y costes

1. **`/compress` cuando el historial crezca**: resume la conversación y reduce el consumo.
2. **`/clear` entre tareas no relacionadas**: empezar limpio evita arrastrar contexto inútil.
3. **Modelo adecuado para cada tarea**: usa un modelo potente para arquitectura y uno rápido/barato para tareas mecánicas. Cambia con `/model` en cualquier momento.
4. **Sesiones enfocadas**: una sesión por objetivo consume menos que una sesión-marathon.
5. **Revisa el seguimiento de costes**: el workspace `.qwen` centraliza el seguimiento de uso de tu organización (especialmente útil con Token Plan).

## Seguridad

- 🔒 **Nunca subas API keys a git**: usa `.qwen/.env` + `.gitignore`, o secrets de tu CI.
- 🔍 **Revisa cada diff antes de aprobar**: Qwen Code siempre pide permiso antes de modificar archivos — aprovéchalo.
- 🧪 **Ejecuta los tests** antes de aceptar un cambio (`run the tests`).
- 🧹 **`/doctor`** tras cambios de configuración para verificar que todo está en orden.
- 🌐 **Cuidado con contenido externo**: si pegas contenido de fuentes no confiables (emails, logs de terceros), revisa lo que Qwen Code propone ejecutar antes de aprobarlo.

## Trabajar en español

Qwen Code es multilingüe de fábrica:

```text
/language output Spanish
```

- El modelo te responderá en español aunque escribas prompts en inglés.
- Puedes escribir tus prompts directamente en español: Qwen Code entiende ambos.
- **Convención recomendada**: prompts y conversación en español, pero mantén en inglés los identificadores técnicos (nombres de archivos, funciones, comandos) para evitar malentendidos con el código.

Ejemplo de prompt bilingüe efectivo:

```text
añade validación de email al formulario de registro en src/forms/RegisterForm.tsx,
usa zod y muestra los mensajes de error en español
```

## Configuración que merece la pena

```json
{
  "general": {
    "outputLanguage": "Spanish",
    "terminalBell": true
  },
  "output": {
    "showTimestamps": true
  },
  "ui": {
    "theme": "Qwen Dark"
  }
}
```

- `output.showTimestamps`: útil para sesiones largas y para correlacionar con logs.
- `general.vimMode: true`: si vives en Vim.
- `/theme`: elige el tema que menos canse tu vista.

## Errores comunes (y cómo evitarlos)

| Error | Solución |
|---|---|
| Aprobar cambios sin leer el diff | Lee siempre; el modo «Accept all» solo para tareas triviales |
| Pedir cinco cosas a la vez | Una tarea por prompt; usa listas numeradas para tareas multi-paso |
| No dar contexto del proyecto | Deja que explore primero (`explain the folder structure`) o mantén un archivo de contexto del proyecto |
| Olvidar ejecutar los tests | Pide explícitamente `run the tests` antes del commit |
| Sesiones eternas sin `/compress` | Comprime el historial cuando notes respuestas más lentas o caras |
| Usar OAuth en CI | En entornos headless usa API key / Coding Plan / Token Plan |

## Recursos

- **Documentación oficial**: https://qwenlm.github.io/qwen-code-docs/
- **Comunidad**: [GitHub Discussions](https://github.com/QwenLM/qwen-code/discussions)
- **Issues**: https://github.com/QwenLM/qwen-code/issues

---

← [Flujos de trabajo](workflows.md) · [Cómo contribuir →](CONTRIBUTING.md)
