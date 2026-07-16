import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const baseUrl = process.env.NEXUS_CAPTURE_URL || "http://127.0.0.1:8070/";
const outputDir = join(root, "assets");
const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const viewport = {
  width: Number(process.env.CAPTURE_WIDTH || 1440),
  height: Number(process.env.CAPTURE_HEIGHT || 2200)
};

const captures = [
  ["dashboard", "nexus-dashboard.png"],
  ["resume", "nexus-resume-coach.png"],
  ["caseStudy", "nexus-case-study.png"],
  ["dashboard", "nexus-ai-demo-poster.png"]
];

await mkdir(outputDir, { recursive: true });

for (const [view, filename] of captures) {
  const url = `${baseUrl}?capture=1&view=${view}&v=clean-assets`;
  const result = spawnSync(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=2",
    `--window-size=${viewport.width},${viewport.height}`,
    `--screenshot=${join(outputDir, filename)}`,
    url
  ], { encoding: "utf8" });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Chrome capture failed for ${filename}`);
  }
}
