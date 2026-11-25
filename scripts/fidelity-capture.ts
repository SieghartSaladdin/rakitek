import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

interface CaptureJob {
  url: string;
  width: number;
  height: number;
  selectors: Record<string, string>;
  outJson: string;
  outImage?: string;
  setupJs?: string;
  waitMs?: number;
  scrollSelector?: string;
}

const CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

function findChrome(): string {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Chrome executable not found.");
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForWs(port: number): Promise<string> {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = (await res.json()) as Array<{ type: string; webSocketDebuggerUrl?: string }>;
      const page = targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // waiting for chrome startup
    }
    await sleep(150);
  }
  throw new Error("Timed out waiting for Chrome DevTools Protocol.");
}

function createCdpClient(wsUrl: string) {
  let nextId = 1;
  const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  const ws = new WebSocket(wsUrl);

  const ready = new Promise<void>((resolve, reject) => {
    ws.addEventListener("open", () => resolve());
    ws.addEventListener("error", () => reject(new Error("CDP WebSocket error")));
  });

  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(String(event.data)) as {
      id?: number;
      result?: unknown;
      error?: { message: string };
    };
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id)!;
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message));
      else p.resolve(msg.result);
    }
  });

  async function send(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    await ready;
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  return { send, close: () => ws.close() };
}

async function runCapture(jobPath: string) {
  const job = JSON.parse(fs.readFileSync(jobPath, "utf8")) as CaptureJob;
  const measureScript = fs.readFileSync(
    path.resolve(process.cwd(), "scripts", "fidelity", "measure.js"),
    "utf8",
  );
  const port = 9300 + Math.floor(Math.random() * 500);
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "rk-cdp-"));

  const chrome = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--window-size=${job.width},${job.height}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  try {
    const wsUrl = await waitForWs(port);
    const cdp = createCdpClient(wsUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: job.width,
      height: job.height,
      deviceScaleFactor: 1,
      mobile: job.width <= 500,
    });

    // Same scrollbar normalization as measure.js, applied before the page lays out.
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source:
        'document.addEventListener("DOMContentLoaded",()=>{const s=document.createElement("style");s.id="rk-fidelity-normalize";s.textContent="html{scrollbar-width:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important}";document.head.append(s);});',
    });
    await cdp.send("Page.navigate", { url: job.url });
    await sleep(job.waitMs ?? 2200);

    await cdp.send("Runtime.evaluate", {
      expression: "document.fonts.ready",
      awaitPromise: true,
    });

    if (job.scrollSelector) {
      await cdp.send("Runtime.evaluate", {
        expression: `(() => { const el = document.querySelector(${JSON.stringify(job.scrollSelector)}); if (el) el.scrollIntoView({ behavior: "instant", block: "start" }); })()`,
      });
      await sleep(700);
    }

    if (job.setupJs) {
      await cdp.send("Runtime.evaluate", {
        expression: `(async () => { ${job.setupJs} })()`,
        awaitPromise: true,
      });
      await sleep(700);
    }

    await cdp.send("Runtime.evaluate", { expression: measureScript });
    const evalRes = (await cdp.send("Runtime.evaluate", {
      expression: `JSON.stringify(window.rkMeasure(${JSON.stringify(job.selectors)}))`,
      returnByValue: true,
    })) as { result?: { value?: string } };

    const measured = evalRes.result?.value;
    if (!measured) throw new Error("rkMeasure returned empty output.");

    const outJsonAbs = path.resolve(process.cwd(), job.outJson);
    fs.mkdirSync(path.dirname(outJsonAbs), { recursive: true });
    fs.writeFileSync(outJsonAbs, JSON.stringify(JSON.parse(measured), null, 2));
    console.log(`[fidelity-capture] saved ${job.outJson}`);

    if (job.outImage) {
      const shot = (await cdp.send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 86,
      })) as { data: string };
      const outImgAbs = path.resolve(process.cwd(), job.outImage);
      fs.mkdirSync(path.dirname(outImgAbs), { recursive: true });
      fs.writeFileSync(outImgAbs, Buffer.from(shot.data, "base64"));
      console.log(`[fidelity-capture] saved ${job.outImage}`);
    }

    cdp.close();
  } finally {
    chrome.kill("SIGKILL");
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // ignore temp cleanup error on Windows
    }
  }
}

const jobFile = process.argv[2];
if (!jobFile) {
  console.error("Usage: tsx scripts/fidelity-capture.ts <job.json>");
  process.exit(2);
}
runCapture(jobFile).catch((err) => {
  console.error("[fidelity-capture] ERROR:", err);
  process.exit(1);
});
