import fs from "node:fs";
import path from "node:path";
import { withCdpPage, type RuntimeHealth } from "./cdp-browser";

export interface FeatureEntry {
  id: string;
  user_name: string;
  entry_point: string;
  selectors_or_anchors: string[];
  key_invariants: string[];
  verify_command: string;
  artifacts?: string[];
}

export interface CheckResult {
  name: string;
  passed: boolean;
  detail?: string;
}

export interface FeatureResult {
  id: string;
  entry_point: string;
  status: "pass" | "fail";
  durationMs: number;
  checks: CheckResult[];
  runtimeHealth?: RuntimeHealth;
  screenshot?: string;
  reportFile?: string;
}

export async function verifyHealthApi(baseUrl: string, feature: FeatureEntry): Promise<FeatureResult> {
  const started = Date.now();
  const checks: CheckResult[] = [];
  const res = await fetch(`${baseUrl}${feature.entry_point}`);
  checks.push({ name: "http-200", passed: res.status === 200, detail: `HTTP ${res.status}` });
  const body = (await res.json()) as {
    status?: string;
    service?: string;
    styles?: number;
    components?: number;
  };
  checks.push({
    name: "payload-ok",
    passed:
      body.status === "ok" &&
      body.service === "rakitek" &&
      Number(body.styles) > 0 &&
      Number(body.components) > 0,
    detail: JSON.stringify(body),
  });
  return {
    id: feature.id,
    entry_point: feature.entry_point,
    status: checks.every((c) => c.passed) ? "pass" : "fail",
    durationMs: Date.now() - started,
    checks,
  };
}

export async function verifyMcpEndpoint(baseUrl: string, feature: FeatureEntry): Promise<FeatureResult> {
  const started = Date.now();
  const checks: CheckResult[] = [];
  const res = await fetch(`${baseUrl}${feature.entry_point}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "rakitek-verify-web", version: "1.0.0" },
      },
    }),
  });
  checks.push({ name: "http-200", passed: res.status === 200, detail: `HTTP ${res.status}` });
  const text = await res.text();
  checks.push({
    name: "initialize-response",
    passed: text.includes("rakitek"),
    detail: text.slice(0, 160),
  });
  return {
    id: feature.id,
    entry_point: feature.entry_point,
    status: checks.every((c) => c.passed) ? "pass" : "fail",
    durationMs: Date.now() - started,
    checks,
  };
}

async function runInteraction(
  featureId: string,
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>,
  sleep: (ms: number) => Promise<void>,
): Promise<CheckResult | null> {
  if (featureId === "catalog-overview") {
    const expr = `(() => {
      const input = document.querySelector("#rk-sidebar-search");
      if (!input) return { ok: false };
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "magnetic");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return { ok: true };
    })()`;
    await send("Runtime.evaluate", { expression: expr });
    await sleep(300);
    const check = (await send("Runtime.evaluate", {
      expression: `JSON.stringify({
        links: Array.from(document.querySelectorAll("nav a[href*='/item/']")).map((a) => a.getAttribute("href"))
      })`,
      returnByValue: true,
    })) as { result?: { value?: string } };
    const links = (JSON.parse(check.result?.value ?? "{}") as { links?: string[] }).links ?? [];
    return {
      name: "sidebar-search-filter",
      passed: links.includes("/item/ui/magnetic-button") && links.length < 15,
      detail: `matched ${links.length} item link(s)`,
    };
  }

  if (featureId === "item-detail-preview") {
    await send("Runtime.evaluate", {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll("main button[aria-pressed]"));
        if (buttons[1]) buttons[1].click();
      })()`,
    });
    await sleep(300);
    const check = (await send("Runtime.evaluate", {
      expression: `JSON.stringify({
        hasCode: Boolean(document.querySelector("main pre code, main pre")),
        pressedCount: document.querySelectorAll("main button[aria-pressed='true']").length
      })`,
      returnByValue: true,
    })) as { result?: { value?: string } };
    const parsed = JSON.parse(check.result?.value ?? "{}") as {
      hasCode?: boolean;
      pressedCount?: number;
    };
    return {
      name: "switch-to-code-tab",
      passed: Boolean(parsed.hasCode && parsed.pressedCount === 1),
      detail: JSON.stringify(parsed),
    };
  }

  return null;
}

export async function verifyBrowserFeature(
  root: string,
  baseUrl: string,
  outDir: string,
  feature: FeatureEntry,
): Promise<FeatureResult> {
  const started = Date.now();
  const checks: CheckResult[] = [];
  const relShot = path.join(outDir, `${feature.id}.jpg`).replaceAll("\\", "/");

  const { health } = await withCdpPage({ width: 1440, height: 900 }, async ({ send, health, sleep }) => {
    await send("Page.navigate", { url: `${baseUrl}${feature.entry_point}` });
    await sleep(1400);
    await send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });

    const domRes = (await send("Runtime.evaluate", {
      expression: `JSON.stringify({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        selectors: ${JSON.stringify(feature.selectors_or_anchors)}.map((sel) => ({
          sel,
          found: Boolean(document.querySelector(sel))
        }))
      })`,
      returnByValue: true,
    })) as { result?: { value?: string } };

    const dom = JSON.parse(domRes.result?.value ?? "{}") as {
      overflow?: number;
      selectors?: Array<{ sel: string; found: boolean }>;
    };

    for (const s of dom.selectors ?? []) {
      checks.push({ name: `selector:${s.sel}`, passed: s.found, detail: s.found ? "found" : "missing" });
    }
    const overflow = dom.overflow ?? 999;
    checks.push({ name: "no-horizontal-overflow", passed: overflow <= 1, detail: `overflow=${overflow}px` });

    const shot = (await send("Page.captureScreenshot", { format: "jpeg", quality: 84 })) as { data: string };
    const absShot = path.resolve(root, relShot);
    fs.mkdirSync(path.dirname(absShot), { recursive: true });
    fs.writeFileSync(absShot, Buffer.from(shot.data, "base64"));

    const interaction = await runInteraction(feature.id, send, sleep);
    if (interaction) checks.push(interaction);

    return { health };
  });

  checks.push({
    name: "zero-console-errors",
    passed: health.consoleErrors.length === 0,
    detail: health.consoleErrors.join(" | ") || "0",
  });
  checks.push({
    name: "zero-uncaught-exceptions",
    passed: health.exceptions.length === 0,
    detail: health.exceptions.join(" | ") || "0",
  });
  checks.push({
    name: "zero-http-errors",
    passed: health.failedRequests.length === 0,
    detail: health.failedRequests.join(" | ") || "0",
  });

  return {
    id: feature.id,
    entry_point: feature.entry_point,
    status: checks.every((c) => c.passed) ? "pass" : "fail",
    durationMs: Date.now() - started,
    checks,
    runtimeHealth: health,
    screenshot: relShot,
  };
}
