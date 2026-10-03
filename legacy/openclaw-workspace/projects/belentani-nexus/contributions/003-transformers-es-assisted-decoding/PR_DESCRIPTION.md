# PR: docs: translate assisted decoding guide to Spanish

## What does this PR do?

Translates the "Assisted decoding" inference guide
(`docs/source/en/assisted_decoding.md`) into Spanish as
`docs/source/es/assisted_decoding.md`, and registers it in the Spanish
documentation toctree.

## Why?

Inference-optimization guides are some of the most-requested translations.
This guide covers five acceleration techniques with runnable examples and has
no Spanish version.

## Details

- Faithful translation following existing ES-doc conventions.
- `<hfoptions>`/`<hfoption>` structure preserved; option ids unchanged, only
  tab titles translated.
- All Python snippets and model identifiers kept byte-identical.

Final PR of a 3-PR series translating performance/inference guides (gradient
accumulation, caching, assisted decoding).

## Tests

Manual structural review against the English source; no code changes.
