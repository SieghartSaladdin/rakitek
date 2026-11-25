"use client";

import type { CSSProperties } from "react";
import type { CatalogStyleEntry } from "../../../../registry/schema";
import { CodeViewer } from "./CodeViewer";
import { useLanguage } from "./LanguageProvider";

interface StylesViewProps {
  styles: CatalogStyleEntry[];
  codesById: Record<string, string>;
}

export function StylesView({ styles, codesById }: StylesViewProps) {
  const { copy } = useLanguage();

  return (
    <div className="space-y-10">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{copy.stylesPage.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          {copy.stylesPage.subtitleBeforeCode}{" "}
          <code className="text-white">tokens.css</code>{" "}
          {copy.stylesPage.subtitleAfterCode}
        </p>
      </div>

      <div className="space-y-10">
        {styles.map((style) => (
          <article
            key={style.id}
            id={style.id}
            className="scroll-mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#141418]"
          >
            <div
              data-rk-style={style.id}
              className="space-y-8 p-6 sm:p-10"
              style={{
                backgroundColor: "var(--rk-bg)",
                color: "var(--rk-fg)",
                fontFamily: "var(--rk-font-body)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span
                  className="border px-3 py-1 text-xs uppercase tracking-widest"
                  style={{
                    borderColor: "var(--rk-border)",
                    borderRadius: "var(--rk-radius-pill)",
                    fontFamily: "var(--rk-font-mono)",
                  }}
                >
                  {style.vibe} · ref: {style.sourceRef}
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--rk-fg-muted)" }}>
                  data-rk-style=&quot;{style.id}&quot;
                </span>
              </div>

              <div className="space-y-3">
                <h2
                  className="text-4xl font-bold leading-none md:text-6xl"
                  style={{
                    fontFamily: "var(--rk-font-display)",
                    textTransform:
                      "var(--rk-display-transform)" as CSSProperties["textTransform"],
                    letterSpacing: "var(--rk-display-tracking)",
                  }}
                >
                  {style.name}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "var(--rk-fg-muted)" }}>
                  {style.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                {Object.entries(style.palettePreview).map(([label, hex]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 border p-3"
                    style={{
                      backgroundColor: "var(--rk-surface)",
                      borderColor: "var(--rk-border)",
                      borderRadius: "var(--rk-radius-md)",
                    }}
                  >
                    <span
                      className="h-9 w-9 shrink-0 rounded-md border border-black/20"
                      style={{ backgroundColor: hex }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-mono font-semibold">--rk-{label}</p>
                      <p className="font-mono text-[11px]" style={{ color: "var(--rk-fg-muted)" }}>
                        {hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 text-xs sm:grid-cols-3">
                <div
                  className="border p-4"
                  style={{
                    backgroundColor: "var(--rk-surface)",
                    borderColor: "var(--rk-border)",
                    borderRadius: "var(--rk-radius-md)",
                  }}
                >
                  <p style={{ color: "var(--rk-fg-muted)" }}>{copy.stylesPage.displayFont}</p>
                  <p
                    className="mt-1.5 text-lg font-bold"
                    style={{ fontFamily: "var(--rk-font-display)" }}
                  >
                    Aa Bb Cc 123
                  </p>
                  <p className="mt-1 font-mono text-[11px]" style={{ color: "var(--rk-fg-muted)" }}>
                    {style.fonts.display}
                  </p>
                </div>
                <div
                  className="border p-4"
                  style={{
                    backgroundColor: "var(--rk-surface)",
                    borderColor: "var(--rk-border)",
                    borderRadius: "var(--rk-radius-md)",
                  }}
                >
                  <p style={{ color: "var(--rk-fg-muted)" }}>{copy.stylesPage.bodyFont}</p>
                  <p className="mt-1.5 text-base font-medium">{copy.stylesPage.bodySample}</p>
                  <p className="mt-1 font-mono text-[11px]" style={{ color: "var(--rk-fg-muted)" }}>
                    {style.fonts.body}
                  </p>
                </div>
                <div
                  className="border p-4"
                  style={{
                    backgroundColor: "var(--rk-surface)",
                    borderColor: "var(--rk-border)",
                    borderRadius: "var(--rk-radius-md)",
                  }}
                >
                  <p style={{ color: "var(--rk-fg-muted)" }}>{copy.stylesPage.radiusGeometry}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    {(["sm", "md", "lg", "pill"] as const).map((r) => (
                      <span
                        key={r}
                        className="border px-2.5 py-1 font-mono text-[10px]"
                        style={{
                          borderColor: "var(--rk-border-strong)",
                          borderRadius: `var(--rk-radius-${r})`,
                        }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-5">
              <CodeViewer code={codesById[style.id] ?? ""} filename={style.tokensPath} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
