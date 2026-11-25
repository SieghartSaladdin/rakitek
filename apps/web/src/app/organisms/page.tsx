import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getItemsByLevel } from "@/lib/catalog";

export default function OrganismsCatalogPage() {
  return (
    <CatalogBrowser
      kind="organism"
      title="Organisms"
      subtitle="Standalone complex sections and panels grouped by category (heroes, navbars, drawers, showcases, quizzes, stories, stats, and footers)."
      items={getItemsByLevel("organism")}
    />
  );
}
