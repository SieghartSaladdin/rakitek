"use client";

import { useState } from "react";
import { INSTALL_SNIPPETS, MCP_URL, type InstallClient } from "@/lib/docs-snippets";
import { CodeViewer } from "./CodeViewer";
import { useLanguage } from "./LanguageProvider";

const CLIENTS: { id: InstallClient; label: string }[] = [
  { id: "claude", label: "Claude Code" },
  { id: "antigravity", label: "Antigravity" },
];

const toTabs = (items: { name: string; code: string }[]) =>
  items.map((item) => ({ name: item.name, path: item.name, code: item.code }));

export function InstallGuide() {
  const { copy } = useLanguage();
  const t = copy.docs.install;
  const [client, setClient] = useState<InstallClient>("claude");
  const snippets = INSTALL_SNIPPETS[client];
  const steps = t.steps[client];

  return (
    <section id="install" className="scroll-mt-8 space-y-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">{t.tag}</p>
        <h2 className="mt-1 text-2xl font-bold">{t.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          {t.intro} <code className="break-all font-mono text-white">{MCP_URL}</code>. {t.note}
        </p>
      </div>

      <div role="tablist" aria-label={t.clientLabel} className="inline-flex rounded-full border border-white/10 bg-[#141418] p-1">
        {CLIENTS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={client === c.id}
            onClick={() => setClient(c.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              client === c.id ? "bg-white text-black" : "text-zinc-300 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ol className="space-y-6">
        <li className="space-y-3">
          <h3 className="text-base font-semibold text-white">1. {steps.mcpTitle}</h3>
          <p className="max-w-2xl text-sm text-zinc-300">{steps.mcpDesc}</p>
          <CodeViewer files={toTabs(snippets.mcp)} />
        </li>
        <li className="space-y-3">
          <h3 className="text-base font-semibold text-white">2. {steps.skillTitle}</h3>
          <p className="max-w-2xl text-sm text-zinc-300">{steps.skillDesc}</p>
          <CodeViewer files={toTabs(snippets.skill)} />
        </li>
        <li className="space-y-3">
          <h3 className="text-base font-semibold text-white">3. {t.checkTitle}</h3>
          <p className="max-w-2xl text-sm text-zinc-300">{steps.checkDesc}</p>
          <CodeViewer code={snippets.check} filename={t.checkFilename} />
          <p className="rounded-lg border border-white/10 bg-[#0c0c0e] p-3 font-mono text-xs text-zinc-200">
            {t.tryPrompt}
          </p>
        </li>
      </ol>
    </section>
  );
}
