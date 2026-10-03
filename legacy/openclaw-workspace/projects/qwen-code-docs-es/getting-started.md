# Guía de inicio rápido

👏 **¡Bienvenido a Qwen Code!**

Esta guía te llevará de cero a productivo en pocos minutos. Al terminar, sabrás usar Qwen Code para las tareas de desarrollo más comunes.

## Antes de empezar

Asegúrate de tener:

- Una terminal o símbolo del sistema abierto
- Un proyecto de código con el que trabajar
- Una API key de Alibaba Cloud ModelStudio ([Beijing](https://bailian.console.aliyun.com/) / [intl](https://modelstudio.console.alibabacloud.com/)), o una suscripción a Coding Plan / Token Plan

## Paso 1: Instala Qwen Code

### Instalación rápida (recomendada)

**Linux / macOS**

```bash
curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.sh | bash
```

**Windows**

```powershell
irm https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.ps1 | iex
```

> 💡 Se recomienda reiniciar la terminal después de la instalación para asegurar que las variables de entorno surtan efecto.

**Instalación sin conexión**: descarga el archivo de una release y ejecuta el instalador con `--archive PATH`. Mantén `SHA256SUMS` junto al archivo para verificar la integridad.

### Instalación manual

**Requisito previo**: Node.js 22 o superior ([descárgalo en nodejs.org](https://nodejs.org/en/download)).

```bash
npm install -g @qwen-code/qwen-code@latest
```

**Homebrew (macOS, Linux)**

```bash
brew install qwen-code
```

## Paso 2: Configura la autenticación

Cuando inicias una sesión interactiva con `qwen`, se te pedirá configurar la autenticación:

```bash
# En el primer uso se te pedirá configurar la autenticación
qwen

# O ejecuta /auth en cualquier momento para cambiar el método
/auth
```

El menú del primer arranque te permite conectar un proveedor de modelos:

| Opción | Para quién | Detalles |
|---|---|---|
| **Alibaba ModelStudio → Coding Plan** | Desarrolladores individuales | Cuota semanal incluida, múltiples modelos |
| **Alibaba ModelStudio → Token Plan** | Equipos y empresas | Facturación por uso con endpoint dedicado |
| **Alibaba ModelStudio → Standard API Key** | Quien ya tiene una key de ModelStudio | Conexión directa con API key existente |
| **Third-party Providers** | Usuarios de otros proveedores | DeepSeek, Grok, MiniMax, Z.AI, Kimi, Idealab, ModelScope, OpenRouter, Requesty… |
| **Custom Provider** | Infraestructura propia | Servidor local, proxy o proveedor no soportado |

> ⚠️ **Qwen OAuth fue descontinuado el 15 de abril de 2026.** Si lo usabas, cambia a uno de los métodos anteriores.

> 💡 Cuando autenticas Qwen Code por primera vez con tu cuenta de Qwen, se crea automáticamente un workspace llamado `.qwen`. Este workspace proporciona seguimiento y gestión centralizados de costes para todo el uso de Qwen Code en tu organización.

Comprueba tu configuración en cualquier momento con:

```text
/doctor
```

Consulta [model-providers.md](model-providers.md) para la guía completa de proveedores.

## Paso 3: Inicia tu primera sesión

```bash
cd /ruta/a/tu/proyecto
qwen
```

Verás la pantalla de bienvenida con la información de tu sesión, conversaciones recientes y últimas novedades. Escribe `/help` para ver los comandos disponibles.

## Chatea con Qwen Code

### Haz tu primera pregunta

Qwen Code analiza tus archivos y te da un resumen. También puedes hacer preguntas más concretas:

```text
explain the folder structure
```

Y preguntar por sus propias capacidades:

```text
what can Qwen Code do?
```

> 💡 Qwen Code lee tus archivos según los necesita: no tienes que añadir contexto manualmente. Además conoce su propia documentación y puede responder preguntas sobre sus funciones.

### Haz tu primer cambio de código

```text
add a hello world function to the main file
```

Qwen Code hará esto:

1. Encuentra el archivo adecuado
2. Te muestra los cambios propuestos
3. **Pide tu aprobación**
4. Aplica la edición

> 🔒 Qwen Code siempre pide permiso antes de modificar archivos. Puedes aprobar cambios individuales o activar el modo «Accept all» para una sesión.

### Usa Git de forma conversacional

```text
what files have I changed?
commit my changes with a descriptive message
create a new branch called feature/quickstart
show me the last 5 commits
help me resolve merge conflicts
```

### Corrige un bug o añade una funcionalidad

Describe lo que quieres en lenguaje natural:

```text
add input validation to the user registration form
```

O arregla problemas existentes:

```text
there's a bug where users can submit empty forms - fix it
```

Qwen Code localiza el código relevante, entiende el contexto, implementa la solución y —si hay tests— los ejecuta.

### Otros flujos comunes

```text
# Refactorizar
refactor the authentication module to use async/await instead of callbacks

# Escribir tests
write unit tests for the calculator functions

# Actualizar documentación
update the README with installation instructions

# Revisión de código
review my changes and suggest improvements
```

> 💡 Qwen Code es tu pareja de programación con IA. Háblale como hablarías a un colega competente: describe lo que quieres conseguir y te ayudará a lograrlo.

## Comandos esenciales

| Comando | Qué hace | Ejemplo |
|---|---|---|
| `qwen` | Inicia Qwen Code | `qwen` |
| `/auth` | Cambia el método de autenticación (dentro de sesión) | `/auth` |
| `/doctor` | Comprueba autenticación y entorno actuales | `/doctor` |
| `/help` | Muestra ayuda de los comandos disponibles | `/help` o `/?` |
| `/model` | Cambia entre los modelos configurados | `/model` |
| `/compress` | Sustituye el historial del chat por un resumen para ahorrar tokens | `/compress` |
| `/clear` | Limpia la pantalla de la terminal | `/clear` (atajo: `Ctrl+L`) |
| `/theme` | Cambia el tema visual | `/theme` |
| `/language` | Ve o cambia la configuración de idioma | `/language` |
| `/language ui [idioma]` | Establece el idioma de la interfaz | `/language ui es-ES` |
| `/language output [idioma]` | Establece el idioma de respuesta del modelo | `/language output Spanish` |
| `/quit` | Sale de Qwen Code inmediatamente | `/quit` o `/exit` |

## Consejos pro para principiantes

**1. Sé específico en tus peticiones**

- ❌ «fix the bug»
- ✅ «fix the login bug where users see a blank screen after entering wrong credentials»

**2. Divide las tareas complejas en pasos**

```text
1. create a new database table for user profiles
2. create an API endpoint to get and update user profiles
3. build a webpage that allows users to see and edit their information
```

**3. Deja que Qwen Code explore primero**

Antes de hacer cambios, deja que entienda tu código:

```text
analyze the database schema
```

**4. Ahorra tiempo con atajos**

- Pulsa `?` para ver todos los atajos de teclado
- `Tab` para autocompletar comandos
- `↑` para el historial de comandos
- Escribe `/` para ver todos los slash commands

## Cómo conseguir ayuda

- **Dentro de Qwen Code**: escribe `/help` o pregunta «how do I…»
- **Documentación**: la oficial está en [qwenlm.github.io/qwen-code-docs](https://qwenlm.github.io/qwen-code-docs/)
- **Comunidad**: únete a las [GitHub Discussions](https://github.com/QwenLM/qwen-code/discussions) para consejos y soporte

## Ejemplo práctico completo: tu primera sesión de 5 minutos

```bash
# 1. Entra en un proyecto real
cd ~/proyectos/mi-api-rest

# 2. Arranca Qwen Code
qwen
```

Dentro de la sesión:

```text
> what does this project do?                     # entiende el proyecto
> are there any obvious issues or code smells?   # pide una revisión rápida
> add a health check endpoint at /healthz        # un cambio real
> run the tests                                  # verifica
> commit my changes with a descriptive message   # guarda el trabajo
```

¡Enhorabuena! Ya estás trabajando con Qwen Code. Continúa con [configuration.md](configuration.md) para personalizar tu experiencia.
