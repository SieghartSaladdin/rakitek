import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  loadCatalog,
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
  componentPath: string;
}

const KIND_TO_FOLDER: Record<ComponentKind, string> = {
  ui: "ui",
  section: "sections",
  template: "templates",
  page: "pages",
};

function allComponents(catalog: CatalogData): ComponentEntry[] {
  return [
    ...catalog.ui,
    ...catalog.sections,
    ...(catalog.templates ?? []),
    ...(catalog.pages ?? []),
  ];
}

export function searchComponentsResult(args: SearchComponentsArgs) {
  const catalog = loadCatalog();
  const pool: ComponentEntry[] =
    args.kind === "ui"
      ? catalog.ui
      : args.kind === "section"
        ? catalog.sections
        : args.kind === "template"
          ? (catalog.templates ?? [])
          : args.kind === "page"
            ? (catalog.pages ?? [])
            : allComponents(catalog);

  const q = args.query?.trim().toLowerCase();
  const cat = args.category?.trim().toLowerCase();
  const vibe = args.vibe?.trim().toLowerCase();
  const level = args.level && args.level !== "all" ? args.level : undefined;

  return pool
    .filter((item) => {
      if (level && item.level !== level) return false;
      if (cat && item.category.toLowerCase() !== cat) return false;
      if (vibe && !item.vibes.some((v) => v.toLowerCase() === vibe)) return false;
      if (q) {
        const hay = `${item.id} ${item.name} ${item.description} ${item.category} ${item.level} ${item.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .map((item) => ({
      id: item.id,
      kind: item.kind,
      level: item.level,
      category: item.category,
      name: item.name,
      description: item.description,
      vibes: item.vibes,
      recommendedStyles: item.recommendedStyles,
      styling: item.styling ?? "tailwind",
      dependencies: item.dependencies,
      composes: item.composes ?? [],
    }));
}

export function getComponentResult(id: string) {
  const catalog = loadCatalog();
  const all = allComponents(catalog);
  const item = all.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(
      `Component "${id}" not found. Available IDs: ${all.map((e) => e.id).join(", ")}`,
    );
  }
  const stylesCss = item.stylesPath ? readRegistryFile(item.stylesPath) : undefined;
  const extraFiles =
    item.extraFiles && item.extraFiles.length > 0
      ? Object.fromEntries(item.extraFiles.map((f) => [f.name, readRegistryFile(f.path)]))
      : undefined;

  const byRef = new Map<string, ComponentEntry>(
    all.map((entry) => [`${KIND_TO_FOLDER[entry.kind]}/${entry.id}`, entry]),
  );
  const composedComponents: ComposedComponentInfo[] = (item.composes ?? [])
    .map((ref) => {
      const target = byRef.get(ref);
      if (!target) return null;
      return {
        id: target.id,
        ref,
        kind: target.kind,
        level: target.level,
        importPath: `@registry/${ref}/component`,
        componentPath: target.componentPath,
      };
    })
    .filter((entry): entry is ComposedComponentInfo => entry !== null);

  return {
    ...item,
    styling: item.styling ?? "tailwind",
    installCommand:
      item.dependencies.length > 0 ? `npm install ${item.dependencies.join(" ")}` : null,
    code: readRegistryFile(item.componentPath),
    ...(stylesCss ? { stylesCss } : {}),
    ...(extraFiles ? { extraFiles } : {}),
    ...(composedComponents.length > 0
      ? {
          composedComponents,
          importGuide:
            "Fetch each entry in composedComponents via get_component(id) and map @registry/<folder>/<id>/component to your target project path.",
        }
      : {}),
    usageExample: readRegistryFile(item.previewPath),
  };
}

export function registerComponentTools(server: McpServer) {
  server.tool(
    "search_components",
    "Search Rakitek UI components, sections, templates, and demo pages by kind, atomic level, category, vibe, or keyword.",
    {
      kind: z
        .enum(["ui", "section", "template", "page", "all"])
        .optional()
        .describe("Filter by 'ui', 'section', 'template', 'page', or 'all'"),
      level: z
        .enum(["atom", "molecule", "organism", "template", "page", "all"])
        .optional()
        .describe("Filter by Atomic Design level"),
      category: z.string().optional().describe("Category e.g. button, input, drawer, hero, quiz, story"),
      vibe: z.string().optional().describe("Aesthetic vibe e.g. editorial, cinematic, corporate, tactile"),
      query: z.string().optional().describe("Free-text search keyword"),
    },
    async (args) => ({
      content: [{ type: "text", text: JSON.stringify(searchComponentsResult(args), null, 2) }],
    }),
  );

  server.tool(
    "get_component",
    "Fetch clean, readable TSX source code, helper extraFiles, composedComponents, dependencies, and usage example for any Rakitek item.",
    { id: z.string().describe("Component ID from search_components, e.g. 'interactive-quiz'") },
    async ({ id }) => ({
      content: [{ type: "text", text: JSON.stringify(getComponentResult(id), null, 2) }],
    }),
  );
}
