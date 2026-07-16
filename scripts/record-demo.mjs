import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const baseUrl = process.env.NEXUS_CAPTURE_URL || "http://127.0.0.1:8070/";
const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = Number(process.env.CDP_PORT || 9334);
const frameDir = join(root, "assets", "demo-frames");
const viewport = { width: 1440, height: 900 };

await rm(frameDir, { recursive: true, force: true });
await mkdir(frameDir, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${join(tmpdir(), `nexus-demo-${Date.now()}`)}`,
  `--window-size=${viewport.width},${viewport.height}`,
  "about:blank"
], { stdio: "ignore" });

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWebSocketUrl() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const tabs = await fetch(`http://127.0.0.1:${port}/json/list`).then(res => res.json());
      const page = tabs.find(tab => tab.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      await delay(250);
    }
  }
  throw new Error("Chrome DevTools endpoint did not become available.");
}

const ws = new WebSocket(await getWebSocketUrl());
let nextId = 1;
let frameIndex = 0;
const pending = new Map();

ws.addEventListener("message", async event => {
  const message = JSON.parse(event.data);
  if (message.method === "Page.screencastFrame") {
    frameIndex += 1;
    await writeFile(
      join(frameDir, `${String(frameIndex).padStart(4, "0")}.jpg`),
      Buffer.from(message.params.data, "base64")
    );
    send("Page.screencastFrameAck", { sessionId: message.params.sessionId }).catch(() => {});
    return;
  }
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
});

await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));

function send(method, params = {}) {
  const id = nextId;
  nextId += 1;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  return send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
}

async function scrollTo(y, duration = 700) {
  await evaluate(`window.scrollTo({ top: ${y}, behavior: "smooth" })`);
  await delay(duration);
}

async function switchView(view) {
  await evaluate(`document.querySelector('[data-view="${view}"]').click()`);
  await delay(650);
}

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send("Page.navigate", { url: `${baseUrl}?capture=1&view=dashboard&v=record-demo` });
  await delay(1300);

  await send("Page.startScreencast", {
    format: "jpeg",
    quality: 82,
    everyNthFrame: 2
  });

  await delay(1000);
  await scrollTo(680);
  await scrollTo(1350);
  await switchView("resume");
  await scrollTo(620);
  await switchView("caseStudy");
  await scrollTo(700);
  await scrollTo(1260);
  await delay(1000);

  await send("Page.stopScreencast");
} finally {
  ws.close();
  chrome.kill();
}
