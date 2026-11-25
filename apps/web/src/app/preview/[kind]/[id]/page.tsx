import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StandalonePreview } from "@/components/StandalonePreview";
import { findComponent, getAllComponents, getAllStyles, isComponentKind } from "@/lib/catalog";

interface PreviewPageProps {
  params: Promise<{ kind: string; id: string }>;
}

export function generateStaticParams() {
  return getAllComponents().map((item) => ({ kind: item.kind, id: item.id }));
}

export default async function IsolatedPreviewPage({ params }: PreviewPageProps) {
  const { kind, id } = await params;
  if (!isComponentKind(kind)) {
    notFound();
  }

  const item = findComponent(kind, id);
  if (!item) {
    notFound();
  }

  const styles = getAllStyles();
  const primaryStyle = item.recommendedStyles[0] ?? styles[0]?.id ?? "editorial-roastery";

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0c0c0e] text-xs text-zinc-400">
          Loading preview...
        </div>
      }
    >
      <StandalonePreview
        itemKey={`${item.kind}/${item.id}`}
        kind={item.kind}
        defaultStyleId={primaryStyle}
      />
    </Suspense>
  );
}
