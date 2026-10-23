// Before/after screenshot comparison for styling refactors.
//
// Usage (run from the project root so Playwright and sharp resolve from its node_modules):
//   node <skill>/scripts/visual_diff.mjs <beforeUrl> <afterUrl> <outDir> <routesFile>
// routesFile: one path per line, e.g. "/", "/settings", "/search?q=test". Lines starting with # are ignored.
//
// Writes <slug>-<viewport>-{before,after,diff}.png and appends results to <outDir>/results.jsonl.
// Resumable: pages that already have a diff image are skipped, so repeated runs finish long lists.
// Needs: @playwright/test (or playwright) with Chromium installed, and sharp.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "package.json"));
const resolveFirst = (...names) => { for (const n of names) { try { return require(n); } catch {} } throw new Error(`install one of: ${names.join(", ")}`); };
const { chromium } = resolveFirst("@playwright/test", "playwright");
const sharp = resolveFirst("sharp");

const [before, after, out, routesFile] = process.argv.slice(2);
if (!routesFile) { console.error("usage: visual_diff.mjs <beforeUrl> <afterUrl> <outDir> <routesFile>"); process.exit(1); }
const ROUTES = fs.readFileSync(routesFile, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
fs.mkdirSync(out, { recursive: true });

const VIEWPORTS = [{ name: "desktop", width: 1280, height: 900 }, { name: "mobile", width: 390, height: 844 }];
const FREEZE = "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";
const THRESHOLD = 6; // per-channel difference below this is antialiasing noise

async function shoot(page, url, file) {
  await page.goto(url, { waitUntil: "load", timeout: 180_000 });
  // Pages with live connections never reach network idle; wait a bounded time instead.
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
  await page.addStyleTag({ content: FREEZE });
  await page.waitForTimeout(800);
  await page.screenshot({ path: file, fullPage: true });
}

async function compare(a, b, diffFile) {
  const [ia, ib] = await Promise.all([a, b].map((f) => sharp(f).raw().ensureAlpha().toBuffer({ resolveWithObject: true })));
  const w = Math.min(ia.info.width, ib.info.width), h = Math.min(ia.info.height, ib.info.height);
  const diff = Buffer.alloc(w * h * 4);
  let changed = 0, maxDelta = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const pa = (y * ia.info.width + x) * 4, pb = (y * ib.info.width + x) * 4, pd = (y * w + x) * 4;
    const d = Math.max(...[0, 1, 2].map((c) => Math.abs(ia.data[pa + c] - ib.data[pb + c])));
    maxDelta = Math.max(maxDelta, d);
    if (d > THRESHOLD) { changed++; diff[pd] = 255; diff[pd + 1] = 40; diff[pd + 2] = 40; }
    else { const g = (ia.data[pa] + ia.data[pa + 1] + ia.data[pa + 2]) / 9; diff[pd] = diff[pd + 1] = diff[pd + 2] = g; }
    diff[pd + 3] = 255;
  }
  await sharp(diff, { raw: { width: w, height: h, channels: 4 } }).png().toFile(diffFile);
  return { changedPct: +(100 * changed / (w * h)).toFixed(3), maxDelta, sizeBefore: `${ia.info.width}x${ia.info.height}`, sizeAfter: `${ib.info.width}x${ib.info.height}` };
}

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    // Short names: long URL slugs can exceed the Windows path limit.
    const slug = `${(route.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").slice(0, 40) || "home")}-${vp.name}`;
    const a = path.join(out, `${slug}-before.png`), b = path.join(out, `${slug}-after.png`), d = path.join(out, `${slug}-diff.png`);
    if (fs.existsSync(d)) continue;
    try {
      // Warm both first so a cold compile is not mistaken for a rendering difference.
      await page.goto(before + route, { waitUntil: "load", timeout: 180_000 }).catch(() => {});
      await page.goto(after + route, { waitUntil: "load", timeout: 180_000 }).catch(() => {});
      await shoot(page, before + route, a);
      await shoot(page, after + route, b);
      const r = await compare(a, b, d);
      fs.appendFileSync(path.join(out, "results.jsonl"), JSON.stringify({ route, viewport: vp.name, ...r }) + "\n");
      const size = r.sizeBefore === r.sizeAfter ? "" : `  size ${r.sizeBefore} -> ${r.sizeAfter}`;
      console.log(`${vp.name.padEnd(8)} ${route.padEnd(50)} ${String(r.changedPct).padStart(7)}% changed  maxDelta ${r.maxDelta}${size}`);
    } catch (e) {
      console.log(`${vp.name.padEnd(8)} ${route} ERROR ${String(e).slice(0, 160)}`);
    }
  }
  await ctx.close();
}
await browser.close();
