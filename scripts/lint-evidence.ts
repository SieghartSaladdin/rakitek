import fs from "node:fs";
import path from "node:path";
import type { ImportLintIssue } from "./lint-imports";

// rakitek/fidelity-evidence: every registry component ships with fidelity proof.
// Templates have no original page to compare against, so they only need REPORT.md
// (shell geometry). Everything else needs original + extract JSON at both widths.
const REQUIRED_WIDTHS = [1920, 1024];
const FOLDERS = ["ui", "sections", "templates", "pages"];

export function checkFidelityEvidence(root: string, issues: ImportLintIssue[]) {
  for (const folder of FOLDERS) {
    const base = path.join(root, "registry", folder);
    if (!fs.existsSync(base)) continue;
    for (const id of fs.readdirSync(base)) {
      if (!fs.statSync(path.join(base, id)).isDirectory()) continue;
      const evidenceDir = path.join(root, "fidelity", id);
      const metaFile = `registry/${folder}/${id}/meta.json`;
      const required = ["REPORT.md"];
      if (folder !== "templates") {
        for (const w of REQUIRED_WIDTHS) required.push(`original-${w}.json`, `extract-${w}.json`);
      }
      const missing = required.filter((f) => !fs.existsSync(path.join(evidenceDir, f)));
      if (missing.length > 0) {
        issues.push({
          rule: "rakitek/fidelity-evidence",
          file: metaFile,
          line: 1,
          message: `Bukti fidelity belum lengkap di fidelity/${id}/: ${missing.join(", ")}. Ukur web asli vs ekstrak (docs/workflow-ekstrak-1to1.md).`,
        });
      }
    }
  }
}
