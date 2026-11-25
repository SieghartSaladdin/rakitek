import { CodeViewer } from "@/components/CodeViewer";
import {
  MCP_CONFIG_SNIPPET,
  MCP_TOOLS,
  PLUGIN_INSTALL_SNIPPET,
  USAGE_COMPONENT_SNIPPET,
  USAGE_LAYOUT_SNIPPET,
} from "@/lib/docs-snippets";

export default function DocsPage() {
  return (
    <div className="space-y-12">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
          Panduan lengkap cara memakai komponen Rakitek secara manual, menghubungkan{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
            rakitek-mcp
          </code>
          , dan memakai skill{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
            rakitek-extract
          </code>{" "}
          serta{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
            rakitek-build
          </code>
          .
        </p>
      </div>

      <section id="usage" className="scroll-mt-8 space-y-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">Section 01</p>
          <h2 className="mt-1 text-2xl font-bold">Cara Penggunaan Manual (Website &amp; Copy)</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            Setiap komponen di Rakitek memakai kontrak CSS Variables{" "}
            <code className="font-mono text-white">--rk-*</code> dan Tailwind CSS. Cukup pasang
            satu file <code className="font-mono text-white">tokens.css</code>, lalu salin
            komponen dari tab Code.
          </p>
        </div>

        <ol className="grid gap-3 text-xs sm:grid-cols-3">
          <li className="rounded-xl border border-white/10 bg-[#141418] p-4">
            <p className="font-mono text-zinc-400">Step 1</p>
            <p className="mt-1 font-semibold text-white">Pilih Website Style</p>
            <p className="mt-1 text-zinc-300">
              Buka halaman Styles, salin <code className="font-mono">tokens.css</code> dan muat
              Google Fonts yang tertera.
            </p>
          </li>
          <li className="rounded-xl border border-white/10 bg-[#141418] p-4">
            <p className="font-mono text-zinc-400">Step 2</p>
            <p className="mt-1 font-semibold text-white">Salin Komponen / Section</p>
            <p className="mt-1 text-zinc-300">
              Pilih item dari sidebar, cek preview Desktop/Tablet/Mobile, lalu salin file{" "}
              <code className="font-mono">component.tsx</code>.
            </p>
          </li>
          <li className="rounded-xl border border-white/10 bg-[#141418] p-4">
            <p className="font-mono text-zinc-400">Step 3</p>
            <p className="mt-1 font-semibold text-white">Ubah Props &amp; Konten</p>
            <p className="mt-1 text-zinc-300">
              Ganti teks, gambar, dan handler sesuai brief klien tanpa merusak sistem token{" "}
              <code className="font-mono">--rk-*</code>.
            </p>
          </li>
        </ol>

        <div className="grid gap-4 lg:grid-cols-2">
          <CodeViewer code={USAGE_LAYOUT_SNIPPET} filename="app/layout.tsx + globals.css" />
          <CodeViewer code={USAGE_COMPONENT_SNIPPET} filename="app/page.tsx" />
        </div>
      </section>

      <section id="mcp" className="scroll-mt-8 space-y-5 border-t border-white/10 pt-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">Section 02</p>
          <h2 className="mt-1 text-2xl font-bold">
            Dokumentasi MCP (<code className="font-mono text-xl">rakitek-mcp</code>)
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            <code className="font-mono text-white">rakitek-mcp</code> berjalan melalui Stdio
            transport dan membaca langsung dari{" "}
            <code className="font-mono text-white">registry/.generated/catalog.json</code>.
            Setiap kali kamu menjalankan <code className="font-mono text-white">npm run sync</code>
            , item baru langsung tersedia di semua tool MCP.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#141418]">
          <table className="w-full min-w-[600px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 font-mono text-zinc-400">
                <th className="px-4 py-3">Tool Name</th>
                <th className="px-4 py-3">Arguments</th>
                <th className="px-4 py-3">Fungsi</th>
              </tr>
            </thead>
            <tbody>
              {MCP_TOOLS.map((tool) => (
                <tr key={tool.name} className="border-b border-white/10 last:border-b-0">
                  <td className="px-4 py-3 font-mono font-semibold text-white">{tool.name}</td>
                  <td className="px-4 py-3 font-mono text-zinc-300">{tool.args}</td>
                  <td className="px-4 py-3 text-zinc-300">{tool.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeViewer code={MCP_CONFIG_SNIPPET} filename="mcp_config.json" />
      </section>

      <section id="skills" className="scroll-mt-8 space-y-5 border-t border-white/10 pt-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">Section 03</p>
          <h2 className="mt-1 text-2xl font-bold">Dokumentasi Skills &amp; Plugin Antigravity</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            Bundle plugin berada di <code className="font-mono text-white">packages/plugin/</code>{" "}
            dan menyatukan MCP server, aturan proyek, serta 2 skill utama.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-[#141418] p-6">
            <p className="font-mono text-xs text-zinc-400">Skill 01 (Ingestion)</p>
            <h3 className="mt-1 text-lg font-semibold text-white">rakitek-extract</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              Membedah proyek Next.js hasil REA menjadi Website Style, UI Components, dan Sections
              sesuai kontrak <code className="font-mono">--rk-*</code>, lalu menjalankan{" "}
              <code className="font-mono">npm run sync</code> dan{" "}
              <code className="font-mono">npm run lint</code> agar langsung muncul di website dan
              MCP.
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-[#0c0c0e] p-3 font-mono text-[11px] text-zinc-200">
              Contoh prompt: &quot;Ekstrak folder fnb-bakery/agrumea-farm ke rakitek pakai skill
              rakitek-extract.&quot;
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#141418] p-6">
            <p className="font-mono text-xs text-zinc-400">Skill 02 (Assembly)</p>
            <h3 className="mt-1 text-lg font-semibold text-white">rakitek-build</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              Memandu AI di proyek klien baru agar mengambil style dan komponen teruji dari{" "}
              <code className="font-mono">rakitek-mcp</code>, memasang{" "}
              <code className="font-mono">SmoothScrollProvider</code> tunggal, dan mengedit props
              sesuai brief.
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-[#0c0c0e] p-3 font-mono text-[11px] text-zinc-200">
              Contoh prompt: &quot;Bangun landing page coffee shop pakai rakitek-build dan style
              editorial-roastery.&quot;
            </p>
          </article>
        </div>

        <CodeViewer code={PLUGIN_INSTALL_SNIPPET} filename="Install Plugin Global (PowerShell)" />
      </section>
    </div>
  );
}
