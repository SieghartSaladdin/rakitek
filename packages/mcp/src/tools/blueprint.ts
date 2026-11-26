import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { compact, loadCatalog, type ComponentEntry } from "../loader.js";
import { allComponents } from "./components.js";

function words(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
}

function nicheScore(
  item: { id?: string; category: string; tags: string[]; description: string },
  niche: string[],
) {
  // Tags, category and id are deliberate labels, so they weigh more than incidental description words.
  const labels = new Set([item.category, ...item.tags, ...words(item.id ?? "")].map((s) => s.toLowerCase()));
  const prose = new Set(words(item.description));
  return niche.reduce((sum, w) => sum + (labels.has(w) ? 2 : prose.has(w) ? 1 : 0), 0);
}

/**
 * Picks the verified demo page that best fits the niche and style. Its `composes`
 * order is the tested section stack, so the AI gets an ordered layout instead of a pile.
 */
export function suggestBlueprintResult(niche: string, styleId?: string) {
  const catalog = loadCatalog();
  const nicheWords = [niche.toLowerCase(), ...words(niche)];
  const all = allComponents(catalog);

  // A style scores by its own tags plus its best-matching verified page.
  const styleScore = (s: (typeof catalog.styles)[number]) =>
    nicheScore({ category: "", tags: s.tags, description: s.description }, nicheWords) +
    Math.max(
      0,
      ...(catalog.pages ?? [])
        .filter((p) => p.recommendedStyles[0] === s.id)
        .map((p) => nicheScore(p, nicheWords)),
    );
  const style =
    catalog.styles.find((s) => s.id === styleId) ??
    [...catalog.styles].sort((a, b) => styleScore(b) - styleScore(a))[0];
  if (!style) throw new Error("No styles in registry. Run npm run sync.");

  const fitsStyle = (item: ComponentEntry) => item.recommendedStyles.includes(style.id);
  const pages = (catalog.pages ?? [])
    .filter(fitsStyle)
    .sort(
      (a, b) =>
        nicheScore(b, nicheWords) - nicheScore(a, nicheWords) ||
        Number(b.recommendedStyles[0] === style.id) - Number(a.recommendedStyles[0] === style.id),
    );
  const basePage = pages[0];
  const nicheMatched = Boolean(styleId) || styleScore(style) > 0;
  const byRef = new Map(all.map((item) => [`${item.kind === "ui" ? "ui" : `${item.kind}s`}/${item.id}`, item]));

  const alternativesFor = (item: ComponentEntry) =>
    all
      .filter((o) => o.kind === item.kind && o.category === item.category && o.id !== item.id && fitsStyle(o))
      .map((o) => o.id);

  const parts = (basePage?.composes ?? []).flatMap((ref) => {
    const item = byRef.get(ref);
    return item ? [item] : [];
  });
  const template = parts.find((p) => p.kind === "template");

  return {
    niche,
    style: { id: style.id, name: style.name, vibe: style.vibe },
    ...(nicheMatched
      ? {}
      : { note: "No style is tagged for this niche; this is the default. Check list_styles if the brief suggests another mood." }),
    basePage: basePage?.id ?? null,
    template: template?.id ?? null,
    stack: parts
      .filter((p) => p.kind !== "template")
      .map((p) => ({ slot: p.category, id: p.id, alternatives: alternativesFor(p) })),
    otherPages: pages.slice(1).map((p) => p.id),
    next: basePage
      ? [
          `get_style("${style.id}") once for tokens, fonts, base CSS, primitives.`,
          `get_component("${basePage.id}") returns the page, its template and as many stack sections as fit one reply; fetch any ids listed in fetchSeparately with includeExample:false. example.tsx shows the assembled order.`,
          "To swap a slot, get_component(<alternative id>, withComposed:false) and replace that section only.",
          "Replace copy, images and props with the brief; keep var(--rk-*) intact.",
        ]
      : [
          `get_style("${style.id}"), then search_components({ kind: "section" }) and pick navbar, hero, content, footer.`,
        ],
  };
}

export function registerBlueprintTools(server: McpServer) {
  server.tool(
    "suggest_page_blueprint",
    "Returns one whole verified demo page (its style and ordered section stack) closest to a niche. Use plan_page instead for a new site; use this only when the brief closely matches a demo.",
    {
      niche: z.string().describe("e.g. 'coffee-shop', 'saas', 'company-profile'"),
      styleId: z.string().optional().describe("Force a style ID"),
    },
    async ({ niche, styleId }) => ({
      content: [{ type: "text", text: compact(suggestBlueprintResult(niche, styleId)) }],
    }),
  );
}
