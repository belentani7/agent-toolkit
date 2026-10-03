# 003 — Traducción al español: `assisted_decoding.md`

- **Repo:** huggingface/transformers
- **Tipo:** Traducción de documentación (ES) — 3 de 3
- **Base:** commit `e2b35502af756b9ad0f50ff667ffcccfac2d6293` (main)

## Análisis del problema

"Assisted decoding" cubre cinco técnicas de aceleración de inferencia (decodificación
especulativa, prompt lookup, autoespeculativa, MTP y UAD) más la verificación por
ensemble estático. No existe versión en español, pese a ser una guía clave para
optimización de latencia en producción.

## Solución propuesta

1. Traducción completa de `docs/source/en/assisted_decoding.md` a
   `docs/source/es/assisted_decoding.md`:
   - Bloques `<hfoptions>/<hfoption>` conservados; los `id` de las opciones sin
     cambiar y los títulos de las pestañas traducidos ("greedy search" →
     "búsqueda voraz", "sampling" → "muestreo").
   - Todos los snippets Python y los ids de modelos sin modificar.
   - Referencias a [`~GenerationMixin.generate`] y [`Pipeline`] mantenidas para el
     doc-builder.
2. Entrada en `docs/source/es/_toctree.yml` con título "Decodificación asistida".

## Tests

- Verificación de que cada bloque de código ES es byte-identico a su equivalente EN.
- Los ids `<hfoptions id=...>` no cambian (evita colisiones de anclas).

## Nota de aplicación

Aplicar después de 001 y 002 (el diff del toctree es relativo al estado posterior a 002).
