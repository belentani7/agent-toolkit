# PR: fix(scripts): README ToC generator misparses tilde and longer fences

References #41077

## Problem

`scripts/readme_toc.py` toggles `in_code` on any line starting with ```:

- headings inside `~~~` fences are treated as headings
- a literal ``` line can prematurely close a longer ```` fence
- a backtick opener whose info string contains a backtick is misparsed

## Fix

`generate_toc_lines()` now tracks the fence marker character and the opening
fence length. A fence only closes on a fence line using the same character,
consisting only of that character, and at least as long as the opener.

## Tests

New `scripts/test_readme_toc_fences.py` with regression tests covering all
three failure modes from the issue report, plus a check that ordinary ```
fences still work. All pass:

```
python scripts/test_readme_toc_fences.py
# all readme_toc fence tests passed
```

`python scripts/readme_toc.py README.md` remains a no-op for READMEs without
ToC markers.

## Note

Per `docs/contributing.md` this repo currently does not accept external code
PRs — sharing the fix here in case that changes; happy to paste the diff in
the issue thread instead.
