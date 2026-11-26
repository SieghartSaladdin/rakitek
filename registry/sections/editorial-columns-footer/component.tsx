"use client";

import type { MouseEvent } from "react";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import styles from "./styles.module.css";

export interface FooterNavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumnGroup {
  title: string;
  links: FooterNavLink[];
}

export interface EditorialColumnsFooterProps {
  brandName?: string;
  brandLogoSrc?: string;
  brandHref?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaExternal?: boolean;
  columns?: FooterColumnGroup[];
  accreditationNote?: string;
  accreditationBadges?: FooterNavLink[];
  legalLinks?: FooterNavLink[];
  onNavigate?: (href: string, event: MouseEvent<HTMLElement>) => void;
}

const DEFAULT_COLUMNS: FooterColumnGroup[] = [
  {
    title: "Quick links",
    links: [
      { label: "About", href: "#about" },
      { label: "Traveler Hub", href: "#travelers" },
      { label: "Stories", href: "#stories" },
      { label: "Partner Agencies", href: "#partners" },
      { label: "Brochures", href: "#brochures" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Follow us",
    links: [
      { label: "Instagram", href: "#instagram" },
      { label: "Facebook", href: "#facebook" },
      { label: "YouTube", href: "#youtube" },
      { label: "LinkedIn", href: "#linkedin" },
    ],
  },
];

const DEFAULT_BADGES: FooterNavLink[] = [
  { label: "IATA", href: "#iata" },
  { label: "ASTA", href: "#asta" },
  { label: "CLIA", href: "#clia" },
];

const DEFAULT_LEGAL: FooterNavLink[] = [
  { label: "Credits", href: "#credits" },
  { label: "Terms of use", href: "#terms" },
  { label: "Privacy policy", href: "#privacy" },
];

function FooterWordmark({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 341 69" fill="none" className={styles.logo} aria-label={label}>
      <circle cx="34" cy="34.5" r="29" stroke="currentColor" strokeWidth="3.5" />
      <path d="M16 34.5H52M34 16.5V52.5" stroke="currentColor" strokeWidth="2.5" />
      <text x="80" y="46" fill="currentColor" fontFamily="serif" fontSize="38" fontWeight="600" letterSpacing="0.04em">
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

export function EditorialColumnsFooter({
  brandName = "Meridian",
  brandLogoSrc,
  brandHref = "#top",
  primaryCtaLabel = "Traveler space",
  primaryCtaHref = "#travelers",
  secondaryCtaLabel = "Agent portal",
  secondaryCtaHref = "#portal",
  secondaryCtaExternal = false,
  columns = DEFAULT_COLUMNS,
  accreditationNote = "Licensed tour operator and proud member of:",
  accreditationBadges = DEFAULT_BADGES,
  legalLinks = DEFAULT_LEGAL,
  onNavigate,
}: EditorialColumnsFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={`${styles.col} ${styles.colBrand}`}>
          <a
            href={brandHref}
            className={styles.logoLink}
            onClick={(e) => {
              if (brandHref.startsWith("#")) e.preventDefault();
              onNavigate?.(brandHref, e);
            }}
          >
            {brandLogoSrc ? (
              <img src={brandLogoSrc} className={styles.logo} alt={brandName} />
            ) : (
              <FooterWordmark label={brandName} />
            )}
          </a>
          <RollingCtaButton
            href={primaryCtaHref}
            label={primaryCtaLabel}
            variant="primary"
            className={styles.brandCta}
            onClick={(e) => {
              if (primaryCtaHref.startsWith("#")) e.preventDefault();
              onNavigate?.(primaryCtaHref, e);
            }}
          />
          <RollingCtaButton
            href={secondaryCtaHref}
            external={secondaryCtaExternal}
            label={secondaryCtaLabel}
            variant="secondary"
            className={styles.brandCta}
            onClick={(e) => {
              if (secondaryCtaHref.startsWith("#")) e.preventDefault();
              onNavigate?.(secondaryCtaHref, e);
            }}
          />
        </div>

        {columns.map((col) => (
          <div key={col.title} className={styles.col}>
            <div className={styles.linksTitle}>{col.title}</div>
            <ul className={styles.links}>
              {col.links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={styles.rollLink}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) e.preventDefault();
                      onNavigate?.(item.href, e);
                    }}
                  >
                    <span className={styles.rollLabel} data-label={item.label}>
                      <span>{item.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <div className={styles.legalBadges}>
          <span className={styles.legalNote}>{accreditationNote}</span>
          {accreditationBadges.map((b) => (
            <a
              key={b.label}
              href={b.href}
              aria-label={b.label}
              className={styles.badgeLink}
              onClick={(e) => {
                if (b.href.startsWith("#")) e.preventDefault();
                onNavigate?.(b.href, e);
              }}
            >
              <svg viewBox="0 0 88 38" className={styles.badgeSvg} fill="none" aria-hidden="true">
                <rect x="1" y="1" width="86" height="36" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <text x="44" y="24" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontSize="13" fontWeight="600">
                  {b.label}
                </text>
              </svg>
            </a>
          ))}
        </div>

        <ul className={styles.bottomLinks}>
          {legalLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith("#")) e.preventDefault();
                  onNavigate?.(item.href, e);
                }}
              >
                <span className={styles.rollLabel} data-label={item.label}>
                  <span>{item.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
