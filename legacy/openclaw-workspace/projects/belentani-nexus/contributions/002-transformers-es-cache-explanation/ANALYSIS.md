# 002 — Traducción al español: `cache_explanation.md`

- **Repo:** huggingface/transformers
- **Tipo:** Traducción de documentación (ES) — 2 de 3
- **Base:** commit `e2b35502af756b9ad0f50ff667ffcccfac2d6293` (main)

## Análisis del problema

La guía "How caching works" explica las matrices de atención, la clase `Cache` y las
implementaciones de almacenamiento (`DynamicLayer`, `StaticLayer`,
`StaticSlidingWindowLayer`) con fórmulas LaTeX y un ejemplo completo de bucle de
generación con `DynamicCache`. Es una de las guías conceptuales más enlazadas de la
sección de inferencia y no tiene versión en español.

## Solución propuesta

1. Traducción completa de `docs/source/en/cache_explanation.md` a
   `docs/source/es/cache_explanation.md`:
   - Fórmulas LaTeX y código sin modificar.
   - Términos técnicos habituales en español con el original entre paréntesis la
     primera vez (*key-value* → "pares clave-valor (KV)", *query/key/value* →
     "consulta (`Q`, *query*), clave (`K`, *key*) y valor (`V`, *value*)").
   - Admoniciones `> [!WARNING]` conservadas con su semántica.
2. Entrada en `docs/source/es/_toctree.yml` (sección "Rendimiento y escalabilidad")
   con título "Cómo funciona el almacenamiento en caché".

## Tests

- Comparación estructural 1:1 de secciones, bloques de código y fórmulas respecto a EN.
- Los snippets Python del ejemplo se mantienen literalmente idénticos al original.

## Documentación actualizada

El propio parche es la actualización de documentación (fichero nuevo + toctree).

## Nota de aplicación

Aplicar después de 001 (el diff del toctree es relativo al estado posterior a 001).
