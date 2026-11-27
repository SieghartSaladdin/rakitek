"use client";

import type { MouseEvent, ReactNode } from "react";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import { BookclubPillButton } from "@registry/ui/bookclub-pill-button/component";
import { BookclubSocialButton } from "@registry/ui/bookclub-social-button/component";
import type { BookclubNavItem, BookclubSocialItem } from "./component";
import styles from "./mobile-menu.module.css";

interface BookclubMobileMenuProps {
  menuOpen: boolean;
  brandHref: string;
  brandAriaLabel: string;
  brandVisual: ReactNode;
  mobileNavAriaLabel: string;
  navLinks: BookclubNavItem[];
  showSocials: boolean;
  socialLinks: BookclubSocialItem[];
  showCta: boolean;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal: boolean;
  showRegionLink: boolean;
  regionLabel: string;
  regionHref: string;
  regionExternal: boolean;
  closeMenuAriaLabel: string;
  onClose: () => void;
  onNavigate?: (href: string, event: MouseEvent<HTMLElement>) => void;
}

export function BookclubMobileMenu({
  menuOpen,
  brandHref,
  brandAriaLabel,
  brandVisual,
  mobileNavAriaLabel,
  navLinks,
  showSocials,
  socialLinks,
  showCta,
  ctaLabel,
  ctaHref,
  ctaExternal,
  showRegionLink,
  regionLabel,
  regionHref,
  regionExternal,
  closeMenuAriaLabel,
  onClose,
  onNavigate,
}: BookclubMobileMenuProps) {
  return (
    <div data-rk-mobile-menu="" className={[styles.menu, menuOpen ? styles.menuActive : ""].filter(Boolean).join(" ")}>
      <div className={styles.menuInner}>
        <div className={styles.menuContainer}>
          <div className={styles.menuBg}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" fill="none" viewBox="0 0 386 712" className={styles.menuBgSvg}>
              <path fill="currentColor" d="M115.415-56.646c27.361-10.951 55.489-16.17 84.985-10.076 40.714 8.42 64.637 33.98 75.035 73.257 9.349 35.348 3.777 70.616-.769 105.961-4.86 37.766-10.042 75.565-12.734 113.514-1.993 28.09 5.481 54.869 20.638 79.162 14.419 23.106 34.405 37.375 61.693 41.433 30.041 4.465 59.172-.835 88.412-6.653 26.135-5.192 52.289-10.684 78.69-13.939 22.265-2.747 44.838-1.383 65.775 8.431 38.064 17.842 51.287 57.852 44.901 96.147-5.782 34.664-24.948 61.621-49.555 85.474-26.279 25.482-57.556 44.224-87.22 65.142-28.385 20.025-55.476 41.366-73.798 71.673-9.327 15.437-16.063 31.796-14.646 50.393 2.044 26.803 18.243 46.689 45.101 55.529a130 130 0 0 0 4.836 1.485l-139.704 55.662a1143 1143 0 0 1-16.076-9.954c-23.207-14.664-45.445-30.911-63.44-51.988-21.556-25.244-32.204-53.705-17.969-85.831 6.78-15.297 16.202-30.236 27.474-42.541 21.248-23.189 45.199-43.868 67.023-66.553 10.99-11.421 21.425-24.013 29.233-37.716 15.33-26.925 5.653-54.263-21.962-68.343-17.177-8.762-35.531-13.481-54.297-17.195-27.909-5.514-56.046-10.232-83.497-17.516-15.707-4.173-31.138-11.277-45.104-19.692-22.108-13.327-29.728-34.941-28.254-60.155 1.445-24.649 11.284-46.711 20.765-68.939 5.78-13.545 11.193-27.25 16.537-40.967 1.371-3.514 2.093-7.336 2.693-11.083 3.859-24.009-7.353-38.23-31.777-36.443-20.635 1.512-40.986 6.805-61.477 10.321-25.248 4.332-50.38 9.871-75.818 12.53-15.074 1.576-29.77 1.044-44.109-1.173V63.588q.326-.19.651-.383c28.317-16.804 55.126-36.258 81.9-55.513 33.66-24.207 67.019-48.8 105.864-64.338" />
            </svg>
          </div>
          <div className={styles.menuContent}>
            <header className={styles.menuHeader}>
              <a href={brandHref} aria-label={brandAriaLabel} className={styles.brandLink} onClick={onClose}>
                {brandVisual}
              </a>
              <BookclubBouncyCta
                asButton
                menuToggle
                hideText
                tone="soft-pink"
                icon="close"
                ariaLabel={closeMenuAriaLabel}
                onClick={onClose}
              />
            </header>
            <nav className={styles.menuNav} aria-label={mobileNavAriaLabel}>
              <ul role="list" className={styles.menuNavList}>
                {navLinks.map((item) => (
                  <li key={item.label} className={styles.menuNavItem}>
                    <BookclubPillButton
                      href={item.href}
                      label={item.label}
                      external={item.external}
                      size="menu"
                      tone="soft-pink"
                      showEars={false}
                      onClick={(e) => {
                        onClose();
                        onNavigate?.(item.href, e);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </nav>
            <footer className={styles.menuFooter}>
              {showSocials ? (
                <ul role="list" className={styles.menuSubList}>
                  {socialLinks.map((s) => (
                    <li key={s.platform + s.href}>
                      <BookclubSocialButton platform={s.platform} href={s.href} ariaLabel={s.ariaLabel} tone="soft-pink" />
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className={styles.menuLogin}>
                {showCta ? <BookclubBouncyCta label={ctaLabel} href={ctaHref} external={ctaExternal} tone="white" /> : null}
                {showRegionLink ? (
                  <BookclubPillButton href={regionHref} label={regionLabel} external={regionExternal} showEars={false} tone="soft-pink" />
                ) : null}
              </div>
            </footer>
          </div>
        </div>
        <div className={styles.menuBackdrop} />
      </div>
    </div>
  );
}
