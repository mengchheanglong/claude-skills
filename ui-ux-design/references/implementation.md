# Implementing a redesign safely

## Contents
1. Phase order
2. Tokenizing an existing codebase
3. Pitfalls found in practice
4. Guard test
5. Before/after screenshots
6. Per-PR checklist

## 1. Phase order

Make each phase its own PR, cut from the main branch:

1. **Colour tokens.** Components stop hard-coding colours. Nothing should look different except deliberate
   consolidation.
2. **Theme switching.** System/Light/Dark preference applied before first paint; light behind a flag.
3. **Type and shape primitives.** Button, chip, label, tab and input components.
4. **Navigation.** Places in the sidebar, tools in the header, one mobile bar, label changes with URLs kept.
5. **Screens, one area at a time.** Then turn light mode on after a full contrast pass.

## 2. Tokenizing an existing codebase

1. Inventory literals by kind: hex, `rgb()`/`rgba()`, `hsl()`, Tailwind palette classes (`text-white`,
   `bg-red-500/10`), and literals inside CSS-in-JS strings. Count by file and by value.
2. Decide exemptions with written reasons:
   - editorial or cover-art palettes;
   - the root error page that renders without the stylesheet;
   - identity artwork;
   - files another branch is deleting.
3. Add tokens with today's values first, so the refactor is visually neutral.
4. Map each literal to the nearest token **in the same family** (neutral by luminance; white overlay, black shade,
   accent, danger, success, warning by alpha bucket). Do it with a dry-run script, review the grouped mapping, then
   apply.
5. Map Tailwind palette classes with opacity modifiers (`bg-[var(--scrim)]/75`) so alpha stays exact.

## 3. Pitfalls found in practice

Check each one after mapping:

- **Hover collapse.** A base colour and its hover colour (or two near greys) map to the same token, so hover does
  nothing. Detect it with a script: for every state variant (`hover:`, `focus:`, `:hover {}`) compare old versus new
  equality. Restore it with a different token or `hover:opacity-90`.
- **On-accent text.** `text-white` on a blue or red fill must become `--accent-ink`, not `--text`. Decide by
  context (the fill class on the same element), and check CSS rule blocks as well as class strings.
- **Media text.** White text over images must become `--on-media`.
- **Scoped variables.** `var(--bg-card, #14181d)` inside a component's own scoped palette: keep the local name
  (`var(--bg-card, var(--surface))`). Replacing it outright silently drops the override.
- **Framework theme variables.** Values such as `var(--color-red-600, …)` are defined by the CSS framework, not
  your stylesheet. Treat them as real colours when mapping.
- **Hex concatenation.** Code like `` `${accent}40` `` appends an alpha to a hex string and breaks if the value
  becomes `var(...)`. Search for it before converting maps of colours.
- **Contrast regressions.** Merging a dark red fill into a light danger token makes white text fail. Give fills
  their own token.
- **Undefined tokens.** While auditing, list every `var(--name)` that isn't defined anywhere. Fix it separately,
  not inside the refactor.

## 4. Guard test

Add a unit test that scans the source tree and fails on:
- any literal colour outside the token definitions;
- any palette colour class;
- an exemption that no longer needs exempting.

Each exemption carries its reason in the test. Also assert that every strength token a component references is
defined. This keeps the codebase themable after you leave.

## 5. Before/after screenshots

Run `scripts/visual_diff.mjs`:
- **Before:** a server on the main branch.
- **After:** a server on your branch.
- **Pages:** the routes you pass.

It warms each page on both servers, so cold compiles aren't mistaken for differences. It freezes animation,
captures desktop and phone, and writes before, after and diff images plus `results.jsonl`.

- **Expect:** most pages under 0.5% changed. Explain every page above that individually, by cropping before and
  after side by side.
- **Resumable:** it skips pages that already have a diff, so a 10-minute command limit can be beaten with repeated
  runs.
- **Don't wait for network idle.** Pages with live connections never reach it; the script loads, then waits up
  to 10s.
- **Windows:** long URL slugs can exceed the path limit; the script truncates names.

## 6. Per-PR checklist

- Typecheck, build and the full test suite pass. If the project's tests use a derived database, confirm which
  host and database it is before running, and never print connection strings. Redact any URL before echoing it.
- Screenshots compared and every visible difference explained.
- Design-system doc sections for this phase updated.
- Commit message lists deliberate visual changes, exemptions and anything not verified.
- Open the PR; leave merging to the maintainer.
