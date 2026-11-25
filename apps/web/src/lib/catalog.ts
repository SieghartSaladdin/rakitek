import catalogData from "../generated/catalog.json";
import type {
  AtomicLevel,
  CatalogComponentEntry,
  CatalogStyleEntry,
  ComponentKind,
  RakitekCatalog,
} from "../../../../registry/schema";

export const catalog = catalogData as RakitekCatalog;

export const VALID_COMPONENT_KINDS: readonly ComponentKind[] = [
  "ui",
  "section",
  "template",
  "page",
];

export function isComponentKind(value: string): value is ComponentKind {
  return (VALID_COMPONENT_KINDS as readonly string[]).includes(value);
}

export function getAllStyles(): CatalogStyleEntry[] {
  return catalog.styles;
}

export function getAllComponents(): CatalogComponentEntry[] {
  return [
    ...catalog.ui,
    ...catalog.sections,
    ...(catalog.templates ?? []),
    ...(catalog.pages ?? []),
  ];
}

export function getItemsByKind(kind: ComponentKind): CatalogComponentEntry[] {
  if (kind === "ui") return catalog.ui;
  if (kind === "section") return catalog.sections;
  if (kind === "template") return catalog.templates ?? [];
  return catalog.pages ?? [];
}

export function getItemsByLevel(level: AtomicLevel): CatalogComponentEntry[] {
  return getAllComponents().filter((item) => item.level === level);
}

export function findComponent(
  kind: ComponentKind,
  id: string,
): CatalogComponentEntry | undefined {
  return getItemsByKind(kind).find((item) => item.id === id);
}
