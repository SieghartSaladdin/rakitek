"use client";

import {
  MCP_TOOLS,
  MCP_URL,
  USAGE_COMPONENT_SNIPPET,
  USAGE_LAYOUT_SNIPPET,
} from "@/lib/docs-snippets";
import { CodeViewer } from "./CodeViewer";
import { InstallGuide } from "./InstallGuide";
import { useLanguage } from "./LanguageProvider";

export function DocsView() {
  const { copy } = useLanguage();
  const d = copy.docs;

  return (
    <div className="space-y-12">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{d.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
          {d.introPart1}{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
            rakitek-mcp
          </code>
          {d.introPart2}{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
            rakitek-build
          </code>
          .
        </p>
      </div>

      <InstallGuide />

      <section id="usage" className="scroll-mt-8 space-y-5 border-t border-white/10 pt-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">{d.sec1Tag}</p>
          <h2 className="mt-1 text-2xl font-bold">{d.sec1Title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            {d.sec1Intro1}{" "}
            <code className="font-mono text-white">--rk-*</code> {d.sec1Intro2}{" "}
            <code className="font-mono text-white">tokens.css</code>
            {d.sec1Intro3}
          </p>
        </div>

        <ol className="grid gap-3 text-xs sm:grid-cols-3">
          {d.steps.map((s) => (
            <li key={s.step} className="rounded-xl border border-white/10 bg-[#141418] p-4">
              <p className="font-mono text-zinc-400">{s.step}</p>
              <p className="mt-1 font-semibold text-white">{s.title}</p>
              <p className="mt-1 text-zinc-300">
                {s.beforeCode} <code className="font-mono">{s.code}</code> {s.afterCode}
              </p>
            </li>
          ))}
        </ol>

        <div className="grid gap-4 lg:grid-cols-2">
          <CodeViewer code={USAGE_LAYOUT_SNIPPET} filename="app/layout.tsx + globals.css" />
          <CodeViewer code={USAGE_COMPONENT_SNIPPET} filename="app/page.tsx" />
        </div>
      </section>

      <section id="mcp" className="scroll-mt-8 space-y-5 border-t border-white/10 pt-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">{d.sec2Tag}</p>
          <h2 className="mt-1 text-2xl font-bold">
            {d.sec2TitlePrefix} (<code className="font-mono text-xl">rakitek-mcp</code>)
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            <code className="font-mono text-white">rakitek-mcp</code> {d.sec2Intro1}{" "}
            <code className="break-all font-mono text-white">{MCP_URL}</code>. {d.sec2Intro2}{" "}
            <code className="font-mono text-white">npm run sync</code> {d.sec2Intro3}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#141418]">
          <table className="w-full min-w-[600px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 font-mono text-zinc-400">
                <th className="px-4 py-3">{d.tableTool}</th>
                <th className="px-4 py-3">{d.tableArgs}</th>
                <th className="px-4 py-3">{d.tablePurpose}</th>
              </tr>
            </thead>
            <tbody>
              {MCP_TOOLS.map((tool) => (
                <tr key={tool.name} className="border-b border-white/10 last:border-b-0">
                  <td className="px-4 py-3 font-mono font-semibold text-white">{tool.name}</td>
                  <td className="px-4 py-3 font-mono text-zinc-300">{tool.args}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {d.mcpToolPurposes[tool.name] ?? tool.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="skills" className="scroll-mt-8 space-y-5 border-t border-white/10 pt-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">{d.sec3Tag}</p>
          <h2 className="mt-1 text-2xl font-bold">{d.sec3Title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            {d.sec3Intro1}{" "}
            <code className="font-mono text-white">packages/plugin/skills/rakitek-build</code>{" "}
            {d.sec3Intro2}
          </p>
        </div>

        <div className="max-w-2xl">
          <article className="rounded-2xl border border-white/10 bg-[#141418] p-6">
            <p className="font-mono text-xs text-zinc-400">{d.skill2Tag}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">rakitek-build</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              {d.skill2Desc1} <code className="font-mono">rakitek-mcp</code>
              {d.skill2Desc2} <code className="font-mono">SmoothScrollProvider</code>{" "}
              {d.skill2Desc3}
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-[#0c0c0e] p-3 font-mono text-[11px] text-zinc-200">
              {d.skill2Prompt}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
