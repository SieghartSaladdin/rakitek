import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadCatalog, readRegistryFile } from "../loader.js";

export function listStylesResult() {
  const catalog = loadCatalog();
  return catalog.styles.map((s) => ({
    id: s.id,
    name: s.name,
    vibe: s.vibe,
    description: s.description,
    fonts: s.fonts,
    palettePreview: s.palettePreview,
    tags: s.tags,
  }));
}

export function getStyleResult(id: string) {
  const catalog = loadCatalog();
  const style = catalog.styles.find((s) => s.id === id);
  if (!style) {
    throw new Error(
      `Style "${id}" not found. Available styles: ${catalog.styles.map((s) => s.id).join(", ")}`,
    );
  }
  return {
    ...style,
    tokensCss: readRegistryFile(style.tokensPath),
    usageNote:
      'Wrap your page or root layout with data-rk-style="' +
      style.id +
      '" (or move the variables to :root) and import the Google Fonts URL in your layout.',
  };
}

export function registerStyleTools(server: McpServer) {
  server.tool(
    "list_styles",
    "List all available Rakitek website style presets (color palettes, typography pairings, vibes).",
    {},
    async () => ({
      content: [{ type: "text", text: JSON.stringify(listStylesResult(), null, 2) }],
    }),
  );

  server.tool(
    "get_style",
    "Fetch full CSS variables (tokens.css) and typography setup for a specific Rakitek website style preset.",
    { id: z.string().describe("Style ID from list_styles, e.g. 'editorial-roastery'") },
    async ({ id }) => ({
      content: [{ type: "text", text: JSON.stringify(getStyleResult(id), null, 2) }],
    }),
  );
}
