# Auditoría máxima de Belentani v0.3

## Resultado ejecutivo

Belentani ya no es una interfaz con datos fijos de proyecto. El repositorio contiene un núcleo local de Node.js que inspecciona directorios reales, lee, escribe y busca archivos dentro de un workspace acotado, ejecuta comandos sin `shell`, exige aprobación cuando corresponde, bloquea patrones destructivos o de red y conserva evidencia JSONL dentro del propio proyecto. La interfaz web solicita el permiso del navegador para abrir una carpeta en modo de solo lectura y distingue con claridad `VERIFIED`, `PARTIAL`, `FAILED` y `NOT_IMPLEMENTED`.

| Control | Resultado | Evidencia |
|---|---:|---|
| API keys obligatorias | **0** | Escaneo de frontend, core, CLI y configuración de build |
| Proveedores o modelos IA obligatorios | **0** | Ningún SDK, adapter, endpoint ni configuración de modelo implementados |
| Solicitudes HTTP intencionales del producto | **0** | Se retiraron proxy de storage, telemetría, fuentes y assets remotos |
| Workspace real acotado | **VERIFIED** | `resolveWorkspace`, guardia de rutas y pruebas de escape |
| Lectura, escritura y búsqueda local | **VERIFIED** | Core y CLI con tests de integración sobre directorios temporales |
| Terminal controlada | **VERIFIED** | `spawn(..., { shell: false })`, timeout, salida limitada y log JSONL |
| Comandos destructivos o red implícita | **BLOCKED** | Reglas y pruebas para `rm`, URLs, `curl`, metacaracteres y flags de redirección |
| Aprobación humana | **VERIFIED** | Escritura y órdenes `CAUTION` fallan sin `--approve` |
| Pruebas core | **8/8 PASAN** | `pnpm test` |
| Pruebas de política UI | **4/4 PASAN** | `pnpm test:ui` |
| TypeScript y bundle de producción | **PASAN** | `pnpm check` y `pnpm build` |
| UI escritorio y móvil | **VERIFICADA** | Capturas de la vista sin workspace y responsive corregido |

## Hallazgos corregidos

La auditoría descubrió y corrigió una pérdida de argumentos en el subcomando `policy`, una parada del analizador ante directorios sin permiso, una ejecución de terminal mediante shell y una composición móvil que abría el explorador sobre el editor. También se retiraron el proxy remoto de desarrollo, la telemetría, la dependencia `axios`, el adaptador de mapas y todos los recursos remotos usados por la interfaz.

## Límites honestos

La ausencia de modelos de IA es una decisión de producto solicitada, no un fallo. Por ello Belentani no pretende entender lenguaje natural, generar cambios de código autónomos, investigar en la web ni operar un navegador: todas esas capacidades aparecen como **NOT_IMPLEMENTED**, no como simulaciones. El core sí ejecuta las herramientas deterministas disponibles y registra su resultado. La web no ejecuta comandos: la ejecución real está exclusivamente en la CLI local para evitar que el navegador adquiera privilegios del sistema.

## Riesgos residuales

La allowlist y las expresiones de política son deliberadamente conservadoras y deben evolucionar antes de permitir familias amplias de herramientas. La CLI está validada en Linux; los scripts de inicio se proporcionan para Windows y macOS, pero requieren prueba en esos sistemas. El bundle web continúa por encima de 500 KB comprimido por dependencias de interfaz; es una mejora de rendimiento pendiente, no una dependencia de seguridad, modelo o red.

## Reparación integral v0.3.1

La revisión posterior eliminó el desajuste de tema entre el contenedor y el componente de notificaciones, retiró componentes de plantilla sin uso y redujo el paquete a las tres dependencias de producción que usa la interfaz. Se sustituyeron las notificaciones de terceros por un aviso local, se eliminaron el servidor Express y el empaquetado de servidor, y se actualizaron Vite, Vitest, Tailwind y TypeScript. La auditoría de dependencias completa ahora no informa vulnerabilidades conocidas.

El ejecutor local registra ahora también los fallos de lanzamiento, limita el timeout al rango seguro y finaliza el grupo de proceso cuando el sistema lo permite. Las pruebas incluyen el timeout observable y un binario inexistente para prevenir regresiones. La pantalla inicial ya comunica preparación, permiso y autonomía local en vez de usar una etiqueta de debug; el monograma y las trazas cobre se reforzaron para que la identidad de Belentani sea reconocible y operativa.
