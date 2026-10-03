# deepseek-fix-verify

Arnes de verificacion de arreglos: cada correccion se acompana de su diagnostico y su recibo.

## Que es

Un flujo de trabajo en Python para no dar por bueno un arreglo sin prueba. La idea es simple:
**una tarea entra, un diagnostico sale, y un recibo lo cierra.** Nada se marca como resuelto
sin evidencia adjunta.

## Flujo

```
00_SYSTEM_PROMPT.md         Reglas del sistema
01_TASKS.json               Tareas a resolver
02_DIAGNOSIS_TEMPLATE.json  Plantilla de diagnostico
03_RECEIPT_TEMPLATE.md      Plantilla de recibo
```

1. Se declara la tarea en `01_TASKS.json`.
2. Se rellena el diagnostico con `02_DIAGNOSIS_TEMPLATE.json`.
3. El arreglo se cierra con un recibo de `03_RECEIPT_TEMPLATE.md`.

## Documentacion

- `ARCHITECTURE.md` - arquitectura
- `PROJECT_MAP.md` - mapa del proyecto
- `DECISIONS.md` - registro de decisiones
- `DEEPSEEK-V4-PRO-FIX-VERIFY-PLAN.md` - plan de trabajo

## Licencia

Sin licencia declarada.
