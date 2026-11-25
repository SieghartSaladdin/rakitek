import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadCatalog } from "../loader.js";

export function suggestBlueprintResult(niche: string, styleId?: string) {
  const catalog = loadCatalog();
  const normalizedNiche = niche.toLowerCase();

  const chosenStyle =
    catalog.styles.find((s) => s.id === styleId) ??
    catalog.styles.find((s) =>
      s.tags.some((tag) => normalizedNiche.includes(tag) || tag.includes(normalizedNiche)),
    ) ??
    catalog.styles[0];

  const matchingSections = catalog.sections.filter(
    (sec) =>
      sec.recommendedStyles.includes(chosenStyle.id) ||
      sec.vibes.includes(chosenStyle.vibe),
  );

  const matchingUi = catalog.ui.filter(
    (u) =>
      u.recommendedStyles.includes(chosenStyle.id) ||
      u.vibes.includes(chosenStyle.vibe),
  );

  const matchingTemplates = (catalog.templates ?? []).filter(
    (t) =>
      t.recommendedStyles.includes(chosenStyle.id) ||
      t.vibes.includes(chosenStyle.vibe),
  );

  const matchingPages = (catalog.pages ?? []).filter(
    (p) =>
      p.recommendedStyles.includes(chosenStyle.id) ||
      p.vibes.includes(chosenStyle.vibe),
  );

  return {
    niche,
    recommendedStyle: {
      id: chosenStyle.id,
      name: chosenStyle.name,
      vibe: chosenStyle.vibe,
    },
    templates: matchingTemplates.map((t) => ({ id: t.id, category: t.category, name: t.name })),
    referencePages: matchingPages.map((p) => ({ id: p.id, category: p.category, name: p.name })),
    sections: matchingSections.map((s) => ({
      id: s.id,
      category: s.category,
      name: s.name,
    })),
    uiPrimitives: matchingUi.map((u) => ({
      id: u.id,
      category: u.category,
      name: u.name,
    })),
    assemblySteps: [
      `Call get_style("${chosenStyle.id}") and add tokens.css + Google Fonts to the target app.`,
      "Call get_component(id) for each selected section and UI primitive.",
      "Wrap the root layout with SmoothScrollProvider if scroll animations are used.",
      "Adapt copy, images, and props to the client brief while preserving --rk-* CSS variables.",
    ],
  };
}

export function registerBlueprintTools(server: McpServer) {
  server.tool(
    "suggest_page_blueprint",
    "Recommend a cohesive Rakitek website style preset, section stack, and UI primitives for a target landing-page niche.",
    {
      niche: z.string().describe("Target niche, e.g. 'coffee-shop', 'saas', 'company-profile', 'travel'"),
      styleId: z.string().optional().describe("Optional preferred style ID from list_styles"),
    },
    async ({ niche, styleId }) => ({
      content: [
        { type: "text", text: JSON.stringify(suggestBlueprintResult(niche, styleId), null, 2) },
      ],
    }),
  );
}
