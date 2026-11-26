import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface StyleEntry {
  id: string;
  name: string;
  vibe: string;
  description: string;
  sourceRef: string;
  fonts: {
    display: string;
    body: string;
    mono: string;
    googleFontsUrl: string;
  };
  palettePreview: {
    bg: string;
    surface: string;
    fg: string;
    accent: string;
  };
  tags: string[];
  tokensPath: string;
}

export type AtomicLevel = "atom" | "molecule" | "organism" | "template" | "page";
export type ComponentKind = "ui" | "section" | "template" | "page";
export type SectionRole =
  | "navigation"
  | "hero"
  | "offerings"
  | "about"
  | "process"
  | "story"
  | "stats"
  | "proof"
  | "engagement"
  | "signup"
  | "contact"
  | "footer"
  | "cart";

export interface ComponentEntry {
  id: string;
  kind: ComponentKind;
  level: AtomicLevel;
  category: string;
  roles?: SectionRole[];
  name: string;
  description: string;
  vibes: string[];
  recommendedStyles: string[];
  styling?: "css-modules" | "tailwind" | "hybrid";
  dependencies: string[];
  composes?: string[];
  sourceRef: string;
  tags: string[];
  componentPath: string;
  previewPath: string;
  stylesPath?: string;
  extraFiles?: Array<{ name: string; path: string }>;
}

export interface CatalogData {
  generatedAt: string;
  styles: StyleEntry[];
  ui: ComponentEntry[];
  sections: ComponentEntry[];
  templates?: ComponentEntry[];
  pages?: ComponentEntry[];
}

export function resolveRakitekRoot(): string {
  if (process.env.RAKITEK_ROOT) {
    return path.resolve(process.env.RAKITEK_ROOT);
  }
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, "..", "..", "..");
}

/**
 * Parsed JSON kept in memory and re-read only when the file's mtime changes, so a large
 * registry is not re-parsed on every tool call while `npm run sync` still takes effect.
 */
const jsonCache = new Map<string, { mtimeMs: number; value: unknown }>();

export function readJsonCached<T>(filePath: string): T {
  const { mtimeMs } = fs.statSync(filePath);
  const hit = jsonCache.get(filePath);
  if (hit && hit.mtimeMs === mtimeMs) return hit.value as T;
  const value = JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  jsonCache.set(filePath, { mtimeMs, value });
  return value;
}

export function loadCatalog(): CatalogData {
  const root = resolveRakitekRoot();
  const catalogPath = path.join(root, "registry", ".generated", "catalog.json");
  if (!fs.existsSync(catalogPath)) {
    throw new Error(
      `Catalog not found at ${catalogPath}. Run "npm run sync" inside the rakitek repo first.`,
    );
  }
  return readJsonCached<CatalogData>(catalogPath);
}

export interface SetupData {
  baseCss: string;
  baseCssSource: string;
  dependencyVersions: Record<string, string>;
  primitives: Record<string, string>;
}

export function loadSetup(): SetupData {
  const setupPath = path.join(resolveRakitekRoot(), "registry", ".generated", "setup.json");
  if (!fs.existsSync(setupPath)) {
    throw new Error(`Setup not found at ${setupPath}. Run "npm run sync" inside the rakitek repo first.`);
  }
  return readJsonCached<SetupData>(setupPath);
}

/** Compact JSON: no indentation, so tool output spends tokens on content, not whitespace. */
export function compact(value: unknown): string {
  return JSON.stringify(value);
}

/** Raw file block: code is returned unescaped so models read it as-is. */
export function fileBlock(name: string, content: string): { type: "text"; text: string } {
  return { type: "text", text: `=== ${name} ===\n${content}` };
}

export function readRegistryFile(relPath: string): string {
  const root = resolveRakitekRoot();
  const absPath = path.resolve(root, relPath);
  const registryRoot = path.resolve(root, "registry");
  if (!absPath.startsWith(registryRoot)) {
    throw new Error(`Path "${relPath}" is outside the registry directory.`);
  }
  return fs.readFileSync(absPath, "utf8");
}
