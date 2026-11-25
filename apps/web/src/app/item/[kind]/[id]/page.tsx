import { notFound } from "next/navigation";
import { ItemDetailView } from "@/components/ItemDetailView";
import { findComponent, getAllComponents, isComponentKind } from "@/lib/catalog";
import { getSourceBundle } from "@/lib/sources";

interface ItemPageProps {
  params: Promise<{ kind: string; id: string }>;
}

export function generateStaticParams() {
  return getAllComponents().map((item) => ({ kind: item.kind, id: item.id }));
}

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const { kind, id } = await params;
  if (!isComponentKind(kind)) notFound();

  const item = findComponent(kind, id);
  if (!item) notFound();

  const source = getSourceBundle(`${kind}/${id}`);
  return (
    <ItemDetailView
      item={item}
      code={source.code}
      stylesCss={source.stylesCss}
      previewCode={source.preview}
      extraFiles={source.extraFiles}
    />
  );
}
