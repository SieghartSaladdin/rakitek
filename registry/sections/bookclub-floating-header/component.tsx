"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import { BookclubPillButton } from "@registry/ui/bookclub-pill-button/component";
import { BookclubSocialButton } from "@registry/ui/bookclub-social-button/component";
import { BookclubMobileMenu } from "./mobile-menu";
import styles from "./styles.module.css";

export interface BookclubNavItem {
  label: string;
  href: string;
  external?: boolean;
  active?: boolean;
}

export interface BookclubSocialItem {
  platform: "instagram" | "tiktok" | "custom";
  href: string;
  ariaLabel?: string;
}

export interface BookclubFloatingHeaderProps {
  id?: string;
  brandName?: string;
  brandHref?: string;
  brandLogoSrc?: string;
  brandAriaLabel?: string;
  navAriaLabel?: string;
  mobileNavAriaLabel?: string;
  navLinks?: BookclubNavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  showCta?: boolean;
  regionLabel?: string;
  regionHref?: string;
  regionExternal?: boolean;
  showRegionLink?: boolean;
  socialLinks?: BookclubSocialItem[];
  showSocials?: boolean;
  menuLabel?: string;
  closeMenuAriaLabel?: string;
  tone?: "yellow" | "soft-blue";
  className?: string;
  onNavigate?: (href: string, event: MouseEvent<HTMLElement>) => void;
}

const DEFAULT_NAV: BookclubNavItem[] = [
  { label: "All Books", href: "#books" },
  { label: "Gifting", href: "#gift" },
  { label: "Merch", href: "#exclusive" },
  { label: "FAQ", href: "#faq" },
];

const DEFAULT_SOCIALS: BookclubSocialItem[] = [
  { platform: "instagram", href: "https://instagram.com", ariaLabel: "Go to Instagram" },
  { platform: "tiktok", href: "https://tiktok.com", ariaLabel: "Go to TikTok" },
];

function DefaultWordmark({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 234 59" fill="none" aria-hidden="true" className={styles.brandLogo}>
      <circle cx="29" cy="29" r="24" fill="currentColor" />
      <path d="M19 21c4 0 8 1.4 10 4v16c-2.6-2-6.2-3-10-3-1.6 0-3 .2-4 .6V21.7c1.2-.5 2.5-.7 4-.7Zm20 0c-4 0-8 1.4-10 4v16c2.6-2 6.2-3 10-3 1.6 0 3 .2 4 .6V21.7c-1.2-.5-2.5-.7-4-.7Z" fill="var(--rk-bc-yellow, var(--rk-accent))" />
      <text x="64" y="38" fill="currentColor" fontFamily="var(--rk-font-display)" fontWeight="800" fontSize="24" letterSpacing="-0.02em">
        {label}
      </text>
    </svg>
  );
}

export function BookclubFloatingHeader({
  id,
  brandName = "FABLE & FOLD",
  brandHref = "#top",
  brandLogoSrc,
  brandAriaLabel = "Home",
  navAriaLabel = "Main navigation",
  mobileNavAriaLabel = "Mobile navigation",
  navLinks = DEFAULT_NAV,
  ctaLabel = "Log-in / Sign-up",
  ctaHref = "#signup",
  ctaExternal = false,
  showCta = true,
  regionLabel = "Shopping from the UK?",
  regionHref = "#region",
  regionExternal = false,
  showRegionLink = true,
  socialLinks = DEFAULT_SOCIALS,
  showSocials = true,
  menuLabel = "Menu",
  closeMenuAriaLabel = "Close Menu",
  tone = "yellow",
  className = "",
  onNavigate,
}: BookclubFloatingHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const toneCls = tone === "soft-blue" ? styles.toneSoftBlue : styles.toneYellow;
  const headerCls = [
    styles.header,
    toneCls,
    scrolled ? styles.scrolled : "",
    menuOpen ? styles.headerMenuOpen : "",
    className,
  ].filter(Boolean).join(" ");

  const brandVisual = brandLogoSrc ? (
    <img src={brandLogoSrc} width={234} height={59} alt={brandName} loading="eager" className={styles.brandLogo} />
  ) : (
    <DefaultWordmark label={brandName} />
  );

  return (
    <>
      <header id={id} data-rk-header="" className={headerCls}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <a href={brandHref} aria-label={brandAriaLabel} aria-current="page" className={styles.brandLink} onClick={onNavigate ? (e) => onNavigate(brandHref, e) : undefined}>
              {brandVisual}
            </a>
          </div>

          <nav className={styles.nav} aria-label={navAriaLabel}>
            <ul role="list" className={styles.navList}>
              {navLinks.map((item) => (
                <li key={item.label} className={styles.navItem}>
                  <BookclubPillButton
                    href={item.href}
                    label={item.label}
                    external={item.external}
                    active={item.active}
                    onClick={onNavigate ? (e) => onNavigate(item.href, e) : undefined}
                  />
                </li>
              ))}
              {showCta ? (
                <li className={styles.navItem}>
                  <BookclubBouncyCta
                    label={ctaLabel}
                    href={ctaHref}
                    external={ctaExternal}
                    tone="orange"
                    onClick={onNavigate ? (e) => onNavigate(ctaHref, e) : undefined}
                  />
                </li>
              ) : null}
            </ul>
          </nav>

          <div className={styles.sub}>
            <ul role="list" className={styles.subList}>
              {showRegionLink ? (
                <li className={styles.subItem}>
                  <BookclubPillButton
                    href={regionHref}
                    label={regionLabel}
                    external={regionExternal}
                    showEars={false}
                    onClick={onNavigate ? (e) => onNavigate(regionHref, e) : undefined}
                  />
                </li>
              ) : null}
              {showSocials
                ? socialLinks.map((s) => (
                    <li key={s.platform + s.href} className={styles.subItem}>
                      <BookclubSocialButton platform={s.platform} href={s.href} ariaLabel={s.ariaLabel} />
                    </li>
                  ))
                : null}
            </ul>
          </div>

          <div className={styles.menuToggle}>
            <BookclubBouncyCta
              label={menuLabel}
              asButton
              menuToggle
              tone="orange"
              icon="hamburger"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>
      </header>

      <BookclubMobileMenu
        menuOpen={menuOpen}
        brandHref={brandHref}
        brandAriaLabel={brandAriaLabel}
        brandVisual={brandVisual}
        mobileNavAriaLabel={mobileNavAriaLabel}
        navLinks={navLinks}
        showSocials={showSocials}
        socialLinks={socialLinks}
        showCta={showCta}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        ctaExternal={ctaExternal}
        showRegionLink={showRegionLink}
        regionLabel={regionLabel}
        regionHref={regionHref}
        regionExternal={regionExternal}
        closeMenuAriaLabel={closeMenuAriaLabel}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
