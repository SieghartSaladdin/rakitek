import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { compact, fileBlock, loadCatalog, loadSetup, readRegistryFile } from "../loader.js";

export function listStylesResult() {
  const catalog = loadCatalog();
  return catalog.styles.map((s) => ({
    id: s.id,
    name: s.name,
    vibe: s.vibe,
    description: s.description,
    fonts: { display: s.fonts.display, body: s.fonts.body },
    palette: s.palettePreview,
    tags: s.tags,
  }));
}

export function getStyleResult(id: string, includeSetup = true) {
  const catalog = loadCatalog();
  const style = catalog.styles.find((s) => s.id === id);
  if (!style) {
    throw new Error(
      `Style "${id}" not found. Available styles: ${catalog.styles.map((s) => s.id).join(", ")}`,
    );
  }
  const setup = includeSetup ? loadSetup() : undefined;
  return {
    id: style.id,
    name: style.name,
    googleFontsUrl: style.fonts.googleFontsUrl,
    tokensCss: readRegistryFile(style.tokensPath),
    ...(setup
      ? {
          baseCss: setup.baseCss,
          primitives: setup.primitives,
          dependencyVersions: setup.dependencyVersions,
        }
      : {}),
    steps: [
      `Load googleFontsUrl in the root layout.`,
      `Put tokens.css in global CSS and set data-rk-style="${style.id}" on <html> or <body>.`,
      ...(setup
        ? [
            "If the project does NOT already import tailwindcss v4, add base.css to global CSS before tokens.css (components are verified on this reset).",
            "Copy primitives next to your layout; wrap the app once in SmoothScrollProvider (optional: npm install lenis).",
          ]
        : []),
    ],
  };
}

export function registerStyleTools(server: McpServer) {
  server.tool(
    "list_styles",
    "List Rakitek style presets (palette, fonts, vibe). Use only to compare styles; suggest_page_blueprint already picks one.",
    {},
    async () => ({ content: [{ type: "text", text: compact(listStylesResult()) }] }),
  );

  server.tool(
    "get_style",
    "One-time project setup: style tokens.css, Google Fonts URL, base reset CSS, SmoothScrollProvider primitive, and tested npm versions. Call once per project.",
    {
      id: z.string().describe("Style ID, e.g. 'editorial-roastery'"),
      includeSetup: z
        .boolean()
        .optional()
        .describe("Default true. Set false if base.css/primitives were already fetched"),
    },
    async ({ id, includeSetup }) => {
      const r = getStyleResult(id, includeSetup ?? true);
      const content = [
        {
          type: "text" as const,
          text: compact({
            id: r.id,
            googleFontsUrl: r.googleFontsUrl,
            dependencyVersions: r.dependencyVersions,
            steps: r.steps,
          }),
        },
        fileBlock("tokens.css", r.tokensCss),
      ];
      if (r.baseCss) content.push(fileBlock("base.css", r.baseCss));
      for (const [name, code] of Object.entries(r.primitives ?? {})) {
        content.push(fileBlock(name, code));
      }
      return { content };
    },
  );
}
