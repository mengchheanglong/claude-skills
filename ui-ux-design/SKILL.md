---
name: ui-ux-design
description: >-
  Run a UI/UX redesign the way a careful product designer would: audit what exists, agree on sourced principles,
  fix the information architecture, prototype in grayscale, set a visual language (tokens, type, light and dark),
  record decisions, then implement in small verified steps. Use this skill whenever the user says the interface
  looks confusing, unprofessional, cluttered or dated; asks to redesign, refine, restyle or "make it look like"
  another product; wants wireframes, a prototype, a sitemap, navigation changes, a design system, design tokens,
  dark/light mode, or a UX audit; shares design course material or reference sites to learn from; or asks which of
  two layouts is better — even if they never say "UX".
---

# UI/UX design

This skill turns "the frontend feels wrong" into a sequence of small, reviewable decisions. Its core belief is
that most interfaces that feel unprofessional are **structurally** confusing first (names, grouping, too many
navigations, jargon) and **visually** inconsistent second (many tag styles, ad-hoc colours, no hierarchy). Fix the
structure before the paint, prototype before code, and verify every claim against the running product.

Work in the phases below. Each one ends with something the user can react to; move on only when they have. The
user is the decision-maker on taste and product direction — offer a recommendation with reasons, never a survey of
options you would not pick.

## Scale to the request

Not every request needs all eight phases. Match the effort to the scope:

| Request | Do |
|---|---|
| "Which is better, A or B?" | Answer directly. Recommend one, give 2–3 reasons tied to principles and to what the project already decided, and name what would change your mind. Offer to update the mockup. |
| Restyle or tidy one screen | Phase 1 for that screen only (what's wrong and why), Phase 5 limited to existing tokens, then implement with a before/after screenshot. |
| "It looks confusing / unprofessional" for a whole product | Every phase, in order. Structure first. |
| Build a design system or dark/light mode | Phases 0, 1 (colour and type inventory), 5 and 7. |
| User shares course slides or a book | Extract its principles into Phase 2 and say explicitly which ones you applied. |

When in doubt, do the smaller version and offer the larger one in one sentence.

Reference files (read when you reach the phase that needs them):

| File | Read it when |
|---|---|
| `references/principles.md` | Phase 2, and whenever you justify a choice |
| `references/reference-sites.md` | The user names a site to learn from, or Phase 5 |
| `references/visual-system.md` | Phase 5 (tokens, type, shape, themes, contrast) |
| `references/implementation.md` | Phase 7 (tokenizing colours, guard tests, before/after screenshots) |
| `assets/wireframe-template.html` | Phase 4 — copy it, don't start from scratch |
| `scripts/check_wireframes.js` | After every wireframe edit |
| `scripts/contrast.py` | Any time a colour pair is chosen or questioned |
| `scripts/visual_diff.mjs` | Phase 7, before and after a styling refactor |

## Phase 0 — Orient before opinions

Read what the project already decided: design-system docs, decision logs, specs, contributor rules. A redesign
that silently contradicts an earlier decision is a regression, even if it looks better. Note which rules are
load-bearing (legal naming, accessibility promises, "never fake activity", brand marks) and which are taste.

Ask the user, once, the questions only they can answer: what the product's core is (for example research-first or
community-first), whether existing design rules are open to change, and whether to prototype before code (the
answer should usually be yes).

## Phase 1 — Audit the real product

Inventory every screen a user can reach, then look at the important ones in a browser.

- **Routes are not screens.** Page files miss views selected by a query string (`?feed=signals`), tabs, modals and
  dialogs, signed-in versus guest variants, and staff-only screens. Search for `searchParams`, route-private
  components and overlay components, not just page files.
- **Read a page before classifying it.** Two pages with similar names may be different things (a research topic
  map and community post categories can both be called "topics"). Open the code or the page and check what it
  shows and why it exists (often a decision log entry) before calling anything a duplicate or leftover.
- **Find dead code** that no route renders and keep it out of the redesign; suggest removing it separately.
- Record a **problem register**: each problem with evidence (file, screenshot, quote) and the principle it breaks.
  Typical findings: internal jargon in navigation, several navigations for one product, duplicate concepts, stacked
  headers before content, many tag styles, facts buried in prose, dead ends.
- Say what you did not cover (signed-in screens without a test account, staff screens).

Deliverable: an audit document — route inventory by class (canonical, utility, auth, legal, staff, redirect),
problem register, and candidate design-system rules to reconsider.

## Phase 2 — Principles with sources

Pick 5–8 principles and trace each to a source: Mandel's golden rules, Nielsen's heuristics, Gestalt, Jakob's and
Hick's laws, WCAG, Shneiderman's mantra, plus the product's own non-negotiables (see `references/principles.md`).
Course slides or books the user provides come first — quote their structure back so the user sees it was used.

Stay independent. If another person or agent proposed principles, evaluate them on the merits: adopt what is
right, say where they over-reach (for example "hide technical details" must never hide scientific limitations;
"5–6 menu items" is a heuristic, not a law), and add what they missed (user control, accessibility, visual craft).

## Phase 3 — Information architecture

- Name destinations in the user's language; every label should be guessable without explanation. Rename labels,
  not URLs — keep URLs and redirects so nothing saved breaks.
- One navigation model across desktop and mobile. **Places** (destinations, your groups, installed tools) go in
  the sidebar; **tools** (search box, create, notifications, messages, profile) go in the header, and the header
  is the same on phone and desktop. Stable, short lists sit above lists that grow.
- Produce a sitemap mapping every current route to its new home, and 2–3 core user journeys.
- Mark uncertain groupings as hypotheses to test (card sort, tree test) rather than settling them by opinion.

## Phase 4 — Grayscale wireframes

Copy `assets/wireframe-template.html` and fill it in. Grayscale on purpose: the user judges structure and wording,
not colour.

- Cover **every** user-facing screen, including forms, account flows, empty/loading/error states, overlays
  (menus, dialogs, toasts) and staff templates. Start with a sitemap screen that maps every route to a screen;
  that table is how the user checks nothing was missed.
- Use **real content** where the product has it (actual records, names, counts from the database) and labelled
  gray placeholders everywhere else. Never invent activity, counts, quotes or data to make a mockup look full.
- Every screen gets numbered design notes tying choices to a problem number and a principle.
- Desktop and mobile in the same file.
- Run `node scripts/check_wireframes.js <file>` after each edit: every screen renders, every link resolves, every
  note marker has a note.

Expect several rounds. When the user questions a layout ("which is better?"), re-evaluate against everything
decided since — if your earlier recommendation no longer holds, say so and say why.

## Phase 5 — Visual direction

Only after the structure holds. Read `references/visual-system.md` and `references/reference-sites.md`.

- For each reference the user names, write what you take and what you reject, with reasons. Copy principles, not
  pixels (a playful marketing site's desktop metaphor rarely suits a daily-use product).
- Define the language as tokens: colour (both themes), type scale, shape, depth, components, voice. Show a
  "today vs proposed, and why" table.
- Light and dark from day one, default following the device. Compute contrast for every text pair with
  `scripts/contrast.py`; brand blues often fail as text on white and need a darker text variant.
- Build 3 high-fidelity screens with real content, desktop and mobile, with a theme switch.

## Phase 6 — Decide and record

Write the outcome where the project keeps decisions: a spec (principles, IA, visual language, themes, phased plan)
and one decision entry per settled question, including **rejected alternatives and why**. Put the wireframes and
mockups in the repository so other contributors can find them. Follow the project's branching and PR rules; never
merge on the user's behalf.

## Phase 7 — Implement in verified steps

Read `references/implementation.md`. Order matters: colour tokens first (themes are impossible while components
hard-code colours), then theme switching, then type and shape primitives, then navigation, then screens one area
at a time. Each step is its own PR with typecheck, build and tests, plus before/after screenshots
(`scripts/visual_diff.mjs`) whose differences you can explain one by one.

## Phase 8 — Validate with people

Usability tasks (5 concrete tasks, recorded as completion, hesitation, wrong turns, help needed) on the current
product and the new one. If no outside participants exist, run the tasks yourself and with the user, and say
plainly that insiders cannot reveal what confuses newcomers.

## Working style

- Discuss before building; build before polishing; verify before claiming.
- Show work as clickable artifacts (local HTML served from a folder, or a published page) and describe what to
  look at.
- Report what was not verified. If a browser screenshot is unavailable, inspect the DOM instead and say so.
- Own mistakes in the record (an audit entry that was wrong stays, corrected and marked).
