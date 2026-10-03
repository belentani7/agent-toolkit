# Acompañante de investigación local para Windows — requisitos iniciales

## Decisiones confirmadas

- Aplicación **local primero**: los datos permanecen cifrados en el equipo.
- Sincronización entre dispositivos: **desactivada por defecto**, opcional, cifrada y sujeta a aprobación explícita.
- No hay acciones autónomas ni actividad de red por defecto.
- Los microtests son estrictamente **matemáticos y simulados**: usan únicamente datos sintéticos y no operan sobre sistemas, servicios, dispositivos ni datos reales.
- Experiencia: widget persistente, discreto y no intrusivo en Windows.

## Patrón de producto observado en la referencia

La referencia estructura una experiencia privada y mínima mediante: una promesa principal clara; acción primaria única; módulos cortos que profundizan progresivamente; inventario simple de capacidades; y una sección de privacidad visible. Para el acompañante se adaptará sin copiar textos, marcas, imágenes ni activos.

## Adaptación propuesta

| Patrón de referencia | Adaptación para el acompañante |
|---|---|
| Promesa principal | «Investiga con calma. Prueba en pequeño. Decide con evidencia.» |
| Entrada rápida | Captura instantánea de una nota vinculada a un tema |
| Módulos de profundización | Hipótesis, simulación matemática, resultados y plan de escala |
| Vista de insights | Patrones, supuestos, métricas sintéticas y decisiones pendientes |
| Guías | Plantillas de investigación y tipos de experimentos matemáticos |
| Privacidad visible | Cifrado local, sin red por defecto, exportación controlada |

## Límites del prototipo

El prototipo no realizará búsquedas web automáticas, no ejecutará código de terceros, no interactuará con aplicaciones externas y no realizará acciones físicas o de alto impacto. El usuario inicia toda operación y confirma cualquier cambio futuro de configuración sensible.

## Pendiente antes de codificar

- Carpeta de trabajo vinculada en Manus Desktop.
- Temas iniciales (3–6), salvo que se usen proyectos sintéticos de ejemplo.
- Preferencia de tecnología de escritorio si existe; en ausencia de preferencia se escogerá una ruta que produzca un instalable de Windows y mantenga los datos locales.

## Referencia

- Reflection, página de inicio: https://www.reflection.app/

