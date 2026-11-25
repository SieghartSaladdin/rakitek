"use client";

import { useState, type ReactNode } from "react";

interface SidebarAccordionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  children: ReactNode;
}

export function SidebarAccordion({
  title,
  count,
  defaultOpen = true,
  forceOpen = false,
  children,
}: SidebarAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = forceOpen || open;

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 text-left font-mono text-[11px] uppercase tracking-wider text-zinc-400 transition-colors hover:bg-white/6 hover:text-zinc-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {typeof count === "number" ? (
            <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-zinc-300">
              {count}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className={`text-[10px] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen ? (
        <div className="space-y-1 border-l border-white/10 pl-2.5 ml-3">{children}</div>
      ) : null}
    </div>
  );
}
