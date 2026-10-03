# Belentani

Belentani es una herramienta de ingeniería **local y determinista**. Su núcleo actual no usa modelos de IA, claves API, proveedores cloud ni solicitudes HTTP. En vez de prometer razonamiento autónomo, ofrece capacidades concretas y comprobables: inspeccionar un workspace local, clasificar riesgo de comandos, ejecutar comandos permitidos con aprobación y guardar evidencia en un registro local.

## Estado real de capacidades

| Capacidad | Estado | Evidencia |
|---|---|---|
| Inspección real de un directorio | **VERIFIED** | `pnpm inspect -- --workspace RUTA` |
| Lectura de archivos con permiso explícito en navegador compatible | **VERIFIED** | Botón “abrir carpeta” y File System Access API |
| Clasificación determinista de comandos | **VERIFIED** | `pnpm policy -- "git status"` |
| Ejecución local protegida y registro JSONL | **VERIFIED** | `node bin/belentani.mjs run -- -- "git status"` |
| Aprobación para comandos no seguros | **VERIFIED** | `--approve` es obligatorio en nivel `CAUTION` |
| Bloqueo de red y comandos destructivos | **VERIFIED** | Pruebas unitarias y política del núcleo |
| Edición autónoma semántica de código | **NOT_IMPLEMENTED** | No existe modelo ni motor semántico, y no se simula |
| Navegación/research web | **NOT_IMPLEMENTED** | No se hace acceso web implícito |
| Integración de modelos | **NOT_IMPLEMENTED** | Excluida intencionalmente por el requisito sin modelos |

## Inicio local

Se necesita Node.js 18 o posterior. Después de instalar las dependencias de desarrollo del repositorio, utiliza el comando correspondiente a tu sistema:

| Sistema | Comando |
|---|---|
| Linux/macOS | `./start.sh /ruta/al/workspace` |
| Windows PowerShell | `.\start.ps1 -Workspace C:\ruta\al\workspace` |
| Cualquier sistema | `node bin/belentani.mjs doctor --workspace RUTA` |

## CLI local

`doctor` comprueba Node.js, Git, el directorio elegido y el estado local. `inspect` genera un inventario del proyecto sin recorrer `node_modules`, `.git`, `dist` ni cachés. `policy` explica el nivel de riesgo antes de ejecutar. `run` ejecuta en el directorio seleccionado y escribe un evento en `.belentani/audit.jsonl`.

```bash
pnpm doctor -- --workspace /ruta/proyecto
pnpm inspect -- --workspace /ruta/proyecto
pnpm policy -- "git status"
node bin/belentani.mjs run --workspace /ruta/proyecto -- "git status"
node bin/belentani.mjs run --workspace /ruta/proyecto --approve -- "mkdir reports"
```

La política bloquea comandos destructivos, privilegios elevados, URLs y utilidades de descarga. Las operaciones de paquete necesitan, además de `--approve`, el permiso explícito `--network`. Nunca hay un fallback silencioso a servicios de pago o IA remota.

## Verificación

Ejecuta `pnpm test` para las pruebas del core y `pnpm test:ui` para la política usada por la interfaz. `pnpm check` valida TypeScript y `pnpm build` genera el frontend de producción. El documento [AUDIT.md](./AUDIT.md) conserva las pruebas y los límites revisados.

## Límite intencional

Una web estática no puede ejecutar el sistema operativo desde el navegador de forma segura. Por ello, la UI solo lee una carpeta que el usuario seleccione explícitamente y siempre en modo lectura. La ejecución de terminal ocurre únicamente mediante la CLI local, dentro del workspace solicitado y bajo una política verificable.
