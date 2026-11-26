import { z } from "zod";

export const VibeSchema = z.enum([
  "editorial",
  "tactile",
  "corporate",
  "cinematic",
  "minimal",
]);

export type RakitekVibe = z.infer<typeof VibeSchema>;

export const StyleMetaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  vibe: VibeSchema,
  description: z.string().min(5),
  sourceRef: z.string().min(2),
  fonts: z.object({
    display: z.string(),
    body: z.string(),
    mono: z.string(),
    googleFontsUrl: z.string().url(),
  }),
  palettePreview: z.object({
    bg: z.string(),
    surface: z.string(),
    fg: z.string(),
    accent: z.string(),
  }),
  tags: z.array(z.string()).default([]),
});

export type StyleMeta = z.infer<typeof StyleMetaSchema>;

export const StylingModeSchema = z.enum(["css-modules", "tailwind", "hybrid"]);

export const AtomicLevelSchema = z.enum([
  "atom",
  "molecule",
  "organism",
  "template",
  "page",
]);

export type AtomicLevel = z.infer<typeof AtomicLevelSchema>;

export const ComposesRefSchema = z
  .string()
  .regex(/^(ui|sections|templates|pages)\/[a-z0-9-]+$/);

/**
 * What a section communicates on a page, independent of the site it was extracted from.
 * plan_page matches a brief's slots to these, so a "showcase" from a coffee shop can
 * still be offered for a company's service list.
 */
export const SectionRoleSchema = z.enum([
  "navigation",
  "hero",
  "offerings",
  "about",
  "process",
  "story",
  "stats",
  "proof",
  "engagement",
  "signup",
  "contact",
  "footer",
  "cart",
]);

export type SectionRole = z.infer<typeof SectionRoleSchema>;

export const ComponentKindSchema = z.enum(["ui", "section", "template", "page"]);

export type ComponentKind = z.infer<typeof ComponentKindSchema>;

export const ComponentMetaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  kind: ComponentKindSchema,
  level: AtomicLevelSchema,
  category: z.string().min(2),
  roles: z.array(SectionRoleSchema).default([]),
  name: z.string().min(2),
  description: z.string().min(5),
  styling: StylingModeSchema.default("tailwind"),
  vibes: z.array(VibeSchema).min(1),
  recommendedStyles: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  composes: z.array(ComposesRefSchema).default([]),
  sourceRef: z.string().min(2),
  tags: z.array(z.string()).default([]),
});

export type ComponentMeta = z.infer<typeof ComponentMetaSchema>;

export interface CatalogStyleEntry extends StyleMeta {
  tokensPath: string;
}

export interface ExtraFileRef {
  name: string;
  path: string;
}

export interface CatalogComponentEntry extends ComponentMeta {
  componentPath: string;
  previewPath: string;
  stylesPath?: string;
  extraFiles?: ExtraFileRef[];
}

export interface RakitekCatalog {
  generatedAt: string;
  styles: CatalogStyleEntry[];
  ui: CatalogComponentEntry[];
  sections: CatalogComponentEntry[];
  templates: CatalogComponentEntry[];
  pages: CatalogComponentEntry[];
}
