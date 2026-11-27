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
export const RAKITEK_INSTRUCTIONS = `Rakitek = verified, token-based UI sections for building websites. Use these tools instead of writing UI from scratch.
Flow:
1. plan_page({ brief }) -> style, shell, ordered slots (navigation, hero, offerings, about...), each with a pick and cross-demo candidates. Drop optional slots the brief does not need.
2. get_style({ id }) once -> tokens.css, googleFontsUrl, base.css, SmoothScrollProvider, setupInstallCommand.
3. get_component({ id, withComposed: false }) per section and shell ("=== <id>/<file> ===" blocks; example shows props).
(Use suggest_page_blueprint only when the brief closely matches a whole demo.)
Install: add base.css (skip if tailwindcss v4 is imported), then tokens.css; set data-rk-style on <html>; load googleFontsUrl; run setupInstallCommand and each installCommand; copy blocks to <components>/<id>/<file>; rewrite @registry/<folder>/<id>/component to <components>/<id>/component; wrap app in SmoothScrollProvider.
Adapt via props only (copy, images, links, ids, labels, formatPrice, showCart). Keep styles on var(--rk-*); never rewrite layout/animation, pick another candidate if needed.
Copy (anti-slop): stick to brief facts; never invent stats, quotes, or claims (drop empty proof/stats slots); ban AI buzzwords, generic CTAs, em dashes, and AI cadence; keep user voice.
React + CSS Modules; for Vue/Svelte port markup 1:1 and keep styles.module.css and animations.
Verify: build, check 1440px/390px (overflow, overlap, contrast), and audit copy.`;

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
