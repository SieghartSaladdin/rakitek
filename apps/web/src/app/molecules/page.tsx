import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getItemsByLevel } from "@/lib/catalog";

export default function MoleculesCatalogPage() {
  return (
    <CatalogBrowser
      kind="molecule"
      title="Molecules"
      subtitle="Focused multi-element units combining two to four primitives for a single task (product spec cards, waitlist forms)."
      items={getItemsByLevel("molecule")}
    />
  );
}
