# 004 — Fix: `ask_user_question` oculta la razón real de cancelación

- **Repo:** QwenLM/qwen-code
- **Tipo:** Fix de bug simple
- **Issue:** https://github.com/QwenLM/qwen-code/issues/9011 (label `welcome-pr`)
- **Base:** commit `3a0c4c61081bc8e956f531404a20e6d232048832` (main)

## Análisis del problema

Cuando el pipeline de permisos cancela automáticamente el diálogo de
`ask_user_question` (sin superficie de aprobación interactiva, denegado por
política, timeout…), el motivo de cancelación se **descarta**: el
`ToolConfirmationOutcome.Cancel` llega a `onConfirm` con un
`payload.cancelMessage` explicativo, pero
`packages/core/src/tools/askUserQuestion.ts` solo pone `wasAnswered = false` y
luego `execute()` devuelve el fallback genérico
`"User declined to answer the questions."`.

Resultado: ni el usuario ni el agente saben por qué no se preguntó; una falla de
infraestructura se reporta como si fuera una decisión consciente del usuario.

## Solución propuesta

- Capturar `payload?.cancelMessage` en el handler `Cancel` (nuevo campo
  `cancelReason` en la invocación).
- En `execute()`, si existe `cancelReason`, reportar
  `The question could not be answered: <razón>` en lugar del mensaje de
  "declined". El mensaje de declined queda reservado para cancelaciones reales
  del usuario.

## Código de la contribución

`patch.diff` modifica:
- `packages/core/src/tools/askUserQuestion.ts` (+13/−1)

## Tests

Nuevo caso en `packages/core/src/tools/askUserQuestion.test.ts`:
`should surface the pipeline cancellation reason instead of a false decline`
(simula `onConfirm(Cancel, { cancelMessage: 'requires an explicit interactive approval surface' })`
y verifica el mensaje devuelto). El caso existente
`should return cancellation message when user declines` sigue pasando.

Ejecución: `npm run test -- packages/core/src/tools/askUserQuestion.test.ts`
(workspace `@qwen-code/qwen-core`).

## Documentación actualizada

No requiere cambios de documentación: el comportamiento observable en el caso
"decline real" no cambia.
