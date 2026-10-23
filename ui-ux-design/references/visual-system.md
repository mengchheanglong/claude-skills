# Visual system: tokens, type, shape, themes

## Contents
1. Token architecture
2. A worked palette (dark and light)
3. Type
4. Shape and depth
5. Components that carry meaning
6. Voice
7. Themes

## 1. Token architecture

Every colour a component uses is a token. The tokens are grouped by job, not by hue, so a theme can change values
without touching components.

| Group | Tokens | Notes |
|---|---|---|
| Canvas ladder | `--sunken`, `--bg`, `--bg-elev`, `--surface`, `--surface-2`, `--surface-3` | Small luminance steps; depth without shadows |
| Text | `--text`, `--muted`, `--dim` | Each passes 4.5:1 on every surface it sits on |
| On fills | `--accent-ink` | Text on accent or danger fills |
| Lines and washes | `--border`, `--border-strong`, `--tint-1…7` | Translucent text-coloured overlays; they flip with the theme |
| Shades | `--shade-1…5` | Shadows and backdrops |
| Accent | `--accent`, `--accent-bright`, `--strong`, `--accent-a04…a65` | Strengths via `color-mix(in srgb, var(--accent) 12%, transparent)` |
| Status | `--danger`, `--success`, `--warning` (+ `-aNN`), `--danger-fill` | Only where status is real (forms, staff tools) |
| Media | `--on-media`, `--scrim` | Fixed in every theme: text and scrims over photos and cover art |

Rules that keep this honest:
- Blue (or the brand accent) means "interactive or selected" and nothing else.
- A solid fill carrying white text needs its own deeper token. A light danger red is fine as text on dark, and
  fails as a button fill.
- Content over images uses the media tokens, never `--text`. In light mode `--text` becomes dark and would vanish
  on a photo.

## 2. A worked palette

Neutral near-black dark theme and white light theme. Every text pair was checked by computed ratio.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#0A0A0B` | `#FFFFFF` |
| `--surface` | `#111113` | `#FAFAFA` |
| `--surface-2` | `#17171A` | `#F4F4F5` |
| `--line` / `--line-2` | white 8% / 14% | black 8% / 14% |
| `--text` | `#EDEDEF` | `#18181B` |
| `--text-2` | `#A1A1AA` | `#52525B` |
| `--text-3` | `#808089` | `#6B6B74` |
| `--accent` | `#3F8CFF` | `#1B62D6` (`#3F8CFF` is only 3.3:1 on white) |

**Pitfalls the ratios caught:**
- `#71717A` metadata grey is 4.09:1 on near-black, which fails AA.
- White text on `#3F8CFF` is 3.28:1, which fails as normal text.

Check every pair with `python scripts/contrast.py FG BG`.

## 3. Type

- One interface family. Inter is a solid default: legible small, has tabular figures. Keep any wordmark face for
  the wordmark only.
- Scale with few steps: **12 / 13 / 15 / 17 / 20 / 28 / 48**. Body 15px. Weights 400–700.
- Primary text is about 30% larger than secondary, so hierarchy reads at a glance.
- Use sentence case everywhere. Tracked uppercase micro-labels read as internal jargon.
- Load fonts self-hosted (for example `next/font`), never from a third-party server at runtime.

## 4. Shape and depth

- **By function, not by page:**
  - pills for buttons, chips, tabs and search;
  - 12–16px corners for cards and panels;
  - 8px for inputs;
  - square for feed rows and tables.
- **Depth:**
  - borders and surface steps in content;
  - soft shadows only on floating layers (menus, dialogs, toasts).
- A wall of 0px boxes with no depth reads as an unstyled wireframe. That's a common cause of "looks unprofessional".

## 5. Components that carry meaning

- **One label style:** a dot plus text. Encode kind by dot *shape* (filled, hollow, dashed), never by hue alone.
- **Claim and limit:** a two-column "What it shows | What it doesn't show" with equal visual weight. Machine or
  unverified content uses a dashed edge and softer wording ("What it reports", "Stated limitation").
- **One primary button per screen.** In a near-black UI, a white pill reads as more premium than a blue fill.
- **Empty states:** say why the screen is empty and that nothing is broken, with at most two actions. Never show
  "0 posts" as if it were content.

## 6. Voice

Replace internal vocabulary on reader-facing surfaces:

| Instead of | Say |
|---|---|
| "EPISTEMIC LIMITATION · WHAT THIS DOES NOT ESTABLISH" | "What it doesn't show" |
| "Core Pillars" | "Capabilities" |

Be plain, confident and slightly warm. Empty states invite.

## 7. Themes

- Build both themes from the same tokens. Default to the device (`prefers-color-scheme`); offer System, Light and
  Dark in settings and the profile menu.
- Apply the choice before first paint (an inline script reading a cookie or local preference), so the page never
  flashes the wrong theme.
- Ship dark first if it's what exists. Enable light only after every primary screen passes contrast and a visual
  check.
- Prerequisite: no literal colours in components (see `implementation.md`).
