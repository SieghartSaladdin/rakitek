import fs from "node:fs";
import path from "node:path";
import { compareReports, type Report } from "./fidelity/compare-core";

// Gate: re-compares EVERY saved original/extract pair in fidelity/<id>/.
// Exit 1 on any FAIL, so a changed component or a changed tolerance can never
// keep an old "0 FAIL" claim alive.

const ROOT = process.cwd();
const FIDELITY = path.join(ROOT, "fidelity");
const REGISTRY_FOLDERS = ["ui", "sections", "templates", "pages"];

function newestSourceMtime(id: string): number {
  for (const folder of REGISTRY_FOLDERS) {
    const dir = path.join(ROOT, "registry", folder, id);
    if (!fs.existsSync(dir)) continue;
    return Math.max(
      ...fs
        .readdirSync(dir)
        .filter((f) => /\.(tsx?|css)$/.test(f) && f !== "preview.tsx")
        .map((f) => fs.statSync(path.join(dir, f)).mtimeMs),
    );
  }
  return 0;
}

function main() {
  const verbose = process.argv.includes("--verbose");
  let totalFails = 0;
  let totalWarns = 0;
  let pairs = 0;
  const failing: string[] = [];

  for (const id of fs.readdirSync(FIDELITY).sort()) {
    const dir = path.join(FIDELITY, id);
    if (!fs.statSync(dir).isDirectory()) continue;
    const widths = fs
      .readdirSync(dir)
      .map((f) => f.match(/^original-(\d+)\.json$/)?.[1])
      .filter((w): w is string => Boolean(w))
      .sort((a, b) => Number(b) - Number(a));

    for (const w of widths) {
      const extractPath = path.join(dir, `extract-${w}.json`);
      if (!fs.existsSync(extractPath)) {
        totalFails++;
        failing.push(`${id}@${w}`);
        console.log(`FAIL ${id} ${w}: extract-${w}.json tidak ada`);
        continue;
      }
      const orig = JSON.parse(fs.readFileSync(path.join(dir, `original-${w}.json`), "utf8")) as Report;
      const ext = JSON.parse(fs.readFileSync(extractPath, "utf8")) as Report;
      const r = compareReports(orig, ext);
      pairs++;

      let stale = false;
      if (fs.statSync(extractPath).mtimeMs < newestSourceMtime(id)) {
        stale = true;
        r.warns++;
      }
      totalFails += r.fails;
      totalWarns += r.warns;
      if (r.fails > 0) failing.push(`${id}@${w}`);

      const status = r.fails > 0 ? "FAIL" : "ok  ";
      const note = stale ? " | WARN bukti lebih tua dari kode, ukur ulang" : "";
      console.log(`${status} ${id} ${w}: ${r.total} elements, ${r.fails} FAIL, ${r.warns} WARN${note}`);
      if (r.viewportMismatch) console.log(`     ${r.viewportMismatch}`);
      const shown = r.lines.filter((l) => verbose || l.startsWith("FAIL"));
      for (const line of shown.slice(0, verbose ? Infinity : 4)) console.log(`     ${line}`);
      if (!verbose && shown.length > 4) console.log(`     ... ${shown.length - 4} more (pakai --verbose)`);
    }
  }

  console.log(
    `\n[rakitek fidelity:all] ${pairs} pairs, ${totalFails} FAIL, ${totalWarns} WARN.` +
      (failing.length ? ` Gagal: ${failing.join(", ")}` : ""),
  );
  process.exit(totalFails > 0 ? 1 : 0);
}

main();
