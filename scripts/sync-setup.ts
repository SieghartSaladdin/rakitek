import fs from "node:fs";
import path from "node:path";

/**
 * Writes registry/.generated/setup.json: everything a target project needs once,
 * besides the style tokens. Components are verified in the showcase on top of
 * Tailwind v4 preflight, so that reset is shipped as plain CSS for projects without it.
 */
export interface RakitekSetup {
  baseCss: string;
  baseCssSource: string;
  dependencyVersions: Record<string, string>;
  primitives: Record<string, string>;
}

/** Replace Tailwind-only `--theme(--var, fallback)` with its fallback (identical to theme defaults). */
function resolveThemeCalls(css: string): string {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const start = css.indexOf("--theme(", i);
    if (start === -1) {
      out += css.slice(i);
      break;
    }
    out += css.slice(i, start);
    let depth = 0;
    let end = start + "--theme".length;
    for (; end < css.length; end++) {
      if (css[end] === "(") depth++;
      else if (css[end] === ")" && --depth === 0) break;
    }
    const inner = css.slice(start + "--theme(".length, end);
    const comma = inner.indexOf(",");
    out += comma === -1 ? "initial" : inner.slice(comma + 1).trim();
    i = end + 1;
  }
  return out;
}

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export function buildSetup(root: string, usedDeps: Iterable<string>): RakitekSetup {
  const preflightPath = path.join(root, "node_modules", "tailwindcss", "preflight.css");
  const twPkg = JSON.parse(
    fs.readFileSync(path.join(root, "node_modules", "tailwindcss", "package.json"), "utf8"),
  ) as { version: string };
  const baseCss = minifyCss(resolveThemeCalls(fs.readFileSync(preflightPath, "utf8")));

  const webPkg = JSON.parse(
    fs.readFileSync(path.join(root, "apps", "web", "package.json"), "utf8"),
  ) as { dependencies?: Record<string, string> };
  const declared = webPkg.dependencies ?? {};
  const dependencyVersions: Record<string, string> = {};
  // lenis backs the SmoothScrollProvider primitive, which no component lists as a dependency.
  for (const dep of ["react", "react-dom", "lenis", ...usedDeps]) {
    if (declared[dep]) dependencyVersions[dep] = declared[dep];
  }

  const primitivesDir = path.join(root, "registry", "primitives");
  const primitives: Record<string, string> = {};
  if (fs.existsSync(primitivesDir)) {
    for (const name of fs.readdirSync(primitivesDir).sort()) {
      if (/\.(tsx?|css)$/.test(name)) {
        primitives[name] = fs.readFileSync(path.join(primitivesDir, name), "utf8");
      }
    }
  }

  return {
    baseCss,
    baseCssSource: `tailwindcss@${twPkg.version} preflight (MIT), --theme() resolved to defaults`,
    dependencyVersions,
    primitives,
  };
}
