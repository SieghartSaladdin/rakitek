"use client";

import type { MouseEvent } from "react";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import styles from "./menus.module.css";

export interface NavbarCategoryItem {
  id: string;
  label: string;
  href: string;
  iconSrc?: string;
}

export interface NavbarLinkItem {
  label: string;
  href: string;
  hasBorder?: boolean;
}

export function CaretSvg() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true">
      <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DesktopCategoryDropdown({
  isOpen,
  categories,
  dropdownAllHref,
  dropdownAllLabel,
  onClose,
  onNavigate,
}: {
  isOpen: boolean;
  categories: NavbarCategoryItem[];
  dropdownAllHref: string;
  dropdownAllLabel: string;
  onClose: () => void;
  onNavigate?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <div
      className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`.trim()}
      data-lenis-prevent=""
    >
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <a
              href={cat.href}
              className={styles.dropdownLink}
              onClick={(e) => {
                onClose();
                onNavigate?.(cat.href, e);
              }}
            >
              <span className={styles.dropdownIcon}>
                {cat.iconSrc ? <img src={cat.iconSrc} alt="" width={50} height={50} /> : <CaretSvg />}
              </span>
              <span className={styles.dropdownLabel}>{cat.label}</span>
              <span className={styles.dropdownArrow} aria-hidden="true">
                <CaretSvg />
              </span>
            </a>
          </li>
        ))}
        <li>
          <RollingCtaButton
            href={dropdownAllHref}
            label={dropdownAllLabel}
            variant="primary"
            isFixed
            className={styles.dropdownAllCta}
            onClick={(e) => {
              onClose();
              onNavigate?.(dropdownAllHref, e as MouseEvent<HTMLAnchorElement>);
            }}
          />
        </li>
      </ul>
    </div>
  );
}

export function MobileNavDrawer({
  isOpen,
  dropdownTitle,
  dropdownAllHref,
  primaryLinks,
  drawerLinks,
  onClose,
  onNavigate,
}: {
  isOpen: boolean;
  dropdownTitle: string;
  dropdownAllHref: string;
  primaryLinks: NavbarLinkItem[];
  drawerLinks: NavbarLinkItem[];
  onClose: () => void;
  onNavigate?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <nav
      className={`${styles.navDrawer} ${isOpen ? styles.navDrawerOpen : ""}`.trim()}
      data-lenis-prevent=""
      aria-label="Main menu"
    >
      <div className={styles.navHeader}>Menu</div>
      <div className={styles.navInner}>
        <ul>
          <li className={styles.mobileOnlyLink}>
            <a href={dropdownAllHref} onClick={(e) => { onClose(); onNavigate?.(dropdownAllHref, e); }}>
              {dropdownTitle}
            </a>
          </li>
          {primaryLinks.map((item) => (
            <li key={`m-${item.href}`} className={styles.mobileOnlyLink}>
              <a href={item.href} onClick={(e) => { onClose(); onNavigate?.(item.href, e); }}>
                {item.label}
              </a>
            </li>
          ))}
          {drawerLinks.map((item) => (
            <li key={item.href} className={item.hasBorder ? styles.hasBorder : ""}>
              <a href={item.href} onClick={(e) => { onClose(); onNavigate?.(item.href, e); }}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
