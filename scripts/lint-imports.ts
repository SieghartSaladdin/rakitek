import fs from "node:fs";
import path from "node:path";

export interface ImportLintIssue {
  rule: string;
  file: string;
  line: number;
  message: string;
}

interface ComponentMetaLite {
  level?: string;
  composes?: string[];
}

const COMPONENT_FOLDERS = ["ui", "sections", "templates", "pages"] as const;
const SOURCE_EXTS = new Set([".ts", ".tsx", ".css"]);
const JS_IMPORT_RE =
  /(?:(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?|import\s*\(\s*)["']([^"'\r\n]+)["']/g;
const CSS_IMPORT_RE = /@import\s+(?:url\s*\(\s*)?["']([^"'\r\n]+)["']/g;
const REGISTRY_ALIAS_RE = /^@registry\/(ui|sections|templates|pages)\/([a-z0-9-]+)\/component$/;

const LEVEL_RANK: Record<string, number> = {
  atom: 1,
  molecule: 2,
  organism: 3,
  template: 4,
  page: 5,
};

function readMetaLite(itemDir: string): ComponentMetaLite | null {
  const metaPath = path.join(itemDir, "meta.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8")) as ComponentMetaLite;
  } catch {
    return null;
  }
}

function resolveLocalFile(dir: string, specifier: string): boolean {
  const relTarget = specifier.slice(2);
  if (relTarget.includes("..") || relTarget.includes("/")) return false;
  const exact = path.join(dir, relTarget);
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) return true;
  for (const ext of [".ts", ".tsx", ".css"]) {
    const candidate = `${exact}${ext}`;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return true;
  }
  return false;
}

function lineNumberAt(raw: string, offset: number): number {
  let line = 1;
  for (let i = 0; i < offset; i++) {
    if (raw.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

function extractFileSpecifiers(raw: string, isCss: boolean): Array<{ spec: string; line: number }> {
  const re = isCss ? CSS_IMPORT_RE : JS_IMPORT_RE;
  const out: Array<{ spec: string; line: number }> = [];
  for (const match of raw.matchAll(re)) {
    const spec = match[1];
    if (!spec) continue;
    const specOffset = (match.index ?? 0) + match[0].lastIndexOf(spec);
    out.push({ spec, line: lineNumberAt(raw, specOffset) });
  }
  return out;
}

export function checkRegistryImports(root: string, issues: ImportLintIssue[]) {
  const registryRoot = path.join(root, "registry");

  for (const folder of COMPONENT_FOLDERS) {
    const folderDir = path.join(registryRoot, folder);
    if (!fs.existsSync(folderDir)) continue;

    for (const dirEntry of fs.readdirSync(folderDir, { withFileTypes: true })) {
      if (!dirEntry.isDirectory() || dirEntry.name.startsWith(".")) continue;
      const itemDir = path.join(folderDir, dirEntry.name);
      const sourceMeta = readMetaLite(itemDir);
      const sourceLevel = sourceMeta?.level;
      const sourceRank = sourceLevel ? LEVEL_RANK[sourceLevel] : undefined;
      const declaredComposes = new Set(sourceMeta?.composes ?? []);
      const importedRefs = new Map<string, { file: string; line: number }>();

      for (const fileEntry of fs.readdirSync(itemDir, { withFileTypes: true })) {
        if (!fileEntry.isFile() || !SOURCE_EXTS.has(path.extname(fileEntry.name))) continue;
        const absFile = path.join(itemDir, fileEntry.name);
        const relFile = path.relative(root, absFile).replaceAll("\\", "/");
        const isCss = path.extname(fileEntry.name) === ".css";
        const isPreview = fileEntry.name === "preview.tsx";
        const raw = fs.readFileSync(absFile, "utf8");

        for (const { spec, line: lineNo } of extractFileSpecifiers(raw, isCss)) {
          if (spec.startsWith("../")) {
            issues.push({
              rule: "rakitek/imports-resolvable",
              file: relFile,
              line: lineNo,
              message: `Relative import "${spec}" escapes component folder; keep helpers local via "./" or import other components via "@registry/<folder>/<id>/component".`,
            });
            continue;
          }

          if (spec.startsWith("./")) {
            if (!resolveLocalFile(itemDir, spec)) {
              issues.push({
                rule: "rakitek/imports-resolvable",
                file: relFile,
                line: lineNo,
                message: `Local import "${spec}" does not resolve to a file inside ${folder}/${dirEntry.name}.`,
              });
            }
            continue;
          }

          if (spec.startsWith("@registry/")) {
            const match = spec.match(REGISTRY_ALIAS_RE);
            if (!match) {
              issues.push({
                rule: "rakitek/imports-resolvable",
                file: relFile,
                line: lineNo,
                message: `Cross-component import "${spec}" must match "@registry/<folder>/<id>/component".`,
              });
              continue;
            }
            const targetFolder = match[1];
            const targetId = match[2];
            const targetDir = path.join(registryRoot, targetFolder, targetId);
            const targetFile = path.join(targetDir, "component.tsx");
            if (!fs.existsSync(targetFile)) {
              issues.push({
                rule: "rakitek/imports-resolvable",
                file: relFile,
                line: lineNo,
                message: `Registry import "${spec}" points to missing component "${targetFolder}/${targetId}".`,
              });
              continue;
            }

            const refKey = `${targetFolder}/${targetId}`;
            if (!isPreview && !importedRefs.has(refKey)) {
              importedRefs.set(refKey, { file: relFile, line: lineNo });
            }

            const targetMeta = readMetaLite(targetDir);
            const targetLevel = targetMeta?.level;
            const targetRank = targetLevel ? LEVEL_RANK[targetLevel] : undefined;
            if (sourceRank !== undefined && targetRank !== undefined && targetRank > sourceRank) {
              issues.push({
                rule: "rakitek/atomic-hierarchy",
                file: relFile,
                line: lineNo,
                message: `${sourceLevel} "${folder}/${dirEntry.name}" cannot import higher-level ${targetLevel} "${refKey}" (allowed: same or lower level).`,
              });
            }
          }
        }
      }

      const relMeta = path.relative(root, path.join(itemDir, "meta.json")).replaceAll("\\", "/");
      for (const [refKey, loc] of importedRefs.entries()) {
        if (!declaredComposes.has(refKey)) {
          issues.push({
            rule: "rakitek/composes-sync",
            file: loc.file,
            line: loc.line,
            message: `Imported "${refKey}" is missing from meta.json composes.`,
          });
        }
      }
      for (const declared of declaredComposes) {
        if (!importedRefs.has(declared)) {
          issues.push({
            rule: "rakitek/composes-sync",
            file: relMeta,
            line: 1,
            message: `Declared composes entry "${declared}" is not imported by component source files.`,
          });
        }
      }
    }
  }
}
