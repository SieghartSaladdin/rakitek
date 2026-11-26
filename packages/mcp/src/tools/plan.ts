import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { compact, loadCatalog, type ComponentEntry, type SectionRole } from "../loader.js";
import { allComponents } from "./components.js";

interface Slot {
  role: SectionRole;
  purpose: string;
  optional?: boolean;
}

interface Recipe {
  id: string;
  label: string;
  keywords: string[];
  slots: Slot[];
}

/**
 * Page kinds as ordered content needs. A slot names what the visitor should learn,
 * not which demo it came from, so any section with that role can fill it.
 */
const RECIPES: Recipe[] = [
  {
    id: "company-profile",
    label: "Company profile / agency / studio / services",
    keywords: ["company", "corporate", "profile", "agency", "studio", "firm", "consultant", "consulting", "contractor", "services", "business", "perusahaan", "profil", "jasa", "kontraktor", "konsultan", "kantor", "bisnis", "arsitek", "architecture"],
    slots: [
      { role: "navigation", purpose: "Brand and links to the sections below" },
      { role: "hero", purpose: "Who the company is and what it does, in one line" },
      { role: "offerings", purpose: "Services or product lines" },
      { role: "about", purpose: "Mission, history, why trust them" },
      { role: "process", purpose: "How working together goes, step by step", optional: true },
      { role: "stats", purpose: "Numbers: years, projects, clients", optional: true },
      { role: "proof", purpose: "Clients, partners, awards", optional: true },
      { role: "footer", purpose: "Contact details, address, social links" },
    ],
  },
  {
    id: "saas",
    label: "SaaS / app / startup product",
    keywords: ["saas", "app", "startup", "software", "product", "platform", "tool", "ai", "aplikasi", "produk"],
    slots: [
      { role: "navigation", purpose: "Brand, product links, primary CTA" },
      { role: "hero", purpose: "The product promise and main CTA" },
      { role: "stats", purpose: "Traction or impact numbers", optional: true },
      { role: "offerings", purpose: "Features or plans", optional: true },
      { role: "proof", purpose: "Logos, testimonials", optional: true },
      { role: "signup", purpose: "Waitlist or sign-up capture" },
      { role: "footer", purpose: "Legal and social links" },
    ],
  },
  {
    id: "storefront",
    label: "Shop / cafe / product store",
    keywords: ["shop", "store", "storefront", "ecommerce", "cafe", "coffee", "roastery", "bakery", "fnb", "restaurant", "toko", "kopi", "kafe", "restoran", "jualan", "katalog"],
    slots: [
      { role: "navigation", purpose: "Brand, shop links, cart" },
      { role: "hero", purpose: "Signature product or collection" },
      { role: "engagement", purpose: "Help the visitor choose", optional: true },
      { role: "offerings", purpose: "Collections or product rail" },
      { role: "about", purpose: "Brand story or sourcing", optional: true },
      { role: "process", purpose: "How it is made", optional: true },
      { role: "footer", purpose: "Newsletter, links, address" },
      { role: "cart", purpose: "Cart drawer", optional: true },
    ],
  },
  {
    id: "story",
    label: "Brand story / campaign / portfolio",
    keywords: ["story", "brand", "campaign", "portfolio", "manifesto", "editorial", "magazine", "cerita", "kampanye", "portofolio", "karya"],
    slots: [
      { role: "hero", purpose: "Opening statement" },
      { role: "story", purpose: "Chapters of the narrative" },
      { role: "offerings", purpose: "Works, chances, or highlights", optional: true },
      { role: "stats", purpose: "Impact in numbers", optional: true },
      { role: "proof", purpose: "Crests, partners, recognitions", optional: true },
      { role: "footer", purpose: "Closing call to action" },
    ],
  },
  {
    id: "waitlist",
    label: "Waitlist / launch / event",
    keywords: ["waitlist", "launch", "coming", "soon", "event", "beta", "preorder", "peluncuran", "acara", "daftar", "segera"],
    slots: [
      { role: "navigation", purpose: "Brand and a contact or join link", optional: true },
      { role: "hero", purpose: "What is launching and the sign-up field" },
      { role: "stats", purpose: "Why it matters, in numbers", optional: true },
      { role: "signup", purpose: "Second chance to join" },
      { role: "footer", purpose: "Minimal links" },
    ],
  },
];

function words(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);
}

export function pickRecipe(brief: string, pageType?: string): { recipe: Recipe; matched: boolean } {
  const direct = RECIPES.find((r) => r.id === pageType);
  if (direct) return { recipe: direct, matched: true };
  const w = new Set(words(brief));
  const scored = RECIPES.map((r) => ({ r, score: r.keywords.filter((k) => w.has(k)).length }));
  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best && best.score > 0 ? { recipe: best.r, matched: true } : { recipe: RECIPES[0], matched: false };
}

function briefScore(item: ComponentEntry, briefWords: Set<string>): number {
  const labels = [item.category, ...item.tags, ...item.vibes, ...words(item.id)];
  const prose = words(item.description);
  return labels.filter((l) => briefWords.has(l.toLowerCase())).length * 2 + prose.filter((p) => briefWords.has(p)).length;
}

export function planPageResult(args: { brief: string; pageType?: string; styleId?: string }) {
  const catalog = loadCatalog();
  const all = allComponents(catalog);
  const briefWords = new Set(words(args.brief));
  const { recipe, matched } = pickRecipe(args.brief, args.pageType);

  const styleScore = (s: (typeof catalog.styles)[number]) =>
    s.tags.filter((t) => briefWords.has(t.toLowerCase()) || recipe.keywords.includes(t.toLowerCase())).length +
    words(s.description).filter((w) => briefWords.has(w)).length;
  const style =
    catalog.styles.find((s) => s.id === args.styleId) ??
    [...catalog.styles].sort((a, b) => styleScore(b) - styleScore(a))[0];
  if (!style) throw new Error("No styles in registry. Run npm run sync.");

  const roleHolders = all.filter((c) => (c.kind === "section" || c.kind === "ui") && (c.roles ?? []).length > 0);
  const used = new Set<string>();

  const slots = recipe.slots.map((slot) => {
    const candidates = roleHolders
      .filter((c) => c.roles!.includes(slot.role))
      .map((c) => ({
        c,
        inStyle: c.recommendedStyles.includes(style.id),
        primary: c.roles![0] === slot.role,
        score: briefScore(c, briefWords),
      }))
      // One section per page: an unused candidate beats a better-styled one already picked above.
      .sort(
        (a, b) =>
          Number(used.has(a.c.id)) - Number(used.has(b.c.id)) ||
          Number(b.inStyle) - Number(a.inStyle) ||
          Number(b.primary) - Number(a.primary) ||
          b.score - a.score,
      );
    const pick = candidates[0];
    if (pick) used.add(pick.c.id);
    return {
      role: slot.role,
      purpose: slot.purpose,
      ...(slot.optional ? { optional: true } : {}),
      pick: pick?.c.id ?? null,
      candidates: candidates.map(({ c, inStyle }) => ({
        id: c.id,
        name: c.name,
        what: c.description.split(/(?<=\.)\s/)[0].slice(0, 160),
        ...(inStyle ? {} : { verifiedInStyle: false }),
        ...(c.roles!.length > 1 ? { alsoFits: c.roles!.filter((r) => r !== slot.role) } : {}),
      })),
      ...(pick ? {} : { gap: "No registry section has this role yet. Skip it, or write a small section that uses only var(--rk-*) tokens and the style's fonts." }),
    };
  });

  // A template is a page shell built around one navbar; offer the one that fits the picked navbar.
  const nav = slots.find((s) => s.role === "navigation")?.pick;
  const pages = catalog.pages ?? [];
  const shell = pages
    .filter((p) => nav && p.composes?.includes(`sections/${nav}`))
    .map((p) => p.composes?.find((ref) => ref.startsWith("templates/"))?.slice("templates/".length))
    .find(Boolean);

  return {
    brief: args.brief,
    pageType: recipe.id,
    ...(matched ? {} : { pageTypeNote: `No page type matched the brief; using "${recipe.id}". Pass pageType (${RECIPES.map((r) => r.id).join(", ")}) to choose.` }),
    style: { id: style.id, name: style.name, vibe: style.vibe },
    otherStyles: catalog.styles.filter((s) => s.id !== style.id).map((s) => s.id),
    shell: shell
      ? { template: shell, note: `Layout shell that fits ${nav}. Its slot props take any ReactNode, so put the picked sections in order; leave unused slots empty.` }
      : { template: null, note: "Stack the picked sections in order inside <main>." },
    slots,
    rules: [
      "pick is a suggestion. Choose per slot from candidates by the brief; drop optional slots that do not serve it.",
      "Candidates without verifiedInStyle:false were measured in this style. Others still use only var(--rk-*) tokens, so they adopt the style, but check them visually.",
      "Adapt through props: copy, images, links, ids, labels, formatPrice, and show/hide flags (e.g. showCart). Leave out parts the brief does not need by passing empty data or the hide prop.",
      "Do not rewrite a section's layout or animation. If a section cannot be made to fit with props, pick another candidate.",
    ],
    next: [
      `get_style("${style.id}") once.`,
      `get_component(<id>, { withComposed: false }) for each picked section${shell ? ` and for "${shell}"` : ""}. The example file shows every prop.`,
      "Build, then check 1440px and 390px for overflow, overlap and text contrast.",
    ],
  };
}

export function registerPlanTools(server: McpServer) {
  server.tool(
    "plan_page",
    "Start here for a new page. Turns a brief into ordered content slots (navigation, hero, offerings, about, ...) and offers every registry section that can fill each slot, from any demo, plus a style and layout shell.",
    {
      brief: z.string().describe("What the site is for, in the user's words, e.g. 'company profile for an architecture studio in Bandung'"),
      pageType: z
        .enum(["company-profile", "saas", "storefront", "story", "waitlist"])
        .optional()
        .describe("Force the page type when the brief is ambiguous"),
      styleId: z.string().optional().describe("Force a style ID"),
    },
    async (args) => ({ content: [{ type: "text", text: compact(planPageResult(args)) }] }),
  );
}
