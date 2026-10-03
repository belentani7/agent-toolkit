# 005 — Fix: validación temprana de `device` en `pipeline()`

- **Repo:** huggingface/transformers
- **Tipo:** Fix de bug simple (fail-fast)
- **Issue:** https://github.com/huggingface/transformers/issues/47869
- **Base:** commit `e2b35502af756b9ad0f50ff667ffcccfac2d6293` (main)

## Análisis del problema

Si se pasa un `device` inválido a `pipeline()` (p. ej. `device="mpx"` en lugar de
`"mps"`), la función **descarga y carga los pesos completos del modelo en RAM**
antes de fallar en la colocación de tensores. La validación solo ocurre tarde,
dentro de `Pipeline.__init__` (`src/transformers/pipelines/base.py`), tras el
`from_pretrained`.

## Solución propuesta

Añadir un helper `_validate_pipeline_device(device)` en
`src/transformers/pipelines/__init__.py` que valida el argumento **antes** de
cualquier descarga/carga:

- `None`, `int` (incluido `-1`) y `torch.device` → siempre válidos.
- `str` → se intenta `torch.device(device)`; si falla, `ValueError` con mensaje
  que enumera los dispositivos válidos.
- Cualquier otro tipo → `ValueError`.

La llamada se hace al inicio del cuerpo de `pipeline()`, justo antes de tocar
el Hub. Guardada tras `is_torch_available()` para coherencia con el import
condicional de `torch` en el módulo.

## Código de la contribución

`patch.diff` modifica:
- `src/transformers/pipelines/__init__.py` (+38): helper + llamada en `pipeline()`.

## Tests

Nueva clase `PipelineDeviceValidationTest` en
`tests/pipelines/test_pipelines_common.py` con 3 casos:
1. `device="mpx"` lanza `ValueError` antes de descargar.
2. Valores válidos (`None`, `0`, `-1`, `"cpu"`, `"cuda:0"`, `torch.device`) pasan.
3. Tipo inválido (lista) lanza `ValueError`.

Ejecución: `python -m pytest tests/pipelines/test_pipelines_common.py::PipelineDeviceValidationTest`

## Documentación actualizada

No requiere cambios: la docstring del parámetro `device` ya describe los valores aceptados.
