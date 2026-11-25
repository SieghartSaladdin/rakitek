"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SelectOption } from "@/lib/catalog-utils";

interface DropdownSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  align?: "left" | "right";
}

export function DropdownSelect({
  label,
  value,
  options,
  onChange,
  align = "left",
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const activeOption = options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-white/15 bg-[#141418] px-3.5 text-xs text-zinc-100 transition-colors hover:border-white/30 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="flex items-center gap-2">
          <span className="text-zinc-400">{label}:</span>
          {activeOption?.swatchColor ? (
            <span
              className="h-2.5 w-2.5 rounded-full border border-white/25"
              style={{ backgroundColor: activeOption.swatchColor }}
              aria-hidden="true"
            />
          ) : null}
          <span className="font-semibold capitalize">{activeOption?.label ?? value}</span>
        </span>
        <span
          aria-hidden="true"
          className={`text-[10px] text-zinc-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className={`absolute z-30 mt-2 min-w-[210px] overflow-hidden rounded-xl border border-white/15 bg-[#141418] p-1 shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    selected
                      ? "bg-white text-black font-semibold"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2 capitalize">
                    {opt.swatchColor ? (
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/25"
                        style={{ backgroundColor: opt.swatchColor }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span>{opt.label}</span>
                  </span>
                  {typeof opt.count === "number" ? (
                    <span
                      className={`font-mono text-[11px] ${
                        selected ? "text-black/75" : "text-zinc-400"
                      }`}
                    >
                      {opt.count}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
