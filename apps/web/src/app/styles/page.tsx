import { StylesView } from "@/components/StylesView";
import { getAllStyles } from "@/lib/catalog";
import { getSourceBundle } from "@/lib/sources";

export default function StylesPage() {
  const styles = getAllStyles();
  const codesById = Object.fromEntries(
    styles.map((style) => [style.id, getSourceBundle(`style/${style.id}`).code]),
  );

  return <StylesView styles={styles} codesById={codesById} />;
}
