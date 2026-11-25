import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getItemsByKind } from "@/lib/catalog";

export default function SectionsCatalogPage() {
  return (
    <CatalogBrowser
      kind="section"
      title="Sections"
      subtitle="Full landing-page sections extracted into clean, readable, props-driven TypeScript components ready for human or AI customization."
      items={getItemsByKind("section")}
    />
  );
}
