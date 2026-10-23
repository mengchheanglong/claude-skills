#!/usr/bin/env node
// Checks a wireframe built from assets/wireframe-template.html.
// Usage: node check_wireframes.js path/to/wireframes.html
// Fails (exit 1) when a screen throws while rendering, a screen is missing from GROUPS (or vice versa),
// an internal link points to an unknown screen, a numbered marker has no note, a note has no marker,
// or rendered markup contains "undefined" / "NaN" / "[object".
const fs = require("fs");

const file = process.argv[2];
if (!file) { console.error("usage: node check_wireframes.js <wireframes.html>"); process.exit(2); }
const html = fs.readFileSync(file, "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!scripts.length) { console.error("no inline <script> found"); process.exit(2); }
let js = scripts.join("\n");
// Expose the template's top-level registries so they can be inspected after evaluation.
js = js.replace(/^(const|let) (GROUPS|SCREENS|SECTION|SITEMAP)\s*=/gm, "globalThis.$2 =");

const el = { innerHTML: "", value: "", classList: { toggle() { return true; } }, setAttribute() {}, onclick: null, onchange: null };
global.document = { getElementById: () => el, body: el, querySelectorAll: () => [] };
global.location = { hash: "" };
global.window = { addEventListener() {}, scrollTo() {}, innerWidth: 1280 };
(0, eval)(js);

const problems = [];
const listed = Object.values(GROUPS).flat();
for (const k of Object.keys(SCREENS)) if (!listed.includes(k)) problems.push(`screen "${k}" is not listed in GROUPS`);
for (const k of listed) {
  const screen = SCREENS[k];
  if (!screen) { problems.push(`GROUPS lists unknown screen "${k}"`); continue; }
  let out;
  try { out = screen.html(); } catch (e) { problems.push(`${k}: render error: ${e.message}`); continue; }
  for (const m of out.matchAll(/href="#([^"]*)"/g)) if (!SCREENS[m[1]]) problems.push(`${k}: link to unknown screen #${m[1]}`);
  const marks = [...out.matchAll(/See note (\d+)/g)].map((m) => +m[1]);
  const notes = screen.notes || [];
  for (const m of marks) if (m > notes.length) problems.push(`${k}: marker ${m} but only ${notes.length} notes`);
  if (notes.length > 1) for (let i = 1; i <= notes.length; i++) if (!marks.includes(i)) problems.push(`${k}: note ${i} has no marker`);
  if (/undefined|NaN|\[object/.test(out)) problems.push(`${k}: rendered "undefined", "NaN" or "[object"`);
}
console.log(`${listed.length} screens checked`);
if (problems.length) { console.log(problems.join("\n")); process.exit(1); }
console.log("no problems");
