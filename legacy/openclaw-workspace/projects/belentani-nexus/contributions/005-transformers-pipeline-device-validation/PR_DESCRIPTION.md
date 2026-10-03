# PR: fix(pipelines): validate `device` before downloading model weights

Fixes #47869

## Problem

`pipeline("text-classification", model="...", device="mpx")` downloads and
loads the full model before failing at tensor placement. The device string is
only validated deep inside `Pipeline.__init__`, after `from_pretrained`.

## Fix

Added `_validate_pipeline_device()` in `src/transformers/pipelines/__init__.py`:

- `None`, `int` ordinals, and `torch.device` instances pass through.
- Strings are checked with `torch.device(device)`; invalid ones raise
  `ValueError` listing valid examples (`cpu`, `cuda`, `cuda:0`, `mps`, …).
- Other types raise `ValueError`.

Called at the top of `pipeline()`, before any Hub interaction, guarded by
`is_torch_available()` to match the module's conditional torch import.

## Tests

New `PipelineDeviceValidationTest` in `tests/pipelines/test_pipelines_common.py`:
- invalid string raises before download
- valid values (`None`, `0`, `-1`, `"cpu"`, `"cuda:0"`, `torch.device`) pass
- invalid type (`[0]`) raises
