"use client";

import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { OrchardRollingToggle } from "@registry/ui/orchard-rolling-toggle/component";
import { DefaultBrandCrest } from "./default-crest";
import { OrchardNavOverlay, type OrchardHeaderNavItem } from "./nav-overlay";
import styles from "./styles.module.css";

export type { OrchardHeaderNavItem };

export interface OrchardLanguageOption {
  code: string;
  label: string;
  href?: string;
}

export interface OrchardTopHeaderProps {
  id?: string;
  brandName?: string;
  brandSubtitle?: string;
  brandHref?: string;
  brandAriaLabel?: string;
  brandLogo?: ReactNode;
  showLangSwitcher?: boolean;
  languages?: OrchardLanguageOption[];
  activeLang?: string;
  langSwitcherAriaLabel?: string;
  onLangChange?: (code: string) => void;
  menuLabel?: string;
  closeLabel?: string;
  navOpen?: boolean;
  onNavOpenChange?: (open: boolean) => void;
  primaryNav?: OrchardHeaderNavItem[];
  secondaryNav?: OrchardHeaderNavItem[];
  legalLinks?: OrchardHeaderNavItem[];
  navAriaLabel?: string;
  onNavigate?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  theme?: "dark" | "light";
  autoCompactOnScroll?: boolean;
  autoHideOnScroll?: boolean;
  enableOverlay?: boolean;
  className?: string;
}

const DEFAULT_LANGUAGES: OrchardLanguageOption[] = [
  { code: "it", label: "IT", href: "#lang-it" },
  { code: "en", label: "EN", href: "#lang-en" },
];

const DEFAULT_PRIMARY_NAV: OrchardHeaderNavItem[] = [
  { label: "Home", href: "#top" },
  { label: "Pantry", href: "#pantry", active: true },
  { label: "Harvest", href: "#harvest" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const DEFAULT_SECONDARY_NAV: OrchardHeaderNavItem[] = [
  { label: "Tasting Room", href: "#experiences" },
  { label: "Instagram", href: "https://instagram.com", external: true },
];

export function OrchardTopHeader({
  id,
  brandName = "SOLARA",
  brandSubtitle = "Orchard",
  brandHref = "#top",
  brandAriaLabel,
  brandLogo,
  showLangSwitcher = true,
  languages = DEFAULT_LANGUAGES,
  activeLang = "en",
  langSwitcherAriaLabel = "Language switcher",
  onLangChange,
  menuLabel = "menu",
  closeLabel = "close",
  navOpen: controlledOpen,
  onNavOpenChange,
  primaryNav = DEFAULT_PRIMARY_NAV,
  secondaryNav = DEFAULT_SECONDARY_NAV,
  legalLinks = [],
  navAriaLabel = "Main navigation",
  onNavigate,
  theme = "dark",
  autoCompactOnScroll = true,
  autoHideOnScroll = false,
  enableOverlay = true,
  className,
}: OrchardTopHeaderProps) {
  const overlayId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const fullGroupRef = useRef<HTMLSpanElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onNavOpenChange?.(next);
  };

  useEffect(() => {
    const syncBrandHeight = () => {
      const brand = brandRef.current;
      const group = fullGroupRef.current;
      if (!brand || !group) return;
      const h = group.getBoundingClientRect().height;
      if (h) brand.style.height = `${h}px`;
    };
    syncBrandHeight();

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      if (autoCompactOnScroll) setCompact(y > 33);
      if (autoHideOnScroll && y > 200) {
        if (y - lastY > 6) setHidden(true);
        else if (lastY - y > 6) setHidden(false);
      } else {
        setHidden(false);
      }
      lastY = y;
    };

    window.addEventListener("resize", syncBrandHeight, { passive: true });
    if (autoCompactOnScroll || autoHideOnScroll) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", syncBrandHeight);
      window.removeEventListener("scroll", onScroll);
    };
  }, [autoCompactOnScroll, autoHideOnScroll]);

  const headerClasses = [
    styles.header,
    compact && !open ? styles.isCompact : "",
    hidden && !open ? styles.isHidden : "",
    open ? styles.isNavOpen : "",
    theme === "light" ? styles.isLight : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header
        id={id}
        ref={headerRef}
        className={headerClasses}
        data-header-theme={theme}
        data-header-logo={compact && !open ? "compact" : "full"}
      >
        <div className={styles.bar}>
          <div className={`${styles.side} ${styles.sideStart}`}>
            {showLangSwitcher && languages.length ? (
              <nav className={styles.langSwitcher} aria-label={langSwitcherAriaLabel}>
                {languages.map((lang) => {
                  const isActive = lang.code === activeLang;
                  const cls = `${styles.langItem} ${isActive ? styles.langActive : ""}`;
                  if (onLangChange) {
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        className={cls}
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => onLangChange(lang.code)}
                      >
                        {lang.label}
                      </button>
                    );
                  }
                  return (
                    <a
                      key={lang.code}
                      href={lang.href ?? `#${lang.code}`}
                      className={cls}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {lang.label}
                    </a>
                  );
                })}
              </nav>
            ) : null}
          </div>

          <div className={styles.center}>
            <div ref={brandRef} className={styles.brand}>
              <a
                href={brandHref}
                className={styles.brandLink}
                aria-label={brandAriaLabel ?? `${brandName} ${brandSubtitle}`.trim()}
                onClick={onNavigate ? (e) => onNavigate(brandHref, e) : undefined}
              >
                <span ref={fullGroupRef} className={styles.logoSvg}>
                  {brandLogo ?? (
                    <DefaultBrandCrest
                      brandName={brandName}
                      brandSubtitle={brandSubtitle}
                      iconClassName={styles.logoIcon}
                      wordmarkClassName={styles.logoWordmark}
                      subClassName={styles.logoSub}
                    />
                  )}
                </span>
              </a>
            </div>
          </div>

          <div className={`${styles.side} ${styles.sideEnd}`}>
            <OrchardRollingToggle
              open={open}
              onToggle={() => setOpen(!open)}
              menuLabel={menuLabel}
              closeLabel={closeLabel}
              theme={open ? "dark" : theme}
              controlsId={enableOverlay ? overlayId : undefined}
            />
          </div>
        </div>
      </header>

      {enableOverlay ? (
        <OrchardNavOverlay
          id={overlayId}
          open={open}
          primaryNav={primaryNav}
          secondaryNav={secondaryNav}
          legalLinks={legalLinks}
          navAriaLabel={navAriaLabel}
          onClose={() => setOpen(false)}
          onNavigate={onNavigate}
        />
      ) : null}
    </>
  );
}
