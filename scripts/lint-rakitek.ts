import fs from "node:fs";
import path from "node:path";
import { checkFidelityEvidence } from "./lint-evidence";
import { checkUtilityClasses } from "./lint-utility-classes";
import { checkRegistryImports } from "./lint-imports";
import { checkReuse } from "./lint-reuse";
import { checkLintSuppressions } from "./lint-suppressions";

interface LintIssue {
  rule: string;
  file: string;
  line: number;
  message: string;
}

const ROOT = path.resolve(process.cwd());
const MAX_LINES = 260;

const BUZZWORD_RE = /\b(ai[- ]powered|seamless|revolutionary|cutting[- ]edge|next[- ]generation|unlock)\b/i;
const HEX_COLOR_RE = /#[0-9a-fA-F]{3,8}\b/;
const BANNER_COMMENT_RE = /(\/\/|\/\*)\s*(===+|---+)/;

function walkFiles(dir: string, exts: Set<string>, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", "dist", ".generated", "generated"].includes(entry.name)) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, exts, out);
    else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function rel(filePath: string): string {
  return path.relative(ROOT, filePath).replaceAll("\\", "/");
}

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function contrastRatio(hexA: string, hexB: string): number {
  const lum = (hex: string) => {
    const clean = hex.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const n = parseInt(full.slice(0, 6), 16);
    return (
      0.2126 * linearize((n >> 16) & 255) +
      0.7152 * linearize((n >> 8) & 255) +
      0.0722 * linearize(n & 255)
    );
  };
  const l1 = Math.max(lum(hexA), lum(hexB));
  const l2 = Math.min(lum(hexA), lum(hexB));
  return (l1 + 0.05) / (l2 + 0.05);
}

function checkStyleTokens(issues: LintIssue[]) {
  const stylesDir = path.join(ROOT, "registry", "styles");
  for (const file of walkFiles(stylesDir, new Set([".css"]))) {
    const content = fs.readFileSync(file, "utf8");
    const vars: Record<string, string> = {};
    for (const match of content.matchAll(/(--rk-[a-z-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
      vars[match[1]] = match[2];
    }

    const checks: Array<[string, string, string]> = [
      ["--rk-fg", "--rk-bg", "fg on bg"],
      ["--rk-fg-muted", "--rk-bg", "fg-muted on bg"],
      ["--rk-fg-muted", "--rk-surface", "fg-muted on surface"],
      ["--rk-accent-fg", "--rk-accent", "accent-fg on accent"],
    ];

    for (const [fgKey, bgKey, label] of checks) {
      if (!vars[fgKey] || !vars[bgKey]) continue;
      const ratio = contrastRatio(vars[fgKey], vars[bgKey]);
      if (ratio < 4.5) {
        issues.push({
          rule: "antislop/wcag-aa-contrast (R-25)",
          file: rel(file),
          line: 1,
          message: `${label} (${vars[fgKey]} on ${vars[bgKey]}) contrast is ${ratio.toFixed(2)}:1 (< 4.5:1)`,
        });
      }
    }
  }
}

function checkSourceFiles(issues: LintIssue[]) {
  const targets = [
    path.join(ROOT, "apps", "web", "src"),
    path.join(ROOT, "registry"),
    path.join(ROOT, "scripts"),
    path.join(ROOT, "packages", "mcp", "src"),
  ];
  const exts = new Set([".ts", ".tsx", ".css"]);

  for (const base of targets) {
    for (const file of walkFiles(base, exts)) {
      const rPath = rel(file);
      const raw = fs.readFileSync(file, "utf8");
      const lines = raw.split(/\r?\n/);

      if (lines.length > MAX_LINES) {
        issues.push({
          rule: "rakitek/max-file-lines",
          file: rPath,
          line: lines.length,
          message: `File has ${lines.length} lines (limit ${MAX_LINES}); split into smaller modules.`,
        });
      }

      const isUiOrSectionSource =
        /^registry\/(ui|sections|templates|pages)\/[^/]+\/(component\.tsx|styles\.module\.css)$/.test(
          rPath,
        );
      const isUiOrSectionComponent =
        /^registry\/(ui|sections|templates|pages)\/[^/]+\/component\.tsx$/.test(rPath);
      const isUiCopyFile =
        rPath.startsWith("apps/web/src/") || rPath.startsWith("registry/");

      lines.forEach((line, idx) => {
        const lineNo = idx + 1;

        if (isUiCopyFile && line.includes("\u2014")) {
          issues.push({
            rule: "antislop/no-em-dash (R-02)",
            file: rPath,
            line: lineNo,
            message: "Em dash found in UI/registry file; use comma, period, or colon.",
          });
        }

        if (rPath.startsWith("apps/web/src/") && line.includes("text-zinc-500")) {
          issues.push({
            rule: "antislop/wcag-aa-contrast (R-25)",
            file: rPath,
            line: lineNo,
            message: "text-zinc-500 fails 4.5:1 on dark shell (#0c0c0e/#141418); use text-zinc-400 or lighter.",
          });
        }

        if (isUiCopyFile && line.includes("outline-none") && !line.includes("focus-visible:")) {
          issues.push({
            rule: "antislop/no-bare-outline-none (R-32)",
            file: rPath,
            line: lineNo,
            message: "outline-none used without a visible focus-visible indicator.",
          });
        }

        if (isUiCopyFile && BUZZWORD_RE.test(line)) {
          const hit = line.match(BUZZWORD_RE)?.[0];
          issues.push({
            rule: "antislop/no-ai-buzzwords (R-16)",
            file: rPath,
            line: lineNo,
            message: `Avoid AI buzzword "${hit}"; use direct, concrete language.`,
          });
        }

        if (isUiOrSectionSource && HEX_COLOR_RE.test(line)) {
          issues.push({
            rule: "rakitek/no-hardcoded-hex",
            file: rPath,
            line: lineNo,
            message: "Hardcoded hex color in registry component/styles; use var(--rk-*) tokens.",
          });
        }

        if (isUiOrSectionComponent && /\bnew\s+Lenis\b/.test(line)) {
          issues.push({
            rule: "rakitek/no-local-lenis",
            file: rPath,
            line: lineNo,
            message: "Do not instantiate Lenis inside a component; use SmoothScrollProvider.",
          });
        }

        if (BANNER_COMMENT_RE.test(line)) {
          issues.push({
            rule: "antislop/no-decorative-comment-banner",
            file: rPath,
            line: lineNo,
            message: "Remove decorative === or --- separator comment.",
          });
        }
      });
    }
  }
}

function main() {
  const issues: LintIssue[] = [];
  checkStyleTokens(issues);
  checkSourceFiles(issues);
  checkRegistryImports(ROOT, issues);
  checkFidelityEvidence(ROOT, issues);
  checkUtilityClasses(ROOT, issues);
  checkReuse(ROOT, issues);
  checkLintSuppressions(ROOT, issues);

  if (issues.length === 0) {
    console.log("[rakitek lint] PASS: 0 issues.");
    return;
  }

  console.error(`[rakitek lint] FAIL: ${issues.length} issue(s) found:\n`);
  for (const issue of issues) {
    console.error(`- ${issue.file}:${issue.line} [${issue.rule}] ${issue.message}`);
  }
  process.exit(1);
}

main();
