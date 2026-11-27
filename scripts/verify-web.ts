import fs from "node:fs";
import path from "node:path";
import { findBrowser } from "./cdp-browser";
import {
  verifyBrowserFeature,
  verifyHealthApi,
  verifyMcpEndpoint,
  type FeatureEntry,
  type FeatureResult,
} from "./verify-web-checks";

interface FeatureMap {
  app_name: string;
  version: string;
  features: FeatureEntry[];
}

const ROOT = process.cwd();
const DEFAULT_BASE_URL = process.env.RK_BASE_URL ?? "http://127.0.0.1:3000";
const DEFAULT_OUT_DIR = "artifacts/verify-web";

function loadFeatureMap(): FeatureMap {
  const file = path.join(ROOT, "feature-map.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as FeatureMap;
}

function parseArgs(argv: string[]) {
  let baseUrl = DEFAULT_BASE_URL;
  let outDir = DEFAULT_OUT_DIR;
  let runAll = false;
  let listOnly = false;
  const ids: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--all") runAll = true;
    else if (arg === "--list") listOnly = true;
    else if (arg === "--base-url" && argv[i + 1]) baseUrl = argv[++i];
    else if (arg === "--out" && argv[i + 1]) outDir = argv[++i];
    else if (!arg.startsWith("-")) ids.push(arg);
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), outDir, runAll, listOnly, ids };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const map = loadFeatureMap();

  if (opts.listOnly) {
    const listed = map.features.map((f) => ({
      id: f.id,
      entry_point: f.entry_point,
      user_name: f.user_name,
    }));
    console.log(JSON.stringify(listed, null, 2));
    return;
  }

  const selected = opts.runAll
    ? map.features
    : map.features.filter((f) => opts.ids.includes(f.id));

  if (selected.length === 0) {
    console.error("Usage: npm run verify:web -- <feature-id> | --all | --list [--base-url URL]");
    process.exit(2);
  }

  const outAbs = path.resolve(ROOT, opts.outDir);
  fs.mkdirSync(outAbs, { recursive: true });
  const results: FeatureResult[] = [];

  for (const feature of selected) {
    let result: FeatureResult;
    if (feature.id === "health-api") result = await verifyHealthApi(opts.baseUrl, feature);
    else if (feature.id === "mcp-endpoint") result = await verifyMcpEndpoint(opts.baseUrl, feature);
    else result = await verifyBrowserFeature(ROOT, opts.baseUrl, opts.outDir, feature);

    const reportRel = path.join(opts.outDir, `${feature.id}.json`).replaceAll("\\", "/");
    result.reportFile = reportRel;
    fs.writeFileSync(path.resolve(ROOT, reportRel), JSON.stringify(result, null, 2));
    results.push(result);
  }

  const summary = {
    status: results.every((r) => r.status === "pass") ? "pass" : "fail",
    browser: findBrowser(),
    baseUrl: opts.baseUrl,
    total: results.length,
    passed: results.filter((r) => r.status === "pass").length,
    failed: results.filter((r) => r.status === "fail").length,
    results,
  };
  fs.writeFileSync(path.join(outAbs, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.status === "pass" ? 0 : 1);
}

main().catch((err) => {
  console.error("[verify-web] ERROR:", err);
  process.exit(1);
});
