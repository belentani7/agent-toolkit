# AI Command Center — Manual operativo 10/10

## Propósito

AI Command Center es una estación de trabajo local-first para usar modelos de IA con una sola interfaz, sin mezclar Odysseus, OpenClaw, Aider y los proveedores de modelos. El sistema tiene dos caminos reales: un **companion local** que puede funcionar sin API usando un modelo instalado en tu ordenador, y un **backend seguro** para proveedores remotos cuando existe una clave configurada en el servidor.

> **Regla de honestidad:** sin API y sin un modelo local instalado, no existe una respuesta real de IA. En ese caso la interfaz sigue funcionando, pero informa de la ausencia en lugar de inventar resultados.

## Arquitectura

| Capa | Función | ¿Necesita API? | ¿Dónde se ejecuta? |
|---|---|---:|---|
| Interfaz React | Selector, chat, estados, comandos y documentación | No | Navegador |
| Companion local | Puente hacia Ollama, LM Studio, llama.cpp y proveedores remotos | No para modelos locales | Tu ordenador, `127.0.0.1:8788` |
| Backend tRPC | Adaptadores remotos con secretos fuera del navegador | Sí para proveedores remotos | Servidor de la aplicación |
| Modelo local | Genera respuestas offline | No | Ollama, LM Studio o llama.cpp |

El frontend no arranca procesos ni ejecuta comandos del sistema por sí mismo. Esa limitación es deliberada: evita que una página web pueda ejecutar acciones peligrosas sin una aprobación local explícita.

## Instalación desde el ZIP

Descomprime el archivo en una carpeta de trabajo. Instala Node.js 22 o una versión LTS compatible y pnpm. Desde la raíz del proyecto ejecuta:

```bash
pnpm install
pnpm check
pnpm test
pnpm check:companion
```

La última orden arranca el companion en un puerto efímero, prueba su estado, comprueba el catálogo y verifica que bloquea endpoints remotos cuando se ha seleccionado un proveedor local.

## Modo gratuito sin API: Ollama

Instala [Ollama](https://ollama.com/), arráncalo y descarga un modelo:

```bash
ollama serve
ollama pull llama3.2
pnpm companion
```

Mantén el companion ejecutándose. En el Centro de Mando abre **Model bridge**, selecciona **Ollama**, conserva `http://127.0.0.1:11434` y ejecuta una tarea. El navegador hablará con `http://127.0.0.1:8788`, y el companion hablará con Ollama. Ninguna API externa es necesaria.

La calidad y velocidad dependen del hardware y del modelo descargado. Si el modelo no cabe en la memoria disponible, elige uno más pequeño; no se debe declarar que el modo offline está activo si Ollama no responde.

## Modo gratuito sin API: LM Studio

En [LM Studio](https://lmstudio.ai/) descarga un modelo compatible, inicia su servidor local OpenAI-compatible y utiliza normalmente `http://127.0.0.1:1234/v1`. En **Model bridge**, selecciona **LM Studio**, escribe el identificador exacto del modelo cargado y conserva el endpoint local. El companion no añade ninguna clave a la petición.

## Modo gratuito sin API: llama.cpp

Inicia el servidor OpenAI-compatible de llama.cpp con un modelo GGUF, normalmente en `http://127.0.0.1:8080/v1`. Selecciona **llama.cpp** en la interfaz y utiliza el identificador de modelo esperado por tu servidor. Solo se aceptan endpoints de loopback por seguridad.

## Proveedores remotos

Los proveedores remotos son opcionales. La interfaz nunca recibe ni guarda la clave. Para usarlos en el companion local, define las variables de entorno en un archivo `.env` local que no se incluye en el ZIP:

```bash
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GOOGLE_AI_API_KEY=...
OPENROUTER_API_KEY=...
APP_ORIGIN=http://localhost:3000
COMPANION_HOST=127.0.0.1
COMPANION_PORT=8788
```

También puedes configurar los secretos en el servidor gestionado mediante su panel de secretos. Los cuatro proveedores se mantienen separados: puedes utilizar uno solo, combinarlos o no configurar ninguno.

| Proveedor | Variable | Modelo inicial | Ruta |
|---|---|---|---|
| OpenAI | `OPENAI_API_KEY` | `gpt-4o-mini` | Chat Completions |
| Anthropic | `ANTHROPIC_API_KEY` | `claude-3-5-haiku-latest` | Messages API |
| Google AI Studio/Gemini | `GOOGLE_AI_API_KEY` | `gemini-2.0-flash` | `generateContent` |
| OpenRouter | `OPENROUTER_API_KEY` | `openai/gpt-4o-mini` | Chat Completions compatible |

Añadir una API aporta acceso a modelos remotos de mayor capacidad o velocidad, pero no es obligatorio para el modo local. Las claves pueden tener coste, límites y políticas de privacidad propias del proveedor.

## Seguridad

Los endpoints personalizados solo se aceptan para `localhost`, `127.0.0.1` o `::1`. Los dominios remotos están fijados por proveedor para evitar que una petición del navegador convierta el servidor en un proxy SSRF. El companion no tiene una ruta genérica para ejecutar comandos del sistema y no acepta instrucciones de shell desde Internet. Los secretos no se guardan en `localStorage`, no se empaquetan en el ZIP y no aparecen en el catálogo de estados.

OpenClaw y Odysseus siguen siendo servicios independientes. El Centro de Mando ofrece sus enlaces y comandos, pero no arranca daemons ni administra cuentas externas de forma automática. Para OpenClaw, usa allowlists de origen, autenticación y pairing; para Odysseus, cambia las credenciales desde la propia aplicación y nunca las pongas en el frontend.

## Verificación y diagnóstico

Usa estas comprobaciones cuando algo no responda:

```bash
curl http://127.0.0.1:8788/healthz
curl http://127.0.0.1:8788/v1/providers
pnpm check
pnpm test
pnpm check:companion
pnpm build
```

`Comprobación local pendiente` significa que el Centro de Mando está vivo, pero todavía no ha confirmado que el runtime local exista. `Clave pendiente` significa que el proveedor remoto no tiene credencial disponible en el servidor. Ninguno de esos estados representa una respuesta de IA.

## Distribución

Genera el ZIP limpio con:

```bash
pnpm package:zip
```

El archivo aparece en `../ai-command-center-delivery/`. El empaquetador excluye dependencias, builds, logs, `.git` y cualquier archivo `.env`. Incluye el código fuente, las pruebas, la configuración de ejemplo, el companion y este manual.

## Límites conocidos

El modelo local debe instalarse aparte porque depende del sistema operativo y del hardware. Las API remotas pueden tener límites, coste o cambios de disponibilidad propios del proveedor. El paquete no promete que una clave sea válida ni que un modelo concreto esté descargado; comprueba cada estado en tiempo de ejecución.
