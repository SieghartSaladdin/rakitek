import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkFidelityEvidence } from "./lint-evidence";
import { checkRegistryImports, type ImportLintIssue } from "./lint-imports";
import { checkUtilityClasses } from "./lint-utility-classes";
import { checkReuse } from "./lint-reuse";
import { checkLintSuppressions } from "./lint-suppressions";

function writeFile(root: string, relPath: string, content: string) {
  const full = path.join(root, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

function makeFixture(
  files: Record<string, string>,
): { root: string; run: () => ImportLintIssue[]; cleanup: () => void } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rakitek-lint-test-"));
  for (const [relPath, content] of Object.entries(files)) {
    writeFile(root, relPath, content);
  }
  return {
    root,
    run: () => {
      const issues: ImportLintIssue[] = [];
      checkRegistryImports(root, issues);
      return issues;
    },
    cleanup: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

function runTests() {
  // 1. Valid local helper + valid @registry organism -> atom with synced composes
  {
    const fx = makeFixture({
      "registry/ui/demo-atom/meta.json": JSON.stringify({ id: "demo-atom", level: "atom", composes: [] }),
      "registry/ui/demo-atom/component.tsx": "export function DemoAtom() { return null; }\n",
      "registry/sections/demo-org/meta.json": JSON.stringify({
        id: "demo-org",
        level: "organism",
        composes: ["ui/demo-atom"],
      }),
      "registry/sections/demo-org/helper.ts": "export const VAL = 1;\n",
      "registry/sections/demo-org/component.tsx": [
        'import { VAL } from "./helper";',
        "import {",
        "  DemoAtom,",
        '} from "@registry/ui/demo-atom/component";',
        "export function DemoOrg() { return [VAL, DemoAtom]; }",
      ].join("\n"),
    });
    try {
      const issues = fx.run();
      assert.equal(issues.length, 0, `Expected 0 issues for valid fixture, got: ${JSON.stringify(issues)}`);
    } finally {
      fx.cleanup();
    }
  }

  // 2. Relative parent escape "../" fails rakitek/imports-resolvable
  {
    const fx = makeFixture({
      "registry/ui/demo-atom/meta.json": JSON.stringify({ id: "demo-atom", level: "atom", composes: [] }),
      "registry/ui/demo-atom/component.tsx": "export const A = 1;\n",
      "registry/ui/bad-escape/meta.json": JSON.stringify({ id: "bad-escape", level: "molecule", composes: [] }),
      "registry/ui/bad-escape/component.tsx": 'import { A } from "../demo-atom/component";\nexport const B = A;\n',
    });
    try {
      const issues = fx.run();
      assert.ok(
        issues.some((i) => i.rule === "rakitek/imports-resolvable"),
        `Expected imports-resolvable failure, got: ${JSON.stringify(issues)}`,
      );
    } finally {
      fx.cleanup();
    }
  }

  // 3. Hierarchy violation (atom importing molecule inside ui/ via target meta.json) fails atomic-hierarchy
  {
    const fx = makeFixture({
      "registry/ui/demo-mol/meta.json": JSON.stringify({ id: "demo-mol", level: "molecule", composes: [] }),
      "registry/ui/demo-mol/component.tsx": "export const M = 1;\n",
      "registry/ui/bad-atom/meta.json": JSON.stringify({
        id: "bad-atom",
        level: "atom",
        composes: ["ui/demo-mol"],
      }),
      "registry/ui/bad-atom/component.tsx": 'import { M } from "@registry/ui/demo-mol/component";\nexport const X = M;\n',
    });
    try {
      const issues = fx.run();
      assert.ok(
        issues.some((i) => i.rule === "rakitek/atomic-hierarchy"),
        `Expected atomic-hierarchy failure, got: ${JSON.stringify(issues)}`,
      );
    } finally {
      fx.cleanup();
    }
  }

  // 4. composes mismatch (both missing imported ref and phantom unused composes entry) fails composes-sync
  {
    const fx = makeFixture({
      "registry/ui/demo-atom/meta.json": JSON.stringify({ id: "demo-atom", level: "atom", composes: [] }),
      "registry/ui/demo-atom/component.tsx": "export const A = 1;\n",
      "registry/sections/bad-sync/meta.json": JSON.stringify({
        id: "bad-sync",
        level: "organism",
        composes: ["ui/phantom-atom"],
      }),
      "registry/sections/bad-sync/component.tsx": 'import { A } from "@registry/ui/demo-atom/component";\nexport const B = A;\n',
    });
    try {
      const issues = fx.run();
      const syncIssues = issues.filter((i) => i.rule === "rakitek/composes-sync");
      assert.equal(
        syncIssues.length,
        2,
        `Expected 2 composes-sync issues (missing + unused), got: ${JSON.stringify(issues)}`,
      );
    } finally {
      fx.cleanup();
    }
  }

  // Case 5: fidelity-evidence. A section without proof fails; a template only needs REPORT.md.
  {
    const fx = makeFixture({
      "registry/sections/no-proof/component.tsx": "export const A = 1;\n",
      "registry/sections/has-proof/component.tsx": "export const B = 1;\n",
      "fidelity/has-proof/REPORT.md": "ok\n",
      "fidelity/has-proof/original-1920.json": "{}",
      "fidelity/has-proof/extract-1920.json": "{}",
      "fidelity/has-proof/original-1024.json": "{}",
      "fidelity/has-proof/extract-1024.json": "{}",
      "registry/templates/shell/component.tsx": "export const C = 1;\n",
      "fidelity/shell/REPORT.md": "ok\n",
    });
    try {
      const issues: ImportLintIssue[] = [];
      checkFidelityEvidence(fx.root, issues);
      assert.equal(issues.length, 1, `Expected only no-proof to fail, got: ${JSON.stringify(issues)}`);
      assert.equal(issues[0].rule, "rakitek/fidelity-evidence");
      assert.ok(issues[0].file.includes("no-proof"));
    } finally {
      fx.cleanup();
    }
  }

  // Case 6: no-global-utility-class. Tailwind utilities fail; module classes and library classes (swiper) pass.
  {
    const fx = makeFixture({
      "registry/sections/leaky/meta.json": JSON.stringify({ styling: "css-modules" }),
      "registry/sections/leaky/component.tsx":
        'export const A = () => <h2 className="sr-only">x</h2>;\nexport const B = () => <div className={`flex ${s.a} md:grid`} />;\n',
      "registry/sections/clean/meta.json": JSON.stringify({ styling: "css-modules" }),
      "registry/sections/clean/component.tsx":
        'export const C = () => <div className={`swiper-slide ${s.a}`}><div className="swiper-wrapper" /></div>;\n',
    });
    try {
      const issues: ImportLintIssue[] = [];
      checkUtilityClasses(fx.root, issues);
      const tokens = issues.map((i) => i.message.match(/"([^"]+)"/)?.[1]).sort();
      assert.deepEqual(tokens, ["flex", "md:grid", "sr-only"], `Unexpected utility-class issues: ${JSON.stringify(issues)}`);
      assert.ok(issues.every((i) => i.file.includes("leaky")), "Clean component must not be flagged");
    } finally {
      fx.cleanup();
    }
  }

  // Case 7: reuse rules. A section without roles fails section-roles; a baked "$" in output fails
  // no-hardcoded-currency, while demo-data price strings, comments and the default formatter pass.
  {
    const fx = makeFixture({
      "registry/sections/coffee-only/meta.json": JSON.stringify({ id: "coffee-only", roles: [] }),
      "registry/sections/coffee-only/component.tsx":
        'export const A = ({ p }) => <b title={`Buy (${"$"}${p})`}>{"$" + p}</b>;\nexport const B = ({ p }) => <i>{`$${p ?? 28}`}</i>;\n',
      "registry/sections/reusable/meta.json": JSON.stringify({ id: "reusable", roles: ["offerings"] }),
      "registry/sections/reusable/component.tsx":
        'const DEFAULTS = [{ price: "$24.00" }];\n/** Default: `$${value}` */\nconst defaultFormatPrice = (v: number) => `$${v}`;\nexport const C = ({ formatPrice = defaultFormatPrice, p }) => <b>{formatPrice(p)}</b>;\n',
    });
    try {
      const issues: ImportLintIssue[] = [];
      checkReuse(fx.root, issues);
      const got = issues.map((i) => `${i.rule}@${i.file.split("/")[2]}:${i.line}`).sort();
      assert.deepEqual(
        got,
        [
          "rakitek/no-hardcoded-currency@coffee-only:1",
          "rakitek/no-hardcoded-currency@coffee-only:2",
          "rakitek/section-roles@coffee-only:1",
        ],
        `Unexpected reuse issues: ${JSON.stringify(issues)}`,
      );
    } finally {
      fx.cleanup();
    }
  }

  // Case 8: no-lint-suppression. Real past suppression comments fail; clean comments and string literals pass.
  {
    const esNext = ["eslint", "disable-next-line"].join("-");
    const tsIgn = "@" + "ts-ignore";
    const fx = makeFixture({
      "registry/sections/bad-suppress/component.tsx": [
        `// ${esNext} react-hooks/exhaustive-deps`,
        `export const A = () => <div>{/* ${esNext} @next/next/no-img-element */}<img alt='' /></div>;`,
        `// ${tsIgn}`,
        "export const B = 1;",
      ].join("\n"),
      "apps/web/src/clean.ts": [
        "// Normal explanation comment without any suppression directive",
        `export const note = "// ${esNext} inside a string literal";`,
      ].join("\n"),
    });
    try {
      const issues: ImportLintIssue[] = [];
      checkLintSuppressions(fx.root, issues);
      const got = issues.map((i) => `${i.rule}@${i.file}:${i.line}`);
      assert.deepEqual(
        got,
        [
          "rakitek/no-lint-suppression@registry/sections/bad-suppress/component.tsx:1",
          "rakitek/no-lint-suppression@registry/sections/bad-suppress/component.tsx:2",
          "rakitek/no-lint-suppression@registry/sections/bad-suppress/component.tsx:3",
        ],
        `Unexpected suppression issues: ${JSON.stringify(issues)}`,
      );
    } finally {
      fx.cleanup();
    }
  }

  console.log("[rakitek lint-rules test] All 8 synthetic lint rule assertions passed.");
}

runTests();
