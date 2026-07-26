import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire("C:/Users/jason/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json");
const { chromium } = require("playwright");

const root = path.resolve(process.cwd());
const videoDir = path.join(root, "assets", "demo-video");
await fs.mkdir(videoDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();

async function hold(ms = 5000) {
  await page.waitForTimeout(ms);
}

async function clickText(text, ms = 5000) {
  const target = page.getByText(text, { exact: false }).first();
  if (await target.count()) {
    await target.click({ timeout: 3000 }).catch(() => {});
    await hold(ms);
  }
}

await page.goto("http://127.0.0.1:8070/?v=ibm-video", { waitUntil: "networkidle" });
await hold(7000);

await clickText("Applications", 6000);
await clickText("Skills", 6000);
await clickText("AI Coach", 6000);
await clickText("Resume", 6000);
await clickText("Case Study", 7000);
await clickText("Dashboard", 5000);

await context.close();
await browser.close();

const files = await fs.readdir(videoDir);
const latest = (await Promise.all(files.map(async (file) => {
  const full = path.join(videoDir, file);
  const stat = await fs.stat(full);
  return { file, full, mtime: stat.mtimeMs };
}))).sort((a, b) => b.mtime - a.mtime)[0];

if (!latest) {
  throw new Error("No video was recorded.");
}

const out = path.join(root, "assets", "nexus-ai-ibm-demo.webm");
await fs.copyFile(latest.full, out);
console.log(out);
