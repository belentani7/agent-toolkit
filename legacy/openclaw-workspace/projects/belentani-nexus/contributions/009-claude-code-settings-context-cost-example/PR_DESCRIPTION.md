# PR: docs(examples): settings example for reclaiming per-request context cost

References #90065

## Problem

`examples/settings/` covers permission and sandbox posture, but nothing covers
a cost every request pays: eagerly-loaded built-in tool schemas.
`permissions.deny` on a built-in also keeps its schema out of context, but the
README gives no hint of that — an admin can reasonably assume denying a tool
only gates the call.

## Change

- New `examples/settings/settings-context-cost.json`: minimal example denying
  the `Workflow` built-in (the single largest opt-in tool schema).
- README: new column + "Remove unused tool schemas from request context" row in
  the comparison table.
- README: Tips bullet explaining that denying unused opt-in built-ins reclaims
  several thousand input tokens per request.

## Verification

- JSON parses; structure matches the three existing example files.
- Numbers align with the measurements reported in #90065
  (deny Workflow ≈ −7.9k input tokens; five opt-in denials ≈ −47%).
