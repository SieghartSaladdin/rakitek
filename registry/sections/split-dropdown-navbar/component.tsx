"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import {
  DesktopCategoryDropdown,
  MobileNavDrawer,
  type NavbarCategoryItem,
  type NavbarLinkItem,
} from "./navbar-menus";
import styles from "./styles.module.css";

export type { NavbarCategoryItem, NavbarLinkItem };

export interface SplitDropdownNavbarProps {
  brandName?: string;
  brandHref?: string;
  brandLogoSrc?: string;
  dropdownTitle?: string;
  dropdownAllLabel?: string;
  dropdownAllHref?: string;
  categories?: NavbarCategoryItem[];
  primaryLinks?: NavbarLinkItem[];
  drawerLinks?: NavbarLinkItem[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  onOpenSearch?: () => void;
  onDrawerToggle?: (open: boolean) => void;
  onNavigate?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  hideOnScroll?: boolean;
}

const DEFAULT_CATEGORIES: NavbarCategoryItem[] = [
  { id: "africa", label: "Africa", href: "#africa" },
  { id: "asia", label: "Asia", href: "#asia" },
  { id: "caribbean", label: "Central America & Caribbean", href: "#caribbean" },
  { id: "north-america", label: "North America", href: "#north-america" },
  { id: "south-america", label: "South America", href: "#south-america" },
  { id: "europe", label: "Europe & Mediterranean", href: "#europe" },
];

const DEFAULT_PRIMARY_LINKS: NavbarLinkItem[] = [
  { label: "Featured", href: "#featured" },
  { label: "Brochures", href: "#brochures" },
  { label: "Stories", href: "#stories" },
];

const DEFAULT_DRAWER_LINKS: NavbarLinkItem[] = [
  { label: "Partner Agencies", href: "#partners" },
  { label: "Traveler Hub", href: "#travelers", hasBorder: true },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function BrandMarkSvg({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 154 31" fill="none" className={styles.logo} aria-label={label}>
      <circle cx="15.5" cy="15.5" r="13.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 15.5H23M15.5 8V23" stroke="currentColor" strokeWidth="1.5" />
      <text x="38" y="21" fill="currentColor" fontFamily="serif" fontSize="18" fontWeight="600" letterSpacing="0.04em">
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

function SearchSvg() {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" aria-hidden="true">
      <circle cx="11.3" cy="11.3" r="7" transform="rotate(-45 11.3 11.3)" stroke="currentColor" strokeWidth="2" />
      <path d="M16.2 16.2L21.9 21.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DownArrowSvg() {
  return (
    <svg className={styles.dropdownCaret} viewBox="0 0 13 11" fill="none" aria-hidden="true">
      <path d="M1 1.5H9V9.5M9 9.5L6 6.5M9 9.5L12 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SplitDropdownNavbar({
  brandName = "Meridian",
  brandHref = "#top",
  brandLogoSrc,
  dropdownTitle = "Destinations",
  dropdownAllLabel = "View all destinations",
  dropdownAllHref = "#destinations",
  categories = DEFAULT_CATEGORIES,
  primaryLinks = DEFAULT_PRIMARY_LINKS,
  drawerLinks = DEFAULT_DRAWER_LINKS,
  ctaLabel = "Travel agent space",
  ctaHref = "#portal",
  ctaExternal = false,
  onOpenSearch,
  onDrawerToggle,
  onNavigate,
  hideOnScroll = true,
}: SplitDropdownNavbarProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (!hideOnScroll) return;
      const cur = window.scrollY;
      setIsHidden(cur > lastY && cur > 40);
      lastY = cur;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDesktopDropdownOpen(false);
        setIsNavOpen(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [hideOnScroll]);

  useEffect(() => {
    onDrawerToggle?.(isNavOpen);
  }, [isNavOpen, onDrawerToggle]);

  const closeAll = () => {
    setIsDesktopDropdownOpen(false);
    setIsNavOpen(false);
  };

  const headerCls = [
    styles.header,
    isHidden && !isNavOpen && !isDesktopDropdownOpen ? styles.isHidden : "",
    isNavOpen ? styles.navOpen : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerCls}>
      <a
        href={brandHref}
        className={styles.logoLink}
        onClick={(e) => {
          closeAll();
          onNavigate?.(brandHref, e);
        }}
      >
        {brandLogoSrc ? (
          <img src={brandLogoSrc} className={styles.logo} alt={brandName} />
        ) : (
          <BrandMarkSvg label={brandName} />
        )}
      </a>

      <div className={styles.right}>
        <ul className={styles.mainLinks}>
          <li className={`${styles.mainLinkWrapper} ${styles.hasDropdown} ${isDesktopDropdownOpen ? styles.isOpened : ""}`.trim()}>
            <a
              href={dropdownAllHref}
              className={styles.mainLink}
              onClick={(e) => {
                e.preventDefault();
                setIsDesktopDropdownOpen((v) => !v);
                setIsNavOpen(false);
              }}
            >
              <span className={styles.labelRoll} data-label={dropdownTitle}>
                <span>{dropdownTitle}</span>
              </span>
              <DownArrowSvg />
            </a>
            <DesktopCategoryDropdown
              isOpen={isDesktopDropdownOpen}
              categories={categories}
              dropdownAllHref={dropdownAllHref}
              dropdownAllLabel={dropdownAllLabel}
              onClose={closeAll}
              onNavigate={onNavigate}
            />
          </li>

          {primaryLinks.map((item) => (
            <li key={item.href} className={styles.mainLinkWrapper}>
              <a
                href={item.href}
                className={styles.mainLink}
                onClick={(e) => {
                  closeAll();
                  onNavigate?.(item.href, e);
                }}
              >
                <span className={styles.labelRoll} data-label={item.label}>
                  <span>{item.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.searchToggle}
          aria-label="Search"
          onClick={() => {
            closeAll();
            onOpenSearch?.();
          }}
        >
          <SearchSvg />
        </button>

        <RollingCtaButton
          href={ctaHref}
          external={ctaExternal}
          label={ctaLabel}
          variant="primary"
          isFixed
          isSmall
          className={styles.desktopCta}
          onClick={(e) => onNavigate?.(ctaHref, e as MouseEvent<HTMLAnchorElement>)}
        />

        <button
          type="button"
          className={styles.menuToggle}
          aria-label="Menu"
          aria-expanded={isNavOpen}
          onClick={() => setIsNavOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <MobileNavDrawer
        isOpen={isNavOpen}
        dropdownTitle={dropdownTitle}
        dropdownAllHref={dropdownAllHref}
        primaryLinks={primaryLinks}
        drawerLinks={drawerLinks}
        onClose={closeAll}
        onNavigate={onNavigate}
      />
    </header>
  );
}
