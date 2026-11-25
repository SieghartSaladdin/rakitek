import { CodeViewer } from "@/components/CodeViewer";
import { getAllStyles } from "@/lib/catalog";
import { getSourceBundle } from "@/lib/sources";

export default function StylesPage() {
  const styles = getAllStyles();

  return (
    <div className="space-y-10">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Website Styles</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          Paket lengkap token desain (palet warna, tipografi, border, radius, dan easing). Pasang
          satu file <code className="text-white">tokens.css</code> ke proyekmu agar seluruh
          komponen Rakitek seragam secara otomatis.
        </p>
      </div>

      <div className="space-y-10">
        {styles.map((style) => {
          const source = getSourceBundle(`style/${style.id}`);
          return (
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

                {/* Live Typography Specimen */}
                <div className="space-y-3">
                  <h2
                    className="text-4xl font-bold leading-none md:text-6xl"
                    style={{
                      fontFamily: "var(--rk-font-display)",
                      textTransform:
                        "var(--rk-display-transform)" as React.CSSProperties["textTransform"],
                      letterSpacing: "var(--rk-display-tracking)",
                    }}
                  >
                    {style.name}
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "var(--rk-fg-muted)" }}>
                    {style.description}
                  </p>
                </div>

                {/* Palette Swatches */}
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

                {/* Font & Radius Specimen */}
                <div className="grid gap-3 text-xs sm:grid-cols-3">
                  <div
                    className="border p-4"
                    style={{
                      backgroundColor: "var(--rk-surface)",
                      borderColor: "var(--rk-border)",
                      borderRadius: "var(--rk-radius-md)",
                    }}
                  >
                    <p style={{ color: "var(--rk-fg-muted)" }}>Display Font</p>
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
                    <p style={{ color: "var(--rk-fg-muted)" }}>Body Font</p>
                    <p className="mt-1.5 text-base font-medium">The quick brown fox</p>
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
                    <p style={{ color: "var(--rk-fg-muted)" }}>Radius Geometry</p>
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
                <CodeViewer code={source.code} filename={style.tokensPath} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
