import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBlueprintTools } from "./tools/blueprint.js";
import { registerComponentTools } from "./tools/components.js";
import { registerPlanTools } from "./tools/plan.js";
import { registerStyleTools } from "./tools/styles.js";

/**
 * Sent to the client on initialize. Claude Code puts it in the system prompt and
 * Antigravity saves it as instructions.md, so users get the workflow without
 * installing a skill. Kept short: it is read on every turn.
 */
export const RAKITEK_INSTRUCTIONS = `Rakitek = verified, token-based UI sections for building websites. When the user asks for a website, landing page, or UI section, use these tools instead of writing UI from scratch.
Flow:
1. plan_page({ brief }) -> style, layout shell, ordered content slots (navigation, hero, offerings, about...), each with a pick and every section from any demo that fits. Choose per slot; drop optional slots the brief does not need.
2. get_style({ id }) once -> tokens.css, googleFontsUrl, base.css, SmoothScrollProvider, setupInstallCommand.
3. get_component({ id, withComposed: false }) per chosen section and the shell. Files come as "=== <id>/<file> ===" blocks; the example shows every prop.
(suggest_page_blueprint returns a whole demo page; use it only when the brief matches that demo.)
Install: base.css in global CSS unless tailwindcss v4 is imported, then tokens.css; data-rk-style on <html>; load googleFontsUrl; run setupInstallCommand and each installCommand; copy blocks to <components>/<id>/<file>; rewrite @registry/<folder>/<id>/component to <components>/<id>/component; wrap the app in SmoothScrollProvider.
Adapt via props: copy, images, links, ids, labels, formatPrice, show/hide flags (showCart). Keep colors, fonts, radii, easing on var(--rk-*). Never rewrite a section's layout or animation; if props cannot fit it, pick another candidate.
Components are React + CSS Modules; for Vue/Svelte port markup 1:1 and keep styles.module.css and animation code.
Finish with the build and a check at 1440px and 390px for overflow, overlap, contrast.`;

export function createRakitekServer(): McpServer {
  const server = new McpServer(
    { name: "rakitek-mcp", version: "0.3.0" },
    { instructions: RAKITEK_INSTRUCTIONS },
  );
  registerPlanTools(server);
  registerStyleTools(server);
  registerComponentTools(server);
  registerBlueprintTools(server);
  return server;
}
