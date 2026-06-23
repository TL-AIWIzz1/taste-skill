#!/usr/bin/env node
// shoot.mjs — full-page screenshot of a rendered dashboard.html.
//
// The dashboard is the product surface, so "did my change work?" = "look at
// the rendered page." This drives headless Chromium (Playwright's bundled
// build) to load the file and capture the whole scrolling page to PNG.
//
//   node shoot.mjs sample/dashboard.html sample/dashboard.png
//
// Args (relative to this script):
//   1: html in   default ./sample/dashboard.html
//   2: png out   default ./sample/dashboard.png
//   3: width px  default 1320
import { createRequire } from "node:module";
import { existsSync, globSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const inHtml = resolve(here, a[0] || "sample/dashboard.html");
const outPng = resolve(here, a[1] || "sample/dashboard.png");
const width = parseInt(a[2] || "1320", 10);

if (!existsSync(inHtml)) {
  console.error(`no such file: ${inHtml}\nRun render.mjs first.`);
  process.exit(1);
}

// Playwright is installed globally on this image; load it from there.
const require = createRequire("/opt/node22/lib/node_modules/x.js");
const { chromium } = require("playwright");

// Find the bundled Chromium so we don't depend on PLAYWRIGHT_BROWSERS_PATH.
const found = globSync("/opt/pw-browsers/chromium-*/chrome-linux/chrome");
const launchOpts = { args: ["--no-sandbox", "--disable-gpu"] };
if (found.length) launchOpts.executablePath = found.sort().at(-1);

const browser = await chromium.launch(launchOpts);
const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(inHtml).href, { waitUntil: "networkidle" });
await page.screenshot({ path: outPng, fullPage: true });
await browser.close();
console.log(`shot ${outPng} @ ${width}px`);
