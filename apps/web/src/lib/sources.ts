import "server-only";
import sourcesData from "../generated/sources.json";

export interface SourceBundle {
  code: string;
  stylesCss?: string;
  preview?: string;
  extraFiles?: Record<string, string>;
}

const sources = sourcesData as Record<string, SourceBundle>;

export function getSourceBundle(key: string): SourceBundle {
  return sources[key] ?? { code: "// Source not found. Run npm run sync." };
}
