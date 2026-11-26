import { compact, fileBlock } from "../loader.js";
import { getComponentBundle, OUTPUT_BUDGET_CHARS } from "./components.js";

/** The get_component reply: a JSON header, then raw "=== <id>/<file> ===" blocks. */
export function getComponentReply({
  id,
  withComposed,
  includeExample,
}: {
  id: string;
  withComposed?: boolean;
  includeExample?: boolean;
}) {
  const bundle = getComponentBundle(id, withComposed ?? true);
  const blocksOf = (r: (typeof bundle)[number]) => {
    const blocks = [fileBlock(`${r.id}/component.tsx`, r.code)];
    if (r.stylesCss) blocks.push(fileBlock(`${r.id}/styles.module.css`, r.stylesCss));
    for (const [name, code] of Object.entries(r.extraFiles ?? {})) {
      blocks.push(fileBlock(`${r.id}/${name}`, code));
    }
    if ((includeExample ?? true) && r.id === id) {
      blocks.push(fileBlock(`${r.id}/example.tsx (reference only)`, r.usageExample));
    }
    return blocks;
  };
  const size = (blocks: { text: string }[]) => blocks.reduce((n, b) => n + b.text.length, 0);

  // Requested item always ships; children are added until the budget, the rest are named for follow-up calls.
  const main = bundle[bundle.length - 1];
  const mainBlocks = blocksOf(main);
  let used = size(mainBlocks);
  const included: typeof bundle = [];
  const fetchSeparately: string[] = [];
  const childBlocks = [];
  for (const r of bundle.slice(0, -1)) {
    const blocks = blocksOf(r);
    if (used + size(blocks) <= OUTPUT_BUDGET_CHARS) {
      used += size(blocks);
      included.push(r);
      childBlocks.push(...blocks);
    } else {
      fetchSeparately.push(r.id);
    }
  }

  const install = new Set(
    bundle.flatMap((r) => Object.entries(r.dependencies).map(([d, v]) => `"${d}@${v}"`)),
  );
  // withComposed:false ships only the requested item; name the children it imports so the
  // caller fetches them now instead of finding out from a failed build.
  const shipped = new Set([...included, main].map((r) => r.id));
  const alsoNeeded = (main.composedComponents ?? []).map((c) => c.id).filter((cid) => !shipped.has(cid) && !fetchSeparately.includes(cid));
  const header = {
    items: [...included, main].map((r) => ({ id: r.id, kind: r.kind, level: r.level, name: r.name })),
    ...(alsoNeeded.length > 0
      ? { alsoNeeded, alsoNeededNote: "Imported by this component but not in this reply. Call get_component({ id, withComposed: false }) for each unless you already have it." }
      : {}),
    ...(fetchSeparately.length > 0
      ? { fetchSeparately, fetchNote: "Too large for one reply. Call get_component({ id, withComposed: false, includeExample: false }) for each." }
      : {}),
    installCommand: install.size > 0 ? `npm install ${[...install].join(" ")}` : null,
    layout: "Put each <id>/ folder in your components dir. Rewrite `@registry/<folder>/<id>/component` imports to that folder. Keep ./ imports as-is.",
  };
  return [{ type: "text" as const, text: compact(header) }, ...childBlocks, ...mainBlocks];
}
