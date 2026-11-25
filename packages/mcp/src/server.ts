import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBlueprintTools } from "./tools/blueprint.js";
import { registerComponentTools } from "./tools/components.js";
import { registerStyleTools } from "./tools/styles.js";

/**
 * Sent to the client on initialize. Claude Code puts it in the system prompt and
 * Antigravity saves it as instructions.md, so users get the workflow without
 * installing a skill. Kept short: it is read on every turn.
 */
export const RAKITEK_INSTRUCTIONS = `Rakitek = verified, token-based UI sections for building websites. When the user asks for a website, landing page, or UI section, use these tools instead of writing UI from scratch.
Flow (fewest calls):
1. suggest_page_blueprint({ niche }) -> style, basePage, ordered stack with alternatives.
2. get_style({ id }) once -> tokens.css, googleFontsUrl, base.css, SmoothScrollProvider, pinned npm versions.
3. get_component({ id: basePage }) -> page + template + sections as "=== <id>/<file> ===" blocks. Fetch ids in fetchSeparately with { withComposed: false, includeExample: false }.
Install: add base.css to global CSS unless the project already imports tailwindcss v4, then tokens.css; set data-rk-style on <html>; load googleFontsUrl; run installCommand; copy each block to <components>/<id>/<file>; rewrite @registry/<folder>/<id>/component to <components>/<id>/component; wrap the app once in SmoothScrollProvider.
Rules: copy files as-is, change only props, copy, and images; keep colors, fonts, radii, easing on var(--rk-*); never rewrite a section's layout or animation from memory (pick an alternative instead); finish with the project's build and a check at 1440px and 390px.`;

export function createRakitekServer(): McpServer {
  const server = new McpServer(
    { name: "rakitek-mcp", version: "0.2.0" },
    { instructions: RAKITEK_INSTRUCTIONS },
  );
  registerStyleTools(server);
  registerComponentTools(server);
  registerBlueprintTools(server);
  return server;
}
