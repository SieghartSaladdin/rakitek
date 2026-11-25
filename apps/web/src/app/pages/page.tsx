import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getItemsByLevel } from "@/lib/catalog";

export default function PagesCatalogPage() {
  return (
    <CatalogBrowser
      kind="page"
      title="Pages"
      subtitle="Full composed reference demo pages built from Rakitek templates and organisms with neutral sample data and live state."
      items={getItemsByLevel("page")}
    />
  );
}
