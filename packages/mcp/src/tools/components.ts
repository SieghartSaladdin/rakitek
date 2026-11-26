import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  compact,
  loadCatalog,
  loadSetup,
  readRegistryFile,
  type AtomicLevel,
  type CatalogData,
  type ComponentEntry,
  type ComponentKind,
} from "../loader.js";
import { getComponentReply } from "./component-reply.js";

export interface SearchComponentsArgs {
  kind?: ComponentKind | "all";
  level?: AtomicLevel | "all";
  category?: string;
  role?: string;
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
 * Claude Code saves tool output over 25k tokens to a file instead of showing it, and
 * dense TSX/CSS runs near 2.5 chars per token, so 60k chars already overflowed.
 * 36k chars stays near 15k tokens with room for the JSON header.
 */
export const OUTPUT_BUDGET_CHARS = 36_000;

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
  const role = args.role?.trim().toLowerCase();
  const vibe = args.vibe?.trim().toLowerCase();

  return allComponents(catalog)
    .filter((item) => {
      if (kind && item.kind !== kind) return false;
      if (level && item.level !== level) return false;
      if (cat && item.category.toLowerCase() !== cat) return false;
      if (role && !(item.roles ?? []).includes(role as never)) return false;
      if (vibe && !item.vibes.some((v) => v.toLowerCase() === vibe)) return false;
      if (q) {
        const hay = `${item.id} ${item.name} ${item.description} ${item.category} ${(item.roles ?? []).join(" ")} ${item.level} ${item.tags.join(" ")}`.toLowerCase();
        if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
      }
      return true;
    })
    .map((item) => ({
      id: item.id,
      kind: item.kind,
      level: item.level,
      category: item.category,
      ...(item.roles?.length ? { roles: item.roles } : {}),
      name: item.name,
      description: shortDescription(item.description),
      styles: item.recommendedStyles,
      composes: item.composes ?? [],
    }));
}

export const SEARCH_DEFAULT_LIMIT = 20;
export const SEARCH_MAX_LIMIT = 50;

/** One page of search rows, so a large registry never floods the reply. */
export function searchComponentsPage(args: SearchComponentsArgs & { limit?: number; offset?: number }) {
  const all = searchComponentsResult(args);
  const limit = Math.min(Math.max(args.limit ?? SEARCH_DEFAULT_LIMIT, 1), SEARCH_MAX_LIMIT);
  const offset = Math.max(args.offset ?? 0, 0);
  const rows = all.slice(offset, offset + limit);
  const nextOffset = offset + rows.length;
  return {
    total: all.length,
    offset,
    rows,
    ...(nextOffset < all.length ? { nextOffset } : {}),
  };
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
    "Find Rakitek components. Returns compact rows (no code). Filter by kind, atomic level, role (what a section communicates: navigation, hero, offerings, about, process, story, stats, proof, engagement, signup, contact, footer, cart), category, vibe, or keywords.",
    {
      kind: z.enum(["ui", "section", "template", "page", "all"]).optional(),
      level: z.enum(["atom", "molecule", "organism", "template", "page", "all"]).optional(),
      category: z.string().optional().describe("Exact category, e.g. hero"),
      role: z.string().optional().describe("Content role, e.g. offerings or about"),
      vibe: z.string().optional().describe("e.g. editorial, cinematic"),
      query: z.string().optional().describe("Keywords; all words must match"),
      limit: z.number().int().min(1).max(SEARCH_MAX_LIMIT).optional().describe(`Rows per page, default ${SEARCH_DEFAULT_LIMIT}`),
      offset: z.number().int().min(0).optional().describe("Skip this many rows (use nextOffset from the previous page)"),
    },
    async (args) => {
      const page = searchComponentsPage(args);
      const text = page.total > 0 ? compact(page) : "No match. Retry with fewer filters.";
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
    async (args) => ({ content: getComponentReply(args) }),
  );
}
