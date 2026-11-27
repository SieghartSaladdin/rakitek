"use client";

import { useState } from "react";
import { NotchedButton } from "@registry/ui/notched-button/component";
import { MenuDrawer, type NavLeaf, type SocialLink } from "./menu-drawer";
import styles from "./styles.module.css";

export type { NavLeaf, SocialLink } from "./menu-drawer";

export interface HeaderLanguage {
  code: string;
  label: string;
}

export interface FestivalHeaderProps {
  id?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoHref?: string;
  brandName?: string;
  languages?: readonly HeaderLanguage[];
  activeLanguage?: string;
  onLanguageChange?: (code: string) => void;
  ctaLabel?: string;
  ctaHref?: string;
  menuItems?: readonly NavLeaf[];
  menuLabel?: string;
  toggleMenuLabel?: string;
  closeMenuLabel?: string;
  drawerCtaLabel?: string;
  drawerCtaHref?: string;
  socials?: readonly SocialLink[];
  fixed?: boolean;
  className?: string;
}

function MenuIcon() {
  return (
    <svg
      className={styles.menuIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h16" />
      <path d="M4 6h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className={styles.menuIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function FestivalHeader({
  id,
  logoSrc,
  logoAlt = "Festival logo",
  logoHref = "#top",
  brandName = "Festival",
  languages = [],
  activeLanguage,
  onLanguageChange,
  ctaLabel = "Tickets",
  ctaHref = "#tickets",
  menuItems = [],
  menuLabel = "Menu",
  toggleMenuLabel = "Toggle menu",
  closeMenuLabel = "Close menu",
  drawerCtaLabel,
  drawerCtaHref,
  socials = [],
  fixed = true,
  className,
}: FestivalHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(activeLanguage ?? languages[0]?.code);

  const selectLanguage = (code: string) => {
    setLanguage(code);
    onLanguageChange?.(code);
  };

  const classes = [styles.header, fixed ? styles.fixed : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <>
      <header id={id} className={classes}>
        <div className={styles.container}>
          <a href={logoHref} className={styles.logoLink}>
            {logoSrc ? (
              <img src={logoSrc} alt={logoAlt} className={styles.logo} />
            ) : (
              <span className={styles.wordmark}>{brandName}</span>
            )}
          </a>

          <div className={styles.tools}>
            {languages.length > 0 ? (
              <div className={styles.languages}>
                {languages.map((item, index) => (
                  <span key={item.code} className={styles.languageItem}>
                    {index > 0 ? <span className={styles.slash}>/</span> : null}
                    <button
                      type="button"
                      className={
                        item.code === language
                          ? `${styles.language} ${styles.languageActive}`
                          : styles.language
                      }
                      aria-pressed={item.code === language}
                      onClick={() => selectLanguage(item.code)}
                    >
                      {item.label}
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            {ctaLabel ? (
              <NotchedButton href={ctaHref} variant="filled" size="sm">
                {ctaLabel}
              </NotchedButton>
            ) : null}

            <div className={styles.toggleBox}>
              <button
                type="button"
                className={styles.toggle}
                aria-label={toggleMenuLabel}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
        menuLabel={menuLabel}
        closeLabel={closeMenuLabel}
        ctaLabel={drawerCtaLabel}
        ctaHref={drawerCtaHref}
        socials={socials}
      />
    </>
  );
}
