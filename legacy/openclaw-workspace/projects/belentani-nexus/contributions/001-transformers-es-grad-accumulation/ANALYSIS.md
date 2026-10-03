# 001 — Traducción al español: `grad_accumulation.md`

- **Repo:** huggingface/transformers
- **Tipo:** Traducción de documentación (ES)
- **Issue asociado:** No hay issues "Good First Issue" abiertos; la sección ES de la docs solo cubre ~45 de las ~744 páginas EN. Aporta al objetivo de cobertura de idiomas del doc-builder.
- **Base:** commit `e2b35502af756b9ad0f50ff667ffcccfac2d6293` (main)

## Análisis del problema

`docs/source/es/` tiene solo 45 ficheros frente a 744 en `docs/source/en/`. La guía "Gradient accumulation" (EN) no existe en español. El toctree español (`docs/source/es/_toctree.yml`) no tiene sección de acumulación de gradientes.

## Solución propuesta

1. Traducción completa y fiel de `docs/source/en/grad_accumulation.md` a `docs/source/es/grad_accumulation.md`, conservando:
   - Bloque de licencia Apache-2.0 idéntico.
   - Todo el código sin traducir (nombres de argumentos, valores).
   - Enlaces internos a páginas que ya existen o existirán en ES (`./model_memory_anatomy` ya existe en ES).
2. Registro de la página en `docs/source/es/_toctree.yml` dentro de la sección "Rendimiento y escalabilidad", con título "Acumulación de gradientes".

## Pruebas

- Revisión de estilo consistente con otras guías ES existentes (uso de "tú", títulos en español, código en inglés).
- `python utils/check_repo.py` / build de docs local si se dispone de entorno.

## Nota de aplicación secuencial

Este patch (001) modifica `_toctree.yml` desde el estado HEAD. Los patches 002 y 003 continúan sobre el estado resultante (aplicar en orden 001 → 002 → 003).
