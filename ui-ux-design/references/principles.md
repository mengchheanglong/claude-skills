# Principles and where they come from

Use these to justify choices. Cite the source next to the decision ("recognition over recall — Nielsen 6") so the
user can tell reasoning from taste.

## Contents
1. Mandel's three golden rules (Pressman, *Software Engineering*, ch. on UI design)
2. Design thinking and the UI design process
3. Nielsen's ten heuristics
4. Gestalt and the named laws
5. Accessibility floor (WCAG 2.2 AA)
6. A default principle set
7. Common over-reaches

## 1. Mandel's golden rules

**Place the user in control**
- Interaction modes are easy to enter and leave; never force unnecessary actions.
- Flexible interaction: keyboard, mouse and touch all work.
- Interaction is interruptible and undoable: drafts are saved, destructive actions confirm or undo.
- Interaction streamlines as skill grows, and can be customised.
- Hide technical internals from casual users.
- Allow direct manipulation of on-screen objects.

**Reduce the user's memory load**
- Show input and result together; don't make people remember across screens.
- Meaningful defaults, customisable.
- Intuitive shortcuts (mnemonics).
- Layout based on a real-world metaphor.
- Disclose information progressively (menu → item → detail).

**Make the interface consistent**
- Indicators (titles, icons, breadcrumbs) tell people where they are and how to move on.
- Consistency across a family of products.
- Don't change established interaction models without a compelling reason.

## 2. Design thinking and the process

Design thinking (human-centred, iterative): **Empathize → Define → Ideate → Prototype → Test**, repeated.

Software UI design process: requirements gathering and analysis → paper prototype → wireframes (low fidelity) →
high-fidelity prototype → interactive prototype.

Lessons from published case studies:
- **Documentation site case (NCR training site):** reframe a vague brief ("improve the docs") into systemic issues
  (fragmentation, inconsistency, over-gating). Fix 3–4 named principles up front and judge every decision against
  them. Do a content audit and a scored competitor matrix. Test a clickable prototype and measure task time.
- **Hackathon case (Moolah):** time-box brainstorming. Small design choices simplify development.
- **Course case (restaurant app):** scripted unmoderated usability tasks, each with a "was that easy?" follow-up.
- **Agency case (cooking app):** research, ideation, design and test overlap rather than run strictly in order.
  Every screen traces to a step in one user flow.

## 3. Nielsen's heuristics

1. Visibility of system status
2. Match between system and the real world (user's language)
3. User control and freedom (undo, exits)
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognise, diagnose and recover from errors
10. Help and documentation

## 4. Gestalt and the named laws

- **Gestalt:** proximity, similarity, common region, continuity, figure/ground. Hierarchy should come from
  spacing and grouping before borders and colour.
- **Jakob's law:** users spend most time on other products, so follow conventions they know (search top centre,
  alerts and profile top right, bottom tabs on mobile).
- **Hick's law:** decision time grows with the number of similar choices. Use it to argue for fewer top-level
  items, not to fix a magic number.
- **Fitts's law:** frequent targets should be big and near.
- **Miller / chunking:** group long lists.
- **Aesthetic–usability effect:** polish raises perceived usability; it doesn't fix structure.
- **Tesler's law:** complexity can only be moved, not removed. Decide who carries it.
- **Shneiderman's mantra:** overview first, zoom and filter, then details on demand.

## 5. Accessibility floor (WCAG 2.2 AA)

- **Contrast:** text 4.5:1; large text (24px, or 18.66px bold) 3:1; UI parts and focus indicators 3:1. Compute it
  (`scripts/contrast.py`); don't estimate.
- **Colour:** never the only carrier of meaning; add a label, icon, shape or line style.
- **Focus:** visible on every interactive element; logical order.
- **Targets:** at least 24×24 CSS px (44px is comfortable on touch).
- **Hover:** nothing discoverable only by hovering.
- **Motion:** respect `prefers-reduced-motion`.
- **Semantics:** real headings, labelled controls, alt text.

## 6. A default principle set

Use these unless the project already has its own:

| Principle | Meaning | Sources |
|---|---|---|
| Clear | Labels a newcomer can guess; recognition over recall | Mandel 2; Nielsen 2, 6 |
| Honest | Claims carry their limits; nothing invented | product rules |
| Consistent | One pattern per job; follow conventions | Mandel 3; Jakob |
| In control | Drafts, undo, keyboard, visible status | Mandel 1; Nielsen 1, 3, 5 |
| Calm | Hierarchy from type, space, grouping | Gestalt; Nielsen 8 |
| Accessible | WCAG 2.2 AA in every theme | WCAG |
| Progressive | Overview first, detail on demand | Mandel; Shneiderman |

## 7. Common over-reaches

Correct these when you see them, including in your own drafts:

- **"One job per screen"** should mean one *purpose*. A record page legitimately supports reading, checking,
  citing and discussing.
- **"Hide technical details"** must never hide limitations, uncertainty or who was studied. Only internal
  identifiers (codes, tiers, IDs, audit metadata) move behind a disclosure.
- **"5–6 navigation items"** is a starting constraint; let task testing decide.
- **"Re-architect"** means names, grouping and composition. It doesn't mean rewriting the backend.
- **A principle that only restates one stakeholder's proposal** isn't independent. Re-derive it from a source.
