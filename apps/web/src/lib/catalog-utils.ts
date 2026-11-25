import type { CatalogComponentEntry } from "../../../../registry/schema";

export interface SelectOption {
  value: string;
  label: string;
  count?: number;
  swatchColor?: string;
}

export interface CatalogFilterState {
  query: string;
  category: string;
  vibe: string;
  styleId: string;
}

export function groupByCategory(
  items: CatalogComponentEntry[],
): Array<{ category: string; items: CatalogComponentEntry[] }> {
  const map = new Map<string, CatalogComponentEntry[]>();
  for (const item of items) {
    const bucket = map.get(item.category) ?? [];
    bucket.push(item);
    map.set(item.category, bucket);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, groupItems]) => ({ category, items: groupItems }));
}

export function filterCatalogItems(
  items: CatalogComponentEntry[],
  filters: CatalogFilterState,
): CatalogComponentEntry[] {
  const q = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category) return false;
    if (
      filters.vibe !== "all" &&
      !item.vibes.includes(filters.vibe as CatalogComponentEntry["vibes"][number])
    ) {
      return false;
    }
    if (filters.styleId !== "all" && !item.recommendedStyles.includes(filters.styleId)) {
      return false;
    }
    if (q) {
      const hay = `${item.name} ${item.id} ${item.category} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function buildCategoryOptions(items: CatalogComponentEntry[]): SelectOption[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return [
    { value: "all", label: "All Categories", count: items.length },
    ...Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, count]) => ({ value, label: value, count })),
  ];
}

export function buildVibeOptions(items: CatalogComponentEntry[]): SelectOption[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const vibe of item.vibes) {
      counts.set(vibe, (counts.get(vibe) ?? 0) + 1);
    }
  }
  return [
    { value: "all", label: "All Vibes", count: items.length },
    ...Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, count]) => ({ value, label: value, count })),
  ];
}

export function getAdjacentItems(
  items: CatalogComponentEntry[],
  currentId: string,
): { prev: CatalogComponentEntry | null; next: CatalogComponentEntry | null } {
  const idx = items.findIndex((i) => i.id === currentId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? items[idx - 1] : null,
    next: idx < items.length - 1 ? items[idx + 1] : null,
  };
}
