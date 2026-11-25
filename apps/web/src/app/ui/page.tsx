import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getItemsByKind } from "@/lib/catalog";

export default function UiCatalogPage() {
  return (
    <CatalogBrowser
      kind="ui"
      title="UI Components"
      subtitle="Multi-style buttons, inputs, drawers, and interactive primitives rendered in their native design style."
      items={getItemsByKind("ui")}
    />
  );
}
