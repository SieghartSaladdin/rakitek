import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { LivePreviewFrame } from "@/components/LivePreviewFrame";

export default function OverviewPage() {
  const featuredSection = catalog.sections[0];
  const featuredUi = catalog.ui.slice(0, 2);

  return (
    <div className="space-y-14">
      <section className="space-y-6 border-b border-white/10 pb-10">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
          Rakit website level Awwwards dari komponen teruji, bukan generate kira-kira.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">
          Gunakan sidebar di sebelah kiri untuk mencari dan membuka langsung setiap Website Style,
          UI Component, maupun Section hasil ekstraksi REA. Semua komponen memakai kontrak token{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
            --rk-*
          </code>{" "}
          sehingga mudah diedit manusia maupun AI.
        </p>

        <div className="grid gap-4 pt-2 sm:grid-cols-3">
          <Link
            href="/styles"
            className="rounded-xl border border-white/10 bg-[#141418] p-5 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <p className="font-mono text-xs text-zinc-400">Website Styles</p>
            <p className="mt-2 text-3xl font-bold">{catalog.styles.length}</p>
            <p className="mt-1 text-xs text-zinc-400">Typography, palette, and radius presets</p>
          </Link>
          <Link
            href="/ui"
            className="rounded-xl border border-white/10 bg-[#141418] p-5 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <p className="font-mono text-xs text-zinc-400">UI Components</p>
            <p className="mt-2 text-3xl font-bold">{catalog.ui.length}</p>
            <p className="mt-1 text-xs text-zinc-400">Buttons, inputs, drawers, and variants</p>
          </Link>
          <Link
            href="/sections"
            className="rounded-xl border border-white/10 bg-[#141418] p-5 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <p className="font-mono text-xs text-zinc-400">Sections</p>
            <p className="mt-2 text-3xl font-bold">{catalog.sections.length}</p>
            <p className="mt-1 text-xs text-zinc-400">Readable, editable landing page blocks</p>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#141418] p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Workflow 01: Copy Manual
          </p>
          <h2 className="mt-2 text-lg font-semibold">Pilih Style, Copy Komponen</h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-300">
            Buka halaman <strong className="text-white">Styles</strong> untuk menyalin{" "}
            <code className="font-mono text-zinc-100">tokens.css</code> ke proyek Next.js kamu, lalu
            salin komponen atau section yang dibutuhkan lewat tab Code.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141418] p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Workflow 02: AI + MCP
          </p>
          <h2 className="mt-2 text-lg font-semibold">Rakit Otomatis Lewat rakitek-mcp</h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-300">
            Klik <strong className="text-white">Copy MCP Prompt</strong> di halaman detail item
            mana pun, atau suruh AI memanggil{" "}
            <code className="font-mono text-zinc-100">suggest_page_blueprint</code> untuk merakit 1
            halaman utuh.
          </p>
        </div>
      </section>

      {featuredSection ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Featured Section</h2>
              <p className="text-xs text-zinc-400">
                {featuredSection.name} ({featuredSection.recommendedStyles[0] ?? "editorial-roastery"})
              </p>
            </div>
            <Link
              href={`/item/section/${featuredSection.id}`}
              className="inline-flex min-h-[44px] items-center px-2 text-xs font-semibold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Inspect &amp; Code
            </Link>
          </div>
          <LivePreviewFrame
            itemKey={`section/${featuredSection.id}`}
            styleId={featuredSection.recommendedStyles[0]}
            href={`/item/section/${featuredSection.id}`}
            title={featuredSection.name}
          />
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Featured UI Components</h2>
          <Link
            href="/ui"
            className="inline-flex min-h-[44px] items-center px-2 text-xs font-semibold text-zinc-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            View all UI
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredUi.map((item) => (
            <div key={item.id} className="space-y-2">
              <LivePreviewFrame
                itemKey={`ui/${item.id}`}
                styleId={item.recommendedStyles[0]}
                href={`/item/ui/${item.id}`}
                title={item.name}
                compact
              />
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="font-medium text-zinc-200">{item.name}</span>
                <Link
                  href={`/item/ui/${item.id}`}
                  className="inline-flex min-h-[44px] items-center px-2 text-zinc-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Open details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
