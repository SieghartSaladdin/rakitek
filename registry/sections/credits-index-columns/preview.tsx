"use client";

import { CreditsIndexColumns, type CreditsBlock } from "./component";

const PRIMARY: CreditsBlock[] = [
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
      { href: "#talks", label: "Craftcon. Amsterdam, Netherlands (2022)" },
    ],
  },
];

const SECONDARY: CreditsBlock[] = [
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

export default function CreditsIndexColumnsPreview() {
  return (
    <CreditsIndexColumns
      id="credits"
      ariaLabel="Capabilities, awards and press"
      primary={PRIMARY}
      secondary={SECONDARY}
      colophon={{ heading: "Typography:", value: "Inter Tight UI by Kora" }}
      showColophon
      legal="All rights reserved. ©2026 Kora"
      externalLinks
    />
  );
}
