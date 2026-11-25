import fs from "node:fs";
import { compareReports, type Report } from "./fidelity/compare-core";

function main() {
  const [origPath, extractPath] = process.argv.slice(2);
  if (!origPath || !extractPath) {
    console.error("Usage: npm run fidelity -- <original.json> <extract.json>");
    process.exit(2);
  }
  const orig = JSON.parse(fs.readFileSync(origPath, "utf8")) as Report;
  const ext = JSON.parse(fs.readFileSync(extractPath, "utf8")) as Report;
  const result = compareReports(orig, ext);
  if (result.viewportMismatch) {
    console.error(result.viewportMismatch);
    process.exit(2);
  }
  console.log(result.lines.join("\n"));
  console.log(
    `\n[rakitek fidelity] ${orig.viewport.width}x${orig.viewport.height}: ${result.total} elements, ${result.fails} FAIL, ${result.warns} WARN.`,
  );
  process.exit(result.fails > 0 ? 1 : 0);
}

main();
