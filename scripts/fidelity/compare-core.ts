// Comparison rules for rkMeasure() reports. Toleransi ukuran: maks 4px.
export type Metrics = Record<string, string | number | boolean>;
export interface Report {
  normalized?: boolean;
  viewport: { width: number; height: number };
  url: string;
  elements: Record<string, Metrics>;
}

const SIZE_KEYS = ["width", "height", "fontSize", "lineHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];
const POS_KEYS = ["x", "y"];
const EXACT_KEYS = ["textTransform", "display", "visible", "fontWeight", "text"];
const COLOR_KEYS = ["color", "backgroundColor"];
const WARN_KEYS = ["fontRendered", "letterSpacing", "borderRadius", "gap", "borderTop", "borderBottom"];

function parseColor(value: string): number[] | null {
  const srgb = value.match(/color\(srgb\s+([^)]+)\)/);
  if (srgb) {
    const p = srgb[1].split(/[\s/]+/).filter(Boolean).map(Number);
    return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] ?? 1];
  }
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}

function normalizeBorder(value: string): string {
  const [width, ...rest] = value.split(" ");
  const c = parseColor(rest.join(" "));
  return c ? `${width} ${c.map((n, i) => (i < 3 ? Math.round(n) : Math.round(n * 100) / 100)).join(",")}` : value;
}

function sizeOk(a: number, b: number): boolean {
  const tol = Math.min(4, Math.max(1, Math.abs(a) * 0.02));
  return Math.abs(a - b) <= tol;
}

export interface CompareResult {
  fails: number;
  warns: number;
  total: number;
  lines: string[];
  viewportMismatch?: string;
}

// Shared by fidelity-compare.ts (one pair) and fidelity-all.ts (every pair).
export function compareReports(orig: Report, ext: Report): CompareResult {
  let fails = 0;
  let warns = 0;
  const lines: string[] = [];
  const total = Object.keys(orig.elements).length;
  if (orig.viewport.width !== ext.viewport.width || orig.viewport.height !== ext.viewport.height) {
    return {
      fails: 1,
      warns: 0,
      total,
      lines: [],
      viewportMismatch: `Viewport mismatch: original ${orig.viewport.width}x${orig.viewport.height} vs extract ${ext.viewport.width}x${ext.viewport.height}. Measure both at the same size.`,
    };
  }
  for (const [side, report] of [["original", orig], ["extract", ext]] as const) {
    if (!report.normalized) {
      warns++;
      lines.push(`WARN capture: ${side} diukur tanpa normalisasi scrollbar (capture lama). Ukur ulang dengan measure.js terbaru.`);
    }
  }
  for (const [label, o] of Object.entries(orig.elements)) {
    const e = ext.elements[label];
    const eMissing = !e || Boolean(e.missing);
    const oMissing = Boolean(o.missing);
    // Missing on one side and invisible on the other looks identical on screen.
    if ((eMissing && (oMissing || o.visible === false)) || (oMissing && e?.visible === false)) {
      continue;
    }
    if (eMissing || oMissing) {
      fails++;
      lines.push(`FAIL ${label}: missing in ${!e || e.missing ? "extract" : "original"}`);
      continue;
    }
    for (const key of [...SIZE_KEYS, ...POS_KEYS]) {
      const a = o[key];
      const b = e[key];
      if (typeof a === "number" && typeof b === "number" && !sizeOk(a, b)) {
        // Text width follows the font, so a substituted font only warns on width.
        const fontSwap = key === "width" && Boolean(o.text) && o.fontRendered !== e.fontRendered;
        const soft = POS_KEYS.includes(key) || fontSwap;
        if (soft) warns++;
        else fails++;
        const why = fontSwap ? ` (font ${o.fontRendered} -> ${e.fontRendered})` : "";
        lines.push(`${soft ? "WARN" : "FAIL"} ${label}.${key}: original ${a} vs extract ${b}${why}`);
      }
    }
    for (const key of EXACT_KEYS) {
      if (String(o[key]) !== String(e[key])) {
        const soft = key === "text" || key === "fontWeight";
        if (soft) warns++;
        else fails++;
        lines.push(`${soft ? "WARN" : "FAIL"} ${label}.${key}: original "${o[key]}" vs extract "${e[key]}"`);
      }
    }
    for (const key of COLOR_KEYS) {
      const a = parseColor(String(o[key]));
      const b = parseColor(String(e[key]));
      if (!a || !b) continue;
      const delta = Math.max(...[0, 1, 2].map((i) => Math.abs(a[i] - b[i])), Math.abs(a[3] - b[3]) * 255);
      if (delta > 24) {
        fails++;
        lines.push(`FAIL ${label}.${key}: original ${o[key]} vs extract ${e[key]}`);
      } else if (delta >= 1) {
        warns++;
        lines.push(`WARN ${label}.${key}: original ${o[key]} vs extract ${e[key]} (token rounding)`);
      }
    }
    for (const key of WARN_KEYS) {
      const norm = key.startsWith("border") && key !== "borderRadius" ? normalizeBorder : String;
      if (norm(String(o[key])) !== norm(String(e[key]))) {
        warns++;
        lines.push(`WARN ${label}.${key}: original "${o[key]}" vs extract "${e[key]}"`);
      }
    }
  }

  return { fails, warns, total, lines };
}
