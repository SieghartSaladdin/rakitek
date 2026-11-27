import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export interface RuntimeHealth {
  consoleErrors: string[];
  exceptions: string[];
  failedRequests: string[];
}

export interface CdpSession {
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>;
  health: RuntimeHealth;
  sleep: (ms: number) => Promise<void>;
}

const BROWSER_PATHS = [
  ...(process.env.RK_CHROME_PATH ? [process.env.RK_CHROME_PATH] : []),
  "/usr/bin/brave-browser",
  "/usr/bin/brave-browser-stable",
  "/opt/brave.com/brave/brave",
  "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
  "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

export function findBrowser(): string {
  for (const p of BROWSER_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Brave/Chrome executable not found. Set RK_CHROME_PATH if installed elsewhere.");
}

export async function sleep(ms: number): Promise<void> {
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
      // waiting for browser startup
    }
    await sleep(150);
  }
  throw new Error("Timed out waiting for Chrome DevTools Protocol.");
}

function createCdpClient(wsUrl: string) {
  let nextId = 1;
  const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  const health: RuntimeHealth = { consoleErrors: [], exceptions: [], failedRequests: [] };
  const ws = new WebSocket(wsUrl);

  const rejectAll = (err: Error) => {
    for (const p of pending.values()) p.reject(err);
    pending.clear();
  };

  const ready = new Promise<void>((resolve, reject) => {
    ws.addEventListener("open", () => resolve());
    ws.addEventListener("error", () => {
      const err = new Error("CDP WebSocket error");
      reject(err);
      rejectAll(err);
    });
    ws.addEventListener("close", () => {
      const err = new Error("CDP WebSocket closed");
      reject(err);
      rejectAll(err);
    });
  });

  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(String(event.data)) as {
      id?: number;
      method?: string;
      params?: Record<string, unknown>;
      result?: unknown;
      error?: { message: string };
    };
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id)!;
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message));
      else p.resolve(msg.result);
      return;
    }
    recordCdpEvent(msg.method, msg.params, health);
  });

  async function send(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    await ready;
    const id = nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (pending.delete(id)) reject(new Error(`CDP timeout waiting for ${method}`));
      }, 30000);
      pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  return { send, health, close: () => ws.close() };
}

function recordCdpEvent(
  method: string | undefined,
  params: Record<string, unknown> | undefined,
  health: RuntimeHealth,
) {
  if (!method || !params) return;
  if (method === "Runtime.consoleAPICalled" && params.type === "error") {
    const args = (params.args as Array<{ value?: unknown; description?: string }> | undefined) ?? [];
    const text = args.map((a) => String(a.value ?? a.description ?? "")).join(" ").trim();
    if (text) health.consoleErrors.push(text);
  } else if (method === "Runtime.exceptionThrown") {
    const detail = params.exceptionDetails as { text?: string; exception?: { description?: string } } | undefined;
    const text = detail?.exception?.description ?? detail?.text ?? "Uncaught runtime exception";
    health.exceptions.push(text);
  } else if (method === "Network.responseReceived") {
    const resp = params.response as { status?: number; url?: string } | undefined;
    if (resp && typeof resp.status === "number" && resp.status >= 400 && resp.url) {
      health.failedRequests.push(`${resp.status} ${resp.url}`);
    }
  } else if (method === "Network.loadingFailed") {
    const canceled = Boolean(params.canceled);
    const errText = String(params.errorText ?? "loadingFailed");
    if (!canceled && errText !== "net::ERR_ABORTED") {
      health.failedRequests.push(`${errText} (${String(params.type ?? "unknown")})`);
    }
  }
}

function removeProfile(dir: string) {
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  } catch (err) {
    console.warn(`[cdp-browser] could not remove ${dir}: ${(err as Error).message}`);
  }
}

function sweepStaleProfiles() {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const name of fs.readdirSync(os.tmpdir())) {
    if (!name.startsWith("rk-cdp-")) continue;
    const full = path.join(os.tmpdir(), name);
    try {
      if (fs.statSync(full).mtimeMs < cutoff) removeProfile(full);
    } catch {
      // vanished meanwhile
    }
  }
}

export async function withCdpPage<T>(
  opts: { width: number; height: number; mobile?: boolean },
  fn: (session: CdpSession) => Promise<T>,
): Promise<T> {
  const port = 9300 + Math.floor(Math.random() * 500);
  sweepStaleProfiles();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "rk-cdp-"));

  const browser = spawn(
    findBrowser(),
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--window-size=${opts.width},${opts.height}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let cdp: ReturnType<typeof createCdpClient> | undefined;
  try {
    const wsUrl = await waitForWs(port);
    cdp = createCdpClient(wsUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: opts.width,
      height: opts.height,
      deviceScaleFactor: 1,
      mobile: opts.mobile ?? opts.width <= 500,
    });
    return await fn({ send: cdp.send, health: cdp.health, sleep });
  } finally {
    const exited = new Promise<void>((resolve) => browser.once("exit", () => resolve()));
    if (cdp) {
      await Promise.race([cdp.send("Browser.close").catch(() => undefined), sleep(3000)]);
      cdp.close();
    }
    await Promise.race([exited, sleep(5000)]);
    if (browser.exitCode === null) browser.kill("SIGKILL");
    await Promise.race([exited, sleep(3000)]);
    removeProfile(userDataDir);
  }
}
