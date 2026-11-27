"use client";

import type { MouseEvent, ReactNode } from "react";
import styles from "./styles.module.css";

export interface OrchardFooterLink {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
}

export interface OrchardFooterOffice {
  label: string;
  lines: string[];
}

export interface OrchardEditorialFooterProps {
  id?: string;
  brandDisplay?: string;
  logoImage?: string;
  logoAlt?: string;
  emblem?: ReactNode;
  copyrightTitle?: string;
  companyName?: string;
  vatLabel?: string;
  primaryLinks?: OrchardFooterLink[];
  secondaryLinks?: OrchardFooterLink[];
  offices?: OrchardFooterOffice[];
  socialLabel?: string;
  socialLinks?: OrchardFooterLink[];
  contactPrompt?: string;
  emailLabel?: string;
  emailHref?: string;
  legalLinks?: OrchardFooterLink[];
  creditLabel?: string;
  creditHref?: string;
  ariaLabel?: string;
  onLinkClick?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const DEFAULT_PRIMARY_LINKS: OrchardFooterLink[] = [
  { label: "Home", href: "#top" },
  { label: "Pantry", href: "#pantry", active: true },
  { label: "Harvest", href: "#harvest" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Tasting Room", href: "#experiences" },
];

const DEFAULT_OFFICES: OrchardFooterOffice[] = [
  { label: "Registered office", lines: ["Via degli Agrumi, 18", "95123 - Coastal Valley"] },
  { label: "Operational office", lines: ["Contrada Solare, Lot 4", "96014 - Grove District"] },
];

const DEFAULT_SOCIAL: OrchardFooterLink[] = [
  { label: "Instagram", href: "https://instagram.com", external: true },
  { label: "Facebook", href: "https://facebook.com", external: true },
];

export function OrchardEditorialFooter({
  id,
  brandDisplay = "SOLARA ORCHARD",
  logoImage,
  logoAlt = "Brand wordmark",
  emblem,
  copyrightTitle = "©2026 Solara Orchard",
  companyName = "Terraced Groves Agricultural Co.",
  vatLabel = "VAT 04829100874",
  primaryLinks = DEFAULT_PRIMARY_LINKS,
  secondaryLinks = [],
  offices = DEFAULT_OFFICES,
  socialLabel = "Follow us",
  socialLinks = DEFAULT_SOCIAL,
  contactPrompt = "To request wholesale availability or schedule a tasting, write to us:",
  emailLabel = "hello@solaraorchard.example",
  emailHref = "mailto:hello@solaraorchard.example",
  legalLinks = [{ label: "Privacy & Cookies", href: "#privacy" }],
  creditLabel = "Crafted for Artisanal Groves",
  creditHref = "#top",
  ariaLabel = "Footer",
  onLinkClick,
  className,
}: OrchardEditorialFooterProps) {
  const renderLink = (item: OrchardFooterLink, idx: number) => (
    <li key={`${item.href}-${idx}`}>
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={`${styles.link} ${item.active ? styles.linkActive : ""}`}
        onClick={onLinkClick ? (e) => onLinkClick(item.href, e) : undefined}
      >
        {item.label}
      </a>
    </li>
  );

  return (
    <footer
      id={id}
      className={className ? `${styles.footer} ${className}` : styles.footer}
      data-header-light=""
      aria-label={ariaLabel}
    >
      <div className={styles.inner}>
        <div className={styles.grid12}>
          <div className={styles.logo}>
            {logoImage ? (
              <img className={styles.logoImg} src={logoImage} alt={logoAlt} loading="lazy" />
            ) : (
              <svg
                className={styles.logoImg}
                viewBox="0 0 1128 372"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label={brandDisplay}
              >
                <text
                  x="0"
                  y="290"
                  fill="currentColor"
                  fontFamily="var(--rk-font-display)"
                  fontSize="240"
                  letterSpacing="6"
                >
                  {brandDisplay}
                </text>
              </svg>
            )}
          </div>
        </div>

        <div className={`${styles.grid12} ${styles.grid}`}>
          <div className={styles.brand}>
            <div className={styles.mark} aria-hidden="true">
              {emblem ?? (
                <svg viewBox="0 0 99 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="49.5" cy="52" r="36" stroke="currentColor" strokeWidth="3" />
                  <path d="M49.5 16V88M13.5 52H85.5M24 26.5L75 77.5M75 26.5L24 77.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </div>
            <div className={styles.copyright}>
              {copyrightTitle ? <p className={styles.copyrightStrong}>{copyrightTitle}</p> : null}
              {companyName ? <p>{companyName}</p> : null}
              {vatLabel ? <p className={styles.vat}>{vatLabel}</p> : null}
            </div>
          </div>

          <nav className={styles.nav} aria-label={ariaLabel}>
            <ul className={styles.links}>{primaryLinks.map(renderLink)}</ul>
            {secondaryLinks.length ? (
              <ul className={styles.links}>{secondaryLinks.map(renderLink)}</ul>
            ) : null}
          </nav>

          <div className={styles.sedi}>
            {offices.map((office, idx) => (
              <div key={`${office.label}-${idx}`} className={styles.block}>
                <p className={styles.label}>{office.label}</p>
                <div className={styles.text}>
                  {office.lines.map((line, lineIdx) => (
                    <p key={lineIdx}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.contact}>
            {socialLinks.length ? (
              <div className={`${styles.block} ${styles.contactSocial}`}>
                <p className={styles.label}>{socialLabel}</p>
                <ul className={styles.social}>{socialLinks.map(renderLink)}</ul>
              </div>
            ) : null}
            <div className={styles.mail}>
              {contactPrompt ? <p className={styles.message}>{contactPrompt}</p> : null}
              {emailLabel ? (
                <a href={emailHref} className={styles.email}>
                  {emailLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.legalList}>
            {legalLinks.map((link, idx) => (
              <a
                key={`${link.href}-${idx}`}
                href={link.href}
                className={styles.legalLink}
                onClick={onLinkClick ? (e) => onLinkClick(link.href, e) : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
          {creditLabel ? (
            <a
              href={creditHref}
              className={styles.credit}
              onClick={onLinkClick ? (e) => onLinkClick(creditHref, e) : undefined}
            >
              {creditLabel}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
