import fs from "node:fs";
import path from "node:path";
import { findBrowser, withCdpPage } from "./cdp-browser";

type ActionName =
  | "tab-preview"
  | "tab-code"
  | "tab-usage"
  | "open-fullscreen"
  | "fullscreen-desktop"
  | "fullscreen-tablet"
  | "fullscreen-mobile"
  | "press-escape"
  | "close-fullscreen-btn"
  | "search-magnetic"
  | "search-empty-hit"
  | "search-clear";

interface Counterexample {
  seed: number;
  step: number;
  action: ActionName;
  invariant: string;
  detail: string;
  trace: ActionName[];
}

interface Snapshot {
  activeTabIndex: number;
  pressedCount: number;
  modalViewportPressed: number;
  hasIframe: boolean;
  iframeW: number;
  iframeH: number;
  hasCode: boolean;
  modalOpen: boolean;
  modalHasIframe: boolean;
  bodyOverflow: string;
  sidebarCount: number;
  searchVal: string;
  overflow: number;
}

const ROOT = process.cwd();
const DEFAULT_BASE_URL = process.env.RK_BASE_URL ?? "http://127.0.0.1:3000";
const SEEDS = [42, 1337];
const STEPS_PER_SEED = 24;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseArgs(argv: string[]) {
  let baseUrl = DEFAULT_BASE_URL;
  let outFile = "artifacts/verify-web/properties-report.json";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--base-url" && argv[i + 1]) baseUrl = argv[++i];
    else if (argv[i] === "--out" && argv[i + 1]) outFile = argv[++i];
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), outFile };
}

function pickAction(rand: () => number, snap: Snapshot): ActionName {
  const pool: ActionName[] = snap.modalOpen
    ? ["fullscreen-desktop", "fullscreen-tablet", "fullscreen-mobile", "press-escape", "close-fullscreen-btn"]
    : [
        "tab-preview",
        "tab-code",
        "tab-usage",
        ...(snap.activeTabIndex === 0 ? (["open-fullscreen", "open-fullscreen"] as ActionName[]) : []),
        "search-magnetic",
        "search-empty-hit",
        "search-clear",
      ];
  return pool[Math.floor(rand() * pool.length)];
}

async function readSnapshot(
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>,
): Promise<Snapshot> {
  const res = (await send("Runtime.evaluate", {
    expression: `JSON.stringify((() => {
      const tabs = Array.from(document.querySelectorAll("main button[aria-pressed]")).filter(
        (b) => !b.closest("[role='dialog']")
      );
      const pressed = tabs.filter((b) => b.getAttribute("aria-pressed") === "true");
      const activeTabIndex = tabs.findIndex((b) => b.getAttribute("aria-pressed") === "true");
      const dialog = document.querySelector("[role='dialog'][aria-modal='true']");
      const modalViewportPressed = dialog
        ? dialog.querySelectorAll("[role='group'] button[aria-pressed='true']").length
        : 0;
      const iframe = (dialog ?? document.querySelector("main"))?.querySelector("iframe");
      const rect = iframe ? iframe.getBoundingClientRect() : { width: 0, height: 0 };
      const search = document.querySelector("#rk-sidebar-search");
      return {
        activeTabIndex,
        pressedCount: pressed.length,
        modalViewportPressed,
        hasIframe: Boolean(iframe),
        iframeW: Math.round(rect.width),
        iframeH: Math.round(rect.height),
        hasCode: Boolean(document.querySelector("main pre")),
        modalOpen: Boolean(dialog),
        modalHasIframe: Boolean(dialog?.querySelector("iframe")),
        bodyOverflow: document.body.style.overflow || "",
        sidebarCount: document.querySelectorAll("nav a[href*='/item/']").length,
        searchVal: search ? search.value : "",
        overflow: document.documentElement.scrollWidth - window.innerWidth
      };
    })())`,
    returnByValue: true,
  })) as { result?: { value?: string } };
  return JSON.parse(res.result?.value ?? "{}") as Snapshot;
}

async function applyAction(
  action: ActionName,
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>,
) {
  if (action === "press-escape") {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    return;
  }

  const exprMap: Record<Exclude<ActionName, "press-escape">, string> = {
    "tab-preview": `document.querySelectorAll("main button[aria-pressed]")[0]?.click()`,
    "tab-code": `document.querySelectorAll("main button[aria-pressed]")[1]?.click()`,
    "tab-usage": `document.querySelectorAll("main button[aria-pressed]")[2]?.click()`,
    "open-fullscreen": `document.querySelector("main button[aria-label*='fullscreen' i], main button[aria-label*='layar penuh' i]")?.click()`,
    "fullscreen-desktop": `document.querySelectorAll("[role='dialog'] [role='group'] button")[0]?.click()`,
    "fullscreen-tablet": `document.querySelectorAll("[role='dialog'] [role='group'] button")[1]?.click()`,
    "fullscreen-mobile": `document.querySelectorAll("[role='dialog'] [role='group'] button")[2]?.click()`,
    "close-fullscreen-btn": `Array.from(document.querySelectorAll("[role='dialog'] header button")).at(-1)?.click()`,
    "search-magnetic": `(() => { const i = document.querySelector("#rk-sidebar-search"); if (!i) return; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(i, "magnetic"); i.dispatchEvent(new Event("input", { bubbles: true })); })()`,
    "search-empty-hit": `(() => { const i = document.querySelector("#rk-sidebar-search"); if (!i) return; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(i, "zzzz-no-such-item"); i.dispatchEvent(new Event("input", { bubbles: true })); })()`,
    "search-clear": `(() => { const i = document.querySelector("#rk-sidebar-search"); if (!i) return; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(i, ""); i.dispatchEvent(new Event("input", { bubbles: true })); })()`,
  };
  await send("Runtime.evaluate", { expression: exprMap[action] });
}

function checkInvariants(snap: Snapshot, fullSidebarCount: number, action: ActionName): string | null {
  if (snap.pressedCount !== 1) return `single-active-tab: pressedCount=${snap.pressedCount}`;
  if (snap.activeTabIndex === 0 && !snap.hasIframe) return "tab-content-match: preview missing iframe";
  if ((snap.activeTabIndex === 1 || snap.activeTabIndex === 2) && !snap.hasCode) {
    return `tab-content-match: tab ${snap.activeTabIndex} missing <pre>`;
  }
  if (snap.modalOpen && !snap.modalHasIframe) return "modal-preview: dialog missing iframe";
  if (snap.modalOpen && snap.modalViewportPressed !== 1) {
    return `single-modal-viewport: modalViewportPressed=${snap.modalViewportPressed}`;
  }
  if (!snap.modalOpen && snap.bodyOverflow === "hidden") return "no-stuck-scroll-lock: body overflow stayed hidden";
  if ((action === "press-escape" || action === "close-fullscreen-btn") && snap.modalOpen) {
    return "no-orphaned-modal: dialog remained open after close";
  }
  if ((snap.modalOpen || snap.activeTabIndex === 0) && (snap.iframeW <= 0 || snap.iframeH <= 0)) {
    return `valid-iframe-size: ${snap.iframeW}x${snap.iframeH}`;
  }
  if (snap.overflow > 1) return `no-horizontal-overflow: overflow=${snap.overflow}px`;
  if (action === "search-clear" && snap.sidebarCount !== fullSidebarCount) {
    return `recoverable-sidebar-search: expected ${fullSidebarCount}, got ${snap.sidebarCount}`;
  }
  return null;
}

async function runSeed(baseUrl: string, seed: number) {
  const rand = mulberry32(seed);
  const trace: ActionName[] = [];
  const counterexamples: Counterexample[] = [];

  const health = await withCdpPage({ width: 1440, height: 900 }, async ({ send, health, sleep }) => {
    await send("Page.navigate", { url: `${baseUrl}/item/ui/magnetic-button` });
    await sleep(1200);
    await send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });

    let snap = await readSnapshot(send);
    const fullSidebarCount = snap.sidebarCount;

    for (let step = 1; step <= STEPS_PER_SEED; step++) {
      const action = pickAction(rand, snap);
      trace.push(action);
      await applyAction(action, send);
      await sleep(140);
      snap = await readSnapshot(send);
      const violation = checkInvariants(snap, fullSidebarCount, action);
      if (violation) {
        counterexamples.push({ seed, step, action, invariant: violation.split(":")[0], detail: violation, trace: [...trace] });
        break;
      }
    }
    return health;
  });

  if (health.consoleErrors.length || health.exceptions.length || health.failedRequests.length) {
    counterexamples.push({
      seed,
      step: trace.length,
      action: trace[trace.length - 1] ?? "tab-preview",
      invariant: "zero-runtime-crash",
      detail: JSON.stringify(health),
      trace,
    });
  }
  return { seed, stepsExecuted: trace.length, counterexamples, health };
}

async function main() {
  const { baseUrl, outFile } = parseArgs(process.argv.slice(2));
  const runs = [];
  for (const seed of SEEDS) runs.push(await runSeed(baseUrl, seed));

  const counterexamples = runs.flatMap((r) => r.counterexamples);
  const report = {
    status: counterexamples.length === 0 ? "pass" : "fail",
    browser: findBrowser(),
    baseUrl,
    seeds: SEEDS,
    totalTransitions: runs.reduce((sum, r) => sum + r.stepsExecuted, 0),
    counterexampleCount: counterexamples.length,
    counterexamples,
    runs: runs.map((r) => ({ seed: r.seed, stepsExecuted: r.stepsExecuted, health: r.health })),
  };

  const absOut = path.resolve(ROOT, outFile);
  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.status === "pass" ? 0 : 1);
}

main().catch((err) => {
  console.error("[verify-web-properties] ERROR:", err);
  process.exit(1);
});
