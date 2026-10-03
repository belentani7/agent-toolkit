# Auditoría estricta 10/10 y GitHub

- [x] Definir matriz de auditoría basada en evidencias.
- [x] Ejecutar comprobación TypeScript, Vitest y companion en la sandbox.
- [x] Evaluar dimensiones: Backend, Frontend, Utilidad, Relevancia, Potencial e Identidad (más seguridad, rendimiento, mantenibilidad y entrega).
- [x] Generar informe técnico detallado.
- [x] Preparar exportación a un repositorio nuevo de GitHub y solicitar confirmación.
- [x] Guardar checkpoint y entregar resultados.

## Brechas descubiertas en la auditoría estricta

- [x] Conectar el token Bearer del companion en la interfaz sin persistirlo.
- [x] Aplicar carga diferida del Model bridge para reducir el bundle inicial.
- [x] Repetir build y comprobar que la advertencia de chunk mejora o queda cuantificada.
- [x] Repetir pruebas de seguridad, UI y empaquetado tras las correcciones.

## Hallazgo crítico de auditoría

- [x] Resolver o documentar las 72 vulnerabilidades reportadas por `pnpm audit` (17 de severidad alta) antes de aprobar la exportación a GitHub.
- [x] Separar vulnerabilidades de producción de las transitorias de desarrollo y registrar el resultado reproducible.

## Regresión tras actualización de seguridad

- [x] Adaptar `client/src/components/ui/chart.tsx` a Recharts 3 o fijar una versión compatible con el template.
- [x] Repetir check, tests y build después de resolver la regresión.

## Riesgo residual de producción

- [x] Migrar Express 4 a Express 5 y actualizar sus tipos para eliminar path-to-regexp, qs y body-parser vulnerables.
- [x] Volver a ejecutar `pnpm audit --prod` y exigir cero avisos high/critical antes de aprobar la entrega.

## Validación y Entrega Final Pendiente
- [x] Ejecutar `pnpm package:zip` para generar el artefacto ZIP reproducible final con la versión auditada.
- [x] Documentar explícitamente la separación de vulnerabilidades de producción frente a desarrollo en el informe de auditoría.
- [x] Guardar checkpoint definitivo con `webdev_save_checkpoint`.
- [x] Informar al usuario y preparar el repositorio GitHub de `belentani7`.

## Ampliación del motor autónomo
- [x] Validar y restaurar el estado del engine tras la recuperación del entorno.
- [x] Incorporar concurrencia controlada, reintentos, deduplicación y aislamiento de errores por URL.
- [x] Persistir misiones, resultados, logs, costes y memoria de estrategias en artefactos estructurados.
- [x] Añadir exportación real de resultados a JSON y CSV desde la CLI.
- [x] Corregir el arranque de Express 5 y verificar la publicación reproducible.
- [ ] Guardar la versión verificada en GitHub y crear una copia de seguridad en Google Drive cuando la conexión esté disponible.
