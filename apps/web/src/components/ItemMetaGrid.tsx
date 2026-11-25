import Link from "next/link";
import type { CatalogComponentEntry } from "../../../../registry/schema";

interface ItemMetaGridProps {
  item: CatalogComponentEntry;
  primaryStyle: string;
}

export function ItemMetaGrid({ item, primaryStyle }: ItemMetaGridProps) {
  return (
    <dl className="grid gap-3 pt-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-white/10 bg-[#141418] p-3.5">
        <dt className="text-zinc-400">Native Style</dt>
        <dd className="mt-1">
          <Link
            href={`/styles#${primaryStyle}`}
            className="font-mono font-semibold text-white underline-offset-4 hover:underline"
          >
            {primaryStyle}
          </Link>
        </dd>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#141418] p-3.5">
        <dt className="text-zinc-400">Styling &amp; Level</dt>
        <dd className="mt-1 font-mono uppercase text-zinc-100">
          {item.styling ?? "tailwind"} · {item.level}
        </dd>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#141418] p-3.5">
        <dt className="text-zinc-400">Dependencies</dt>
        <dd className="mt-1 font-mono text-zinc-200">
          {item.dependencies.length > 0
            ? `npm i ${item.dependencies.join(" ")}`
            : "None (Zero deps)"}
        </dd>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#141418] p-3.5">
        <dt className="text-zinc-400">Source Reference</dt>
        <dd className="mt-1 font-mono text-zinc-200">{item.sourceRef}</dd>
      </div>
    </dl>
  );
}
