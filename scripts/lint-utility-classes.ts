import fs from "node:fs";
import path from "node:path";
import type { ImportLintIssue } from "./lint-imports";

// rakitek/no-global-utility-class: a css-modules component must not rely on Tailwind
// utility classes. The showcase generates them (it scans registry/), so the bug is
// invisible there, but a user's project without Tailwind renders them unstyled.
// Found by the MCP end-to-end build: `className="sr-only"` showed a hidden heading.
const UTILITY =
  /^(sr-only|not-sr-only|flex|inline-flex|grid|inline-grid|hidden|block|inline-block|absolute|relative|fixed|sticky|container|truncate|(w|h|size|min-w|max-w|min-h|max-h|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-x|space-y|text|bg|border|rounded|shadow|font|leading|tracking|z|top|left|right|bottom|inset|opacity|items|justify|self|place|col|row|overflow|object|aspect|translate|scale|rotate|duration|ease|transition)-[\w./[\]%-]+)$/;
const FOLDERS = ["ui", "sections", "templates", "pages"];

function literalClassTokens(source: string): Array<{ token: string; index: number }> {
  const hits: Array<{ token: string; index: number }> = [];
  const patterns = [/className="([^"]*)"/g, /className=\{`([^`]*)`\}/g, /className=\{"([^"]*)"\}/g];
  for (const re of patterns) {
    for (const m of source.matchAll(re)) {
      const staticPart = m[1].replace(/\$\{[^}]*\}/g, " ");
      for (const token of staticPart.split(/\s+/).filter(Boolean)) {
        hits.push({ token, index: m.index ?? 0 });
      }
    }
  }
  return hits;
}

export function checkUtilityClasses(root: string, issues: ImportLintIssue[]) {
  for (const folder of FOLDERS) {
    const base = path.join(root, "registry", folder);
    if (!fs.existsSync(base)) continue;
    for (const id of fs.readdirSync(base)) {
      const dir = path.join(base, id);
      if (!fs.statSync(dir).isDirectory()) continue;
      const metaPath = path.join(dir, "meta.json");
      const styling = fs.existsSync(metaPath)
        ? (JSON.parse(fs.readFileSync(metaPath, "utf8")) as { styling?: string }).styling
        : "css-modules";
      if (styling !== "css-modules") continue;
      for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith(".tsx") || name === "preview.tsx") continue;
        const source = fs.readFileSync(path.join(dir, name), "utf8");
        for (const { token, index } of literalClassTokens(source)) {
          if (!UTILITY.test(token) && !token.includes(":")) continue;
          issues.push({
            rule: "rakitek/no-global-utility-class",
            file: `registry/${folder}/${id}/${name}`,
            line: source.slice(0, index).split("\n").length,
            message: `Class global "${token}" tidak ada di proyek tanpa Tailwind. Pindahkan ke styles.module.css.`,
          });
        }
      }
    }
  }
}
