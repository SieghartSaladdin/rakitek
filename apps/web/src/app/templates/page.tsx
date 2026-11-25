import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getItemsByLevel } from "@/lib/catalog";

export default function TemplatesCatalogPage() {
  return (
    <CatalogBrowser
      kind="template"
      title="Templates"
      subtitle="Reusable page layout shells defining rail widths, responsive grid regions, and organism slots."
      items={getItemsByLevel("template")}
    />
  );
}
