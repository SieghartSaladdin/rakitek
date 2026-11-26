import assert from "node:assert/strict";
import { loadCatalog } from "./loader.js";
import { RAKITEK_INSTRUCTIONS } from "./server.js";
import { suggestBlueprintResult } from "./tools/blueprint.js";
import {
  getComponentBundle,
  getComponentReply,
  getComponentResult,
  OUTPUT_BUDGET_CHARS,
  searchComponentsResult,
} from "./tools/components.js";
import { planPageResult } from "./tools/plan.js";
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
  assert.ok(hero.dependencies.gsap?.startsWith("^"), "Expected pinned gsap version on high-fidelity hero");
  assert.ok(hero.installCommand?.includes('"gsap@^'), "Expected installCommand to pin gsap version");

  assert.ok(roastery.baseCss && roastery.baseCss.includes("box-sizing"), "get_style must ship base reset CSS");
  assert.ok(!roastery.baseCss.includes("--theme("), "base CSS must be plain CSS without Tailwind functions");
  assert.ok(
    roastery.primitives?.["smooth-scroll-provider.tsx"]?.includes("SmoothScrollProvider"),
    "get_style must ship the SmoothScrollProvider primitive",
  );
  assert.equal(getStyleResult("editorial-roastery", false).baseCss, undefined, "includeSetup:false skips setup");
  // The provider must import lenis statically (a computed import is skipped by bundlers) and pin it for setup.
  assert.match(roastery.primitives?.["smooth-scroll-provider.tsx"] ?? "", /import Lenis from "lenis"/);
  assert.match(roastery.setupInstallCommand ?? "", /"lenis@\^\d/, "setupInstallCommand must pin lenis");
  assert.ok(!("react" in (roastery.dependencyVersions ?? {})), "get_style lists only setup packages, not every registry dependency");

  const pageBundle = getComponentBundle("storefront-demo-page", true);
  const bundleIds = pageBundle.map((r) => r.id);
  assert.equal(bundleIds.at(-1), "storefront-demo-page", "Requested item comes last, after its dependencies");
  assert.ok(bundleIds.includes("editorial-storefront-hero"), "Page bundle must include composed sections");
  assert.equal(new Set(bundleIds).size, bundleIds.length, "Bundle must not repeat components");
  assert.equal(getComponentBundle("storefront-demo-page", false).length, 1, "withComposed:false returns one item");

  // withComposed:false must name every imported child it did not ship.
  const catalogAll = [...loadCatalog().ui, ...loadCatalog().sections];
  const parent = catalogAll.find((c) => c.kind === "section" && (c.composes ?? []).length > 0);
  assert.ok(parent, "Expected a section that composes another component");
  const headerOf = (args: Parameters<typeof getComponentReply>[0]) => JSON.parse(getComponentReply(args)[0].text);
  const lean = headerOf({ id: parent.id, withComposed: false });
  const childIds = (parent.composes ?? []).map((ref) => ref.split("/")[1]);
  assert.deepEqual([...lean.alsoNeeded].sort(), [...childIds].sort(), "alsoNeeded must list the children left out");
  assert.ok(!("alsoNeeded" in headerOf({ id: parent.id })), "A full bundle has nothing left to fetch");

  const blueprint = suggestBlueprintResult("coffee-shop");
  assert.equal(blueprint.style.id, "editorial-roastery");
  assert.equal(blueprint.basePage, "storefront-demo-page");
  assert.equal(blueprint.stack[0]?.slot, "navbar", "Stack must be ordered, navbar first");
  assert.equal(new Set(blueprint.stack.map((s) => s.id)).size, blueprint.stack.length, "One pick per slot");
  const saas = suggestBlueprintResult("saas");
  assert.equal(saas.basePage, "waitlist-landing-demo-page");
  assert.equal(saas.stack.filter((s) => s.slot === "hero").length, 1, "Exactly one hero in a blueprint");
  assert.ok("note" in suggestBlueprintResult("travel"), "Unknown niche must say it fell back to a default");

  // plan_page: a brief outside every demo still gets slots filled from across the registry.
  const company = planPageResult({ brief: "company profile untuk studio arsitektur di Bandung" });
  assert.equal(company.pageType, "company-profile");
  assert.ok(!("pageTypeNote" in company), "A company brief must match the company-profile page type");
  const slotOf = (role: string) => company.slots.find((s) => s.role === role);
  assert.ok(slotOf("offerings")?.candidates.some((c) => c.id === "collection-split-showcase"), "Storefront showcase must be offered for services");
  assert.ok(slotOf("about")?.candidates.some((c) => c.id === "editorial-mission-split"), "Mission split must be offered for about");
  assert.ok(!company.slots.some((s) => s.role === "cart" || s.role === "engagement"), "Company profile must not ask for a cart or quiz");
  for (const s of company.slots.filter((x) => x.pick)) {
    assert.ok(s.candidates[0]?.id === s.pick, `Slot ${s.role}: pick must be the first candidate`);
  }
  const picks = company.slots.map((s) => s.pick).filter(Boolean);
  assert.equal(new Set(picks).size, picks.length, "A section must not be picked for two slots");
  const navPick = slotOf("navigation")?.pick;
  assert.ok(navPick, "Navigation slot must have a pick");
  assert.ok(company.shell.template, `Shell must fit navbar ${navPick}`);
  const navHosts = (loadCatalog().pages ?? []).filter((p) => p.composes?.includes(`sections/${navPick}`));
  assert.ok(navHosts.some((p) => p.composes?.includes(`templates/${company.shell.template}`)), "Shell must come from a page that uses the picked navbar");
  // The shell must be verified in the chosen style, whatever style is forced.
  for (const s of loadCatalog().styles) {
    const forced = planPageResult({ brief: "company profile untuk studio arsitektur", styleId: s.id });
    const tpl = forced.shell.template;
    if (tpl) {
      const entry = (loadCatalog().templates ?? []).find((t) => t.id === tpl);
      assert.ok(entry?.recommendedStyles.includes(s.id), `Shell ${tpl} is not verified in style ${s.id}`);
    }
  }
  assert.equal(planPageResult({ brief: "landing buat startup aplikasi" }).pageType, "saas");
  assert.equal(planPageResult({ brief: "toko kopi" }).pageType, "storefront");
  assert.ok("pageTypeNote" in planPageResult({ brief: "xyz" }), "Unmatched brief must say it fell back");
  assert.equal(planPageResult({ brief: "xyz", pageType: "waitlist" }).pageType, "waitlist");
  const roleRows = searchComponentsResult({ role: "offerings" });
  assert.ok(roleRows.length >= 2 && roleRows.every((r) => r.roles?.includes("offerings")), "role filter must match roles");

  // A page reply must stay under Claude Code's 25k-token tool output limit (dumped to file otherwise).
  assert.ok(OUTPUT_BUDGET_CHARS <= 40_000, "get_component budget must stay well under 25k tokens");

  // Instructions ride along on every turn in Claude Code and Antigravity, so keep them ~400 tokens.
  assert.ok(RAKITEK_INSTRUCTIONS.length < 1600, `Server instructions too long: ${RAKITEK_INSTRUCTIONS.length} chars`);
  for (const tool of ["plan_page", "suggest_page_blueprint", "get_style", "get_component"]) {
    assert.ok(RAKITEK_INSTRUCTIONS.includes(tool), `Instructions must mention ${tool}`);
  }

  assertAllComponentImportsResolvable();

  console.log("[rakitek-mcp test] All tool, setup, bundle, plan, blueprint & import-resolution assertions passed.");
}

runTests();
