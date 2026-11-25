import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  compact,
  fileBlock,
  loadCatalog,
  loadSetup,
  readRegistryFile,
  type AtomicLevel,
  type CatalogData,
  type ComponentEntry,
  type ComponentKind,
} from "../loader.js";

export interface SearchComponentsArgs {
  kind?: ComponentKind | "all";
  level?: AtomicLevel | "all";
  category?: string;
  vibe?: string;
  query?: string;
}

export interface ComposedComponentInfo {
  id: string;
  ref: string;
  kind: ComponentKind;
  level: AtomicLevel;
  importPath: string;
}

/**
 * ~15k tokens per reply. Some MCP clients truncate tool output around 25k tokens
 * (Claude Code's default), which would silently cut code mid-file.
 */
const OUTPUT_BUDGET_CHARS = 60_000;

const DESCRIPTION_MAX = 140;

function shortDescription(text: string): string {
  const first = text.split(/(?<=\.)\s/)[0] ?? text;
  return first.length > DESCRIPTION_MAX ? `${first.slice(0, DESCRIPTION_MAX - 1)}…` : first;
}

const KIND_TO_FOLDER: Record<ComponentKind, string> = {
  ui: "ui",
  section: "sections",
  template: "templates",
  page: "pages",
};

export function allComponents(catalog: CatalogData): ComponentEntry[] {
  return [...catalog.ui, ...catalog.sections, ...(catalog.templates ?? []), ...(catalog.pages ?? [])];
}

export function searchComponentsResult(args: SearchComponentsArgs) {
  const catalog = loadCatalog();
  const kind = args.kind && args.kind !== "all" ? args.kind : undefined;
  const level = args.level && args.level !== "all" ? args.level : undefined;
  const q = args.query?.trim().toLowerCase();
  const cat = args.category?.trim().toLowerCase();
  const vibe = args.vibe?.trim().toLowerCase();

  return allComponents(catalog)
    .filter((item) => {
      if (kind && item.kind !== kind) return false;
      if (level && item.level !== level) return false;
      if (cat && item.category.toLowerCase() !== cat) return false;
      if (vibe && !item.vibes.some((v) => v.toLowerCase() === vibe)) return false;
      if (q) {
        const hay = `${item.id} ${item.name} ${item.description} ${item.category} ${item.level} ${item.tags.join(" ")}`.toLowerCase();
        if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
      }
      return true;
    })
    .map((item) => ({
      id: item.id,
      kind: item.kind,
      level: item.level,
      category: item.category,
      name: item.name,
      description: shortDescription(item.description),
      styles: item.recommendedStyles,
      composes: item.composes ?? [],
    }));
}

export function getComponentResult(id: string) {
  const catalog = loadCatalog();
  const all = allComponents(catalog);
  const item = all.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Component "${id}" not found. Available IDs: ${all.map((e) => e.id).join(", ")}`);
  }
  const versions = loadSetup().dependencyVersions;
  const dependencies = Object.fromEntries(item.dependencies.map((d) => [d, versions[d] ?? "latest"]));
  const stylesCss = item.stylesPath ? readRegistryFile(item.stylesPath) : undefined;
  const extraFiles =
    item.extraFiles && item.extraFiles.length > 0
      ? Object.fromEntries(item.extraFiles.map((f) => [f.name, readRegistryFile(f.path)]))
      : undefined;

  const byRef = new Map(all.map((entry) => [`${KIND_TO_FOLDER[entry.kind]}/${entry.id}`, entry]));
  const composedComponents: ComposedComponentInfo[] = (item.composes ?? []).flatMap((ref) => {
    const target = byRef.get(ref);
    return target
      ? [{ id: target.id, ref, kind: target.kind, level: target.level, importPath: `@registry/${ref}/component` }]
      : [];
  });

  return {
    id: item.id,
    kind: item.kind,
    level: item.level,
    name: item.name,
    styling: item.styling ?? "tailwind",
    dependencies,
    installCommand:
      item.dependencies.length > 0
        ? `npm install ${item.dependencies.map((d) => `"${d}@${dependencies[d]}"`).join(" ")}`
        : null,
    code: readRegistryFile(item.componentPath),
    ...(stylesCss ? { stylesCss } : {}),
    ...(extraFiles ? { extraFiles } : {}),
    ...(composedComponents.length > 0 ? { composedComponents } : {}),
    usageExample: readRegistryFile(item.previewPath),
  };
}

/** The item plus every component it composes (recursively, deduplicated), dependencies first. */
export function getComponentBundle(id: string, withComposed: boolean) {
  const ordered: ReturnType<typeof getComponentResult>[] = [];
  const seen = new Set<string>();
  const visit = (cid: string) => {
    if (seen.has(cid)) return;
    seen.add(cid);
    const r = getComponentResult(cid);
    if (withComposed) for (const dep of r.composedComponents ?? []) visit(dep.id);
    ordered.push(r);
  };
  visit(id);
  return ordered;
}

export function registerComponentTools(server: McpServer) {
  server.tool(
    "search_components",
    "Find Rakitek components. Returns compact rows (no code). Filter by kind, atomic level, category (hero, navbar, footer, showcase, story, stats, quiz, manifesto, button, drawer...), vibe, or keywords.",
    {
      kind: z.enum(["ui", "section", "template", "page", "all"]).optional(),
      level: z.enum(["atom", "molecule", "organism", "template", "page", "all"]).optional(),
      category: z.string().optional().describe("Exact category, e.g. hero"),
      vibe: z.string().optional().describe("e.g. editorial, cinematic"),
      query: z.string().optional().describe("Keywords; all words must match"),
    },
    async (args) => {
      const rows = searchComponentsResult(args);
      const text = rows.length > 0 ? compact(rows) : "No match. Retry with fewer filters.";
      return { content: [{ type: "text", text }] };
    },
  );

  server.tool(
    "get_component",
    "Get ready-to-copy files for a component: component.tsx, styles.module.css, helpers, usage example, pinned npm install. Composed children are included by default, so one call is enough for templates/pages.",
    {
      id: z.string().describe("Component ID, e.g. 'interactive-quiz'"),
      withComposed: z.boolean().optional().describe("Default true: also return composed children"),
      includeExample: z.boolean().optional().describe("Default true: include example.tsx showing props"),
    },
    async ({ id, withComposed, includeExample }) => {
      const bundle = getComponentBundle(id, withComposed ?? true);
      const blocksOf = (r: (typeof bundle)[number]) => {
        const blocks = [fileBlock(`${r.id}/component.tsx`, r.code)];
        if (r.stylesCss) blocks.push(fileBlock(`${r.id}/styles.module.css`, r.stylesCss));
        for (const [name, code] of Object.entries(r.extraFiles ?? {})) {
          blocks.push(fileBlock(`${r.id}/${name}`, code));
        }
        if ((includeExample ?? true) && r.id === id) {
          blocks.push(fileBlock(`${r.id}/example.tsx (reference only)`, r.usageExample));
        }
        return blocks;
      };
      const size = (blocks: { text: string }[]) => blocks.reduce((n, b) => n + b.text.length, 0);

      // Requested item always ships; children are added until the budget, the rest are named for follow-up calls.
      const main = bundle[bundle.length - 1];
      const mainBlocks = blocksOf(main);
      let used = size(mainBlocks);
      const included: typeof bundle = [];
      const fetchSeparately: string[] = [];
      const childBlocks = [];
      for (const r of bundle.slice(0, -1)) {
        const blocks = blocksOf(r);
        if (used + size(blocks) <= OUTPUT_BUDGET_CHARS) {
          used += size(blocks);
          included.push(r);
          childBlocks.push(...blocks);
        } else {
          fetchSeparately.push(r.id);
        }
      }

      const install = new Set(
        bundle.flatMap((r) => Object.entries(r.dependencies).map(([d, v]) => `"${d}@${v}"`)),
      );
      const header = {
        items: [...included, main].map((r) => ({ id: r.id, kind: r.kind, level: r.level, name: r.name })),
        ...(fetchSeparately.length > 0
          ? { fetchSeparately, fetchNote: "Too large for one reply. Call get_component({ id, withComposed: false, includeExample: false }) for each." }
          : {}),
        installCommand: install.size > 0 ? `npm install ${[...install].join(" ")}` : null,
        layout: "Put each <id>/ folder in your components dir. Rewrite `@registry/<folder>/<id>/component` imports to that folder. Keep ./ imports as-is.",
      };
      return { content: [{ type: "text" as const, text: compact(header) }, ...childBlocks, ...mainBlocks] };
    },
  );
}
