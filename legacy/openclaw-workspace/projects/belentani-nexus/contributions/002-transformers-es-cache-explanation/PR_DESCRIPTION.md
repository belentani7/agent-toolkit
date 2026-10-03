# PR: docs: translate caching guide to Spanish

## What does this PR do?

Translates the "How caching works" conceptual guide (`docs/source/en/cache_explanation.md`)
into Spanish as `docs/source/es/cache_explanation.md`, and registers it in the Spanish
documentation toctree under "Rendimiento y escalabilidad".

## Why?

The Spanish documentation currently covers ~45 of the ~744 English pages. This guide is one
of the most-referenced conceptual docs for inference (KV caches) and has no Spanish version.

## Details

- Prose translated to Spanish following existing ES-doc conventions (informal "tú",
  technical terms kept with their English original on first use).
- LaTeX formulas, code blocks, and admonitions are preserved verbatim.
- Internal links kept relative so they resolve within `docs/source/es/`.

Part of a 3-PR series translating performance/inference guides (gradient accumulation,
caching, assisted decoding).

## Tests

Manual structural review against the English source; no code changes.
