import fs from "node:fs";
import path from "node:path";
import type { ImportLintIssue } from "./lint-imports";

const ESLINT_DIRECTIVE = ["eslint", "disable"].join("-");
const TS_DIRECTIVE = "@" + "ts-";
const SUPPRESSION_RE = new RegExp(
  `(?:\\b${ESLINT_DIRECTIVE}(?:-next-line|-line)?\\b|${TS_DIRECTIVE}(?:ignore|nocheck|expect-error)\\b)`,
);
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"]);
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", ".generated", "generated"]);

function walkSourceFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkSourceFiles(full, out);
    else if (EXTS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function collectCommentsPerLine(lines: string[]): string[] {
  const result: string[] = [];
  let inBlock = false;

  for (const line of lines) {
    let comment = "";
    let i = 0;
    while (i < line.length) {
      if (inBlock) {
        const end = line.indexOf("*/", i);
        if (end === -1) {
          comment += line.slice(i);
          break;
        }
        comment += line.slice(i, end);
        inBlock = false;
        i = end + 2;
        continue;
      }

      const ch = line[i];
      if (ch === "'" || ch === '"' || ch === "`") {
        i += 1;
        while (i < line.length) {
          if (line[i] === "\\") {
            i += 2;
            continue;
          }
          if (line[i] === ch) {
            i += 1;
            break;
          }
          i += 1;
        }
        continue;
      }

      if (ch === "/" && line[i + 1] === "/") {
        comment += line.slice(i + 2);
        break;
      }

      if (ch === "/" && line[i + 1] === "*") {
        inBlock = true;
        i += 2;
        continue;
      }

      i += 1;
    }
    result.push(comment);
  }

  return result;
}

export function checkLintSuppressions(root: string, issues: ImportLintIssue[]) {
  const targets = [
    path.join(root, "apps", "web", "src"),
    path.join(root, "registry"),
    path.join(root, "scripts"),
    path.join(root, "packages", "mcp", "src"),
  ];

  for (const base of targets) {
    for (const file of walkSourceFiles(base)) {
      const relPath = path.relative(root, file).replaceAll("\\", "/");
      const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
      const comments = collectCommentsPerLine(lines);

      comments.forEach((comment, idx) => {
        const match = SUPPRESSION_RE.exec(comment);
        if (!match) return;
        issues.push({
          rule: "rakitek/no-lint-suppression",
          file: relPath,
          line: idx + 1,
          message: `Inline suppression "${match[0]}" is banned because it hides root causes and teaches AI agents to copy bypasses. Fix the underlying type, hook dependency, or DOM issue directly instead.`,
        });
      });
    }
  }
}
