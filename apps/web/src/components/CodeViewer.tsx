"use client";

import { useEffect, useState } from "react";

export interface CodeFileTab {
  name: string;
  path: string;
  code: string;
}

export function buildSourceFileTabs(params: {
  componentPath: string;
  stylesPath?: string;
  code: string;
  stylesCss?: string;
  extraFiles?: Record<string, string>;
}): CodeFileTab[] {
  const dir = params.componentPath.replace(/\/component\.tsx$/, "");
  const list: CodeFileTab[] = [
    { name: "component.tsx", path: params.componentPath, code: params.code },
  ];
  if (params.stylesCss !== undefined) {
    list.push({
      name: "styles.module.css",
      path: params.stylesPath ?? `${dir}/styles.module.css`,
      code: params.stylesCss,
    });
  }
  if (params.extraFiles) {
    for (const [name, content] of Object.entries(params.extraFiles)) {
      list.push({ name, path: `${dir}/${name}`, code: content });
    }
  }
  return list;
}

interface CodeViewerProps {
  code?: string;
  filename?: string;
  files?: CodeFileTab[];
}

export function CodeViewer({ code = "", filename, files }: CodeViewerProps) {
  const resolvedFiles: CodeFileTab[] =
    files && files.length > 0
      ? files
      : [{ name: filename ?? "code.tsx", path: filename ?? "code.tsx", code }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setCopied(false);
  }, [files, filename]);

  const activeFile = resolvedFiles[activeIndex] ?? resolvedFiles[0];
  const isMultiFile = resolvedFiles.length > 1;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#09090b]">
      {isMultiFile ? (
        <div
          className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-[#101014] px-3 py-2"
          role="tablist"
          aria-label="Component source files"
        >
          {resolvedFiles.map((file, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={file.path}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveIndex(idx);
                  setCopied(false);
                }}
                className={`min-h-[36px] rounded-md px-3 font-mono text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  active
                    ? "bg-white text-black font-semibold"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {file.name}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="truncate font-mono text-xs text-zinc-400">{activeFile.path}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/15 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {copied ? "Copied ✓" : isMultiFile ? "Copy File" : "Copy Code"}
        </button>
      </div>
      <pre className="max-h-[540px] overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-200">
        <code>{activeFile.code}</code>
      </pre>
    </div>
  );
}
