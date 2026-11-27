"use client";

import { LineReveal, RevealLine, RevealWords } from "@registry/ui/mono-line-reveal/component";
import styles from "./styles.module.css";

export interface CreditsLink {
  href: string;
  label: string;
}

export type CreditsBlock =
  | { id?: string; heading: string; text: string }
  | { id?: string; heading: string; links: CreditsLink[]; note?: string };

export interface CreditsIndexColumnsProps {
  id?: string;
  ariaLabel?: string;
  /** Wide left column. */
  primary?: CreditsBlock[];
  /** Narrow right column, above the colophon. */
  secondary?: CreditsBlock[];
  /** Small label and value pinned to the bottom of the right column (a credit, a typeface). */
  colophon?: { heading: string; value: string };
  showColophon?: boolean;
  /** Pale legal line next to the colophon. */
  legal?: string;
  /** Opens links in a new tab. Default true. */
  externalLinks?: boolean;
}

const DEFAULT_PRIMARY: CreditsBlock[] = [
  {
    id: "services",
    heading: "Services:",
    text: "Creative Direction, Web Design, Web Development, Brand Identity, 3D, Motion Design, Lectures and Consulting",
  },
  {
    id: "industries",
    heading: "Industries:",
    text: "Architecture, Fashion, Technology, Culture, Education, Finance, Automotive, Furniture",
  },
  {
    id: "awards",
    heading: "Selected Awards:",
    links: [
      { href: "#awards", label: "Studio of the Year (Design Weekly)" },
      { href: "#awards", label: "4x Studio of the Year (CSSDA)" },
      { href: "#awards", label: "Best of the Best (Red Dot)" },
      { href: "#awards", label: "Jury Prize (Euro Design Awards)" },
      { href: "#awards", label: "30+ Site of the Day (Design Weekly)" },
      { href: "#awards", label: "35+ Website of the Day (CSSDA)" },
      { href: "#awards", label: "3x Award of Excellence (Comm Arts)" },
      { href: "#awards", label: "Best of the Showcase (Folio)" },
    ],
    note: "and 60+ more...",
  },
  {
    id: "speeches",
    heading: "Latest Public Speeches:",
    links: [
      { href: "#talks", label: "The Craft Gathering. Osijek, Croatia (2025)" },
      { href: "#talks", label: "Design Weekly. Valencia, Spain (2024)" },
      { href: "#talks", label: "Dysarium. Lviv, Ukraine (2024)" },
      { href: "#talks", label: "Design Weekly. Amsterdam, Netherlands (2022)" },
    ],
  },
];

const DEFAULT_SECONDARY: CreditsBlock[] = [
  {
    id: "press",
    heading: "Featured Press:",
    links: [
      { href: "#press", label: "Pixelwire" },
      { href: "#press", label: "Red Dot" },
      { href: "#press", label: "Design Weekly" },
      { href: "#press", label: "FWA" },
      { href: "#press", label: "Communication Arts" },
      { href: "#press", label: "Top Interactive Agencies" },
      { href: "#press", label: "50Pros" },
    ],
  },
  {
    id: "socials",
    heading: "Socials:",
    links: [
      { href: "#social", label: "Instagram" },
      { href: "#social", label: "Behance" },
      { href: "#social", label: "Twitter" },
      { href: "#social", label: "LinkedIn" },
      { href: "#social", label: "Education Series" },
    ],
  },
];

function Block({ block, external }: { block: CreditsBlock; external: boolean }) {
  const target = external ? "_blank" : undefined;
  const rel = external ? "noopener noreferrer" : undefined;
  return (
    <LineReveal as="div" id={block.id}>
      <h2 className={styles.heading}>
        <RevealLine>{block.heading}</RevealLine>
      </h2>
      {"text" in block ? (
        <p>
          <RevealWords text={block.text} />
        </p>
      ) : (
        <>
          <ul className={styles.list}>
            {block.links.map((item, i) => (
              <RevealLine key={`${item.label}-${i}`} as="li" link={{ href: item.href, target, rel }}>
                <span>{item.label}</span>
                <span />
              </RevealLine>
            ))}
          </ul>
          {block.note ? <RevealLine>{block.note}</RevealLine> : null}
        </>
      )}
    </LineReveal>
  );
}

export function CreditsIndexColumns({
  id,
  ariaLabel = "Capabilities, awards and press",
  primary = DEFAULT_PRIMARY,
  secondary = DEFAULT_SECONDARY,
  colophon = { heading: "Typography:", value: "Hanken Grotesk" },
  showColophon = true,
  legal = "All rights reserved. 2026 Northline",
  externalLinks = true,
}: CreditsIndexColumnsProps) {
  return (
    <section id={id} className={styles.root} aria-label={ariaLabel}>
      <div className={styles.inner}>
        <div className={styles.primary}>
          {primary.map((block, i) => (
            <Block key={block.id ?? i} block={block} external={externalLinks} />
          ))}
        </div>
        <div className={styles.secondary}>
          {secondary.map((block, i) => (
            <Block key={block.id ?? i} block={block} external={externalLinks} />
          ))}
          {showColophon ? (
            <LineReveal as="div" className={styles.colophon}>
              <div>
                <h2 className={styles.heading}>
                  <RevealLine>{colophon.heading}</RevealLine>
                </h2>
                <RevealLine>{colophon.value}</RevealLine>
              </div>
              <RevealLine as="div" className={styles.legal}>
                {legal}
              </RevealLine>
            </LineReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
