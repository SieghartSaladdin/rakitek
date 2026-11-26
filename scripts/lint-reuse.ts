import fs from "node:fs";
import path from "node:path";
import type { ImportLintIssue } from "./lint-imports";

// Rules that keep sections reusable outside the site they were extracted from.
//
// rakitek/section-roles: every section declares at least one content role in
// meta.json, so plan_page can offer it for slots of other kinds of sites.
//
// rakitek/no-hardcoded-currency: a component must not bake a currency into its
// output ("$28", `$${price}`). Prices go through a formatPrice prop; only the line
// that defines the default formatter (its name contains "formatPrice") may use "$".
// Formatting patterns only: price strings inside default demo data ("$24.00") are prop values, not formatting.
const CURRENCY_RE = /\$\$\{|>\$\{|\+\s*["']\$["']|["']\$["']\s*\+/;
const COMMENT_RE = /^\s*(\/\/|\/?\*)/;

export function checkReuse(root: string, issues: ImportLintIssue[]) {
  const sectionsDir = path.join(root, "registry", "sections");
  if (fs.existsSync(sectionsDir)) {
    for (const id of fs.readdirSync(sectionsDir)) {
      const metaPath = path.join(sectionsDir, id, "meta.json");
      if (!fs.existsSync(metaPath)) continue;
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as { roles?: unknown };
      if (!Array.isArray(meta.roles) || meta.roles.length === 0) {
        issues.push({
          rule: "rakitek/section-roles",
          file: `registry/sections/${id}/meta.json`,
          line: 1,
          message:
            'Section has no "roles". Add what it communicates (e.g. ["offerings"], ["about","story"]) so plan_page can offer it to other kinds of sites.',
        });
      }
    }
  }

  for (const folder of ["ui", "sections"]) {
    const base = path.join(root, "registry", folder);
    if (!fs.existsSync(base)) continue;
    for (const id of fs.readdirSync(base)) {
      const file = path.join(base, id, "component.tsx");
      if (!fs.existsSync(file)) continue;
      fs.readFileSync(file, "utf8")
        .split(/\r?\n/)
        .forEach((line, i) => {
          // The default formatter itself may keep the original "$" format.
          if (CURRENCY_RE.test(line) && !COMMENT_RE.test(line) && !/format\w*price/i.test(line)) {
            issues.push({
              rule: "rakitek/no-hardcoded-currency",
              file: `registry/${folder}/${id}/component.tsx`,
              line: i + 1,
              message:
                "Currency baked into component output. Accept a formatPrice prop (default may keep the original format) instead of a literal $.",
            });
          }
        });
    }
  }
}
