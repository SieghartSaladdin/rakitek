"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "./LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";
import { RakitekLogo } from "./RakitekLogo";
import { SidebarContent } from "./SidebarContent";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { copy } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  if (pathname === "/" || pathname.startsWith("/preview/")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile top header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0c0c0e]/95 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <RakitekLogo size={28} />
          <span>rakitek</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle compact />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="rk-mobile-sidebar"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 text-xs font-semibold text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>{copy.common.menu}</span>
          </button>
        </div>
      </header>

      {/* Desktop persistent left sidebar */}
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72 lg:shrink-0 lg:border-r lg:border-white/10 lg:bg-[#101014] lg:p-5">
        <SidebarContent />
      </aside>

      {/* Mobile slide-over sidebar drawer */}
      {mobileOpen ? (
        <div
          id="rk-mobile-sidebar"
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={copy.common.navMenuAria}
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#101014] p-5">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={copy.common.closeNavAria}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/15 px-3 text-xs text-zinc-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {copy.common.close}
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
