# PR: fix(tools): report the real cancel reason in ask_user_question

Fixes #9011

## What's the problem?

`ask_user_question` silently returned `User declined to answer the questions.`
even when the question was **never shown** to the user. The confirmation
pipeline cancels the dialog with a reason (`payload.cancelMessage`, e.g.
"requires an explicit interactive approval surface"), but the tool discarded
it and fell back to a generic message that looks like a user decision.

## The fix

- `AskUserQuestionToolInvocation` now stores `payload?.cancelMessage` when the
  outcome is `Cancel`.
- `execute()` reports `The question could not be answered: <reason>` when a
  pipeline cancel reason exists; `User declined to answer the questions.` is
  reserved for real user declines.

## Testing

Added `should surface the pipeline cancellation reason instead of a false
decline` in `askUserQuestion.test.ts`; the existing decline test is unchanged
and still passes.

## Backward compatibility

- Real declines: identical message as before.
- Auto-cancels: more accurate message (previously misleading).
