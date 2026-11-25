import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getItemsByLevel } from "@/lib/catalog";

export default function AtomsCatalogPage() {
  return (
    <CatalogBrowser
      kind="atom"
      title="Atoms"
      subtitle="Foundational interactive primitives with distinct style signatures (buttons, tickers, and micro-controls)."
      items={getItemsByLevel("atom")}
    />
  );
}
