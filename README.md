# Claude skills

Personal skills for Claude Code and Claude.

| Skill | What it does |
|---|---|
| [`ui-ux-design`](ui-ux-design/SKILL.md) | Runs a UI/UX redesign in phases: audit the real product, agree on principles with sources, fix the information architecture, prototype in grayscale, set a visual language (tokens, type, light and dark themes), record decisions, then implement in small verified steps. It comes with a wireframe template, a wireframe checker, a contrast calculator and a before/after screenshot comparison. |

## Install

Copy a skill folder into your personal skills directory:

```bash
cp -r ui-ux-design ~/.claude/skills/
```

On Windows that's `C:\Users\<you>\.claude\skills\`. Claude picks the skill up in new sessions, and uses it
automatically when a request matches its description, for example "the UI looks confusing" or "make wireframes".

## Contents of `ui-ux-design`

```
ui-ux-design/
├── SKILL.md                     the process, phase by phase
├── references/
│   ├── principles.md            Mandel's golden rules, design thinking, Nielsen, Gestalt, laws, WCAG
│   ├── reference-sites.md       how to learn from reference products without copying them
│   ├── visual-system.md         token architecture, type, shape, themes, contrast pitfalls
│   └── implementation.md        tokenizing a codebase, guard tests, before/after screenshots
├── assets/wireframe-template.html
└── scripts/
    ├── check_wireframes.js      renders every wireframe screen; checks links and note markers
    ├── contrast.py              WCAG contrast ratios
    └── visual_diff.mjs          before/after screenshot comparison (Playwright + sharp)
```
