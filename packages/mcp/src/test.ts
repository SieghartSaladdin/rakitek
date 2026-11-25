import assert from "node:assert/strict";
import { loadCatalog } from "./loader.js";
import { suggestBlueprintResult } from "./tools/blueprint.js";
import { getComponentResult, searchComponentsResult } from "./tools/components.js";
import { getStyleResult, listStylesResult } from "./tools/styles.js";

const RELATIVE_IMPORT_RE =
  /(?:(?:import|export)\s+(?:[^"'`]+?\s+from\s+)?|import\s*\(\s*|@import\s+(?:url\s*\(\s*)?)["'](\.[^"']+)["']/g;
const REGISTRY_IMPORT_RE =
  /(?:(?:import|export)\s+(?:[^"'`]+?\s+from\s+)?|import\s*\(\s*)["'](@registry\/[^"']+)["']/g;

function extractMatches(source: string, re: RegExp): string[] {
  const hits: string[] = [];
  for (const match of source.matchAll(re)) {
    if (match[1]) hits.push(match[1]);
  }
  return hits;
}

function resolveBundledTarget(specifier: string, bundledFiles: Set<string>): boolean {
  if (!specifier.startsWith("./")) return false;
  const base = specifier.slice(2);
  if (bundledFiles.has(base)) return true;
  for (const ext of [".ts", ".tsx", ".css"]) {
    if (bundledFiles.has(`${base}${ext}`)) return true;
  }
  return false;
}

function assertAllComponentImportsResolvable() {
  const catalog = loadCatalog();
  const all = [
    ...catalog.ui,
    ...catalog.sections,
    ...(catalog.templates ?? []),
    ...(catalog.pages ?? []),
  ];
  let multiFileComponents = 0;

  for (const entry of all) {
    const result = getComponentResult(entry.id);
    const bundled = new Map<string, string>([["component.tsx", result.code]]);
    if (result.stylesCss !== undefined) {
      bundled.set("styles.module.css", result.stylesCss);
    }
    if (result.extraFiles) {
      multiFileComponents += 1;
      for (const [name, content] of Object.entries(result.extraFiles)) {
        bundled.set(name, content);
      }
    }

    const bundledNames = new Set(bundled.keys());
    const composedByImport = new Map(
      (result.composedComponents ?? []).map((dep) => [dep.importPath, dep]),
    );

    for (const [fileName, content] of bundled.entries()) {
      for (const spec of extractMatches(content, RELATIVE_IMPORT_RE)) {
        assert.ok(
          resolveBundledTarget(spec, bundledNames),
          `[${entry.id}] Unresolved relative import "${spec}" in ${fileName}; returned files: ${[...bundledNames].join(", ")}`,
        );
      }
      for (const regSpec of extractMatches(content, REGISTRY_IMPORT_RE)) {
        const dep = composedByImport.get(regSpec);
        assert.ok(
          dep,
          `[${entry.id}] Cross-component import "${regSpec}" in ${fileName} is missing from composedComponents`,
        );
        const depResult = getComponentResult(dep.id);
        assert.ok(depResult.code.length > 0, `[${entry.id}] Failed to resolve composed dep "${dep.id}"`);
      }
    }
  }

  assert.ok(
    multiFileComponents >= 1,
    "Expected at least one multi-file component with bundled extraFiles",
  );
}

function runTests() {
  const styles = listStylesResult();
  assert.ok(styles.length >= 2, "Expected at least 2 starter styles");

  const roastery = getStyleResult("editorial-roastery");
  assert.ok(roastery.tokensCss.includes("--rk-bg:"), "Style tokensCss must define --rk-bg");

  const uiButtons = searchComponentsResult({ kind: "ui", category: "button" });
  assert.ok(uiButtons.length >= 2, "Expected at least 2 button variants");

  const atoms = searchComponentsResult({ level: "atom" });
  const molecules = searchComponentsResult({ level: "molecule" });
  const organisms = searchComponentsResult({ level: "organism" });
  assert.ok(atoms.length >= 3, "Expected at least 3 atoms");
  assert.ok(molecules.length >= 2, "Expected at least 2 molecules");
  assert.ok(organisms.length >= 18, "Expected at least 18 organisms");
  assert.ok(atoms.every((a) => a.level === "atom"), "Level filter must return only atoms");

  const quiz = getComponentResult("interactive-quiz");
  assert.ok(quiz.code.includes("InteractiveQuiz"), "Expected InteractiveQuiz source code");
  assert.ok(quiz.usageExample.includes("InteractiveQuiz"), "Expected InteractiveQuiz usage example");

  const hero = getComponentResult("editorial-storefront-hero");
  assert.equal(hero.styling, "css-modules", "Expected css-modules styling mode on high-fidelity hero");
  assert.ok(hero.stylesCss && hero.stylesCss.includes("var(--rk-"), "Expected token-bound stylesCss");
  assert.ok(hero.dependencies.includes("gsap"), "Expected gsap dependency on high-fidelity hero");
  assert.ok(hero.installCommand?.includes("gsap"), "Expected installCommand to include gsap");

  const blueprint = suggestBlueprintResult("coffee-shop");
  assert.equal(blueprint.recommendedStyle.id, "editorial-roastery");
  assert.ok(blueprint.sections.length >= 1, "Expected recommended sections");

  assertAllComponentImportsResolvable();

  console.log("[rakitek-mcp test] All 6 tool & import-resolution assertions passed.");
}

runTests();
