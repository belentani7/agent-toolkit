# PR: docs: translate gradient accumulation guide to Spanish

## What does this PR do?

Translates the "Gradient accumulation" training guide
(`docs/source/en/grad_accumulation.md`) into Spanish as
`docs/source/es/grad_accumulation.md`, and registers it in the Spanish
documentation toctree under "Rendimiento y escalabilidad".

## Why?

The Spanish documentation covers only ~45 of the ~744 English pages. Training
guides are a high-traffic entry point for new users, and gradient accumulation
is one of the most common memory-optimization techniques.

## Details

- Faithful translation following existing ES-doc conventions (informal "tú",
  English technical terms preserved on first use).
- Code blocks and argument names kept identical to the English source.
- Cross-links point at pages already available in Spanish where possible
  (e.g. `./model_memory_anatomy`).

Part of a 3-PR series translating performance/inference guides (gradient
accumulation, caching, assisted decoding).

## Tests

Manual structural review against the English source; no code changes.
