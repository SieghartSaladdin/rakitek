import type { CreditsBlock } from "@registry/sections/credits-index-columns/component";
import type { WordmarkGlyph } from "@registry/sections/giant-wordmark-footer/component";

export const CREDITS_PRIMARY: CreditsBlock[] = [
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

export const CREDITS_SECONDARY: CreditsBlock[] = [
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

export const FOOTER_GLYPHS: WordmarkGlyph[] = [
  {
    flex: "0 0 25.35%",
    viewBox: "0 0 360 388",
    d: "M180 44a150 150 0 1 0 0.01 0ZM180 106a88 88 0 1 1-0.01 0Z",
  },
  {
    flex: "0 0 20.99%",
    marginLeft: "2.11%",
    viewBox: "0 0 298 388",
    d: "M52 50H246V337H52ZM110 108V279H188V108Z",
  },
  {
    flex: "0 0 23.66%",
    marginLeft: "-1.9%",
    viewBox: "0 0 336 388",
    d: "M0 6.3H336L168 380.8Z",
  },
  {
    flex: "0 0 21.06%",
    marginLeft: "-0.42%",
    viewBox: "0 0 300 388",
    d: "M0 387.3V200a150 150 0 0 1 300 0V387.3Z",
  },
  {
    flex: "0 0 8.17%",
    marginLeft: "0.99%",
    viewBox: "0 0 116 123",
    d: "M58 6a58 58 0 1 0 0.01 0ZM58 16a48 48 0 1 1-0.01 0Z",
    raised: true,
    evenOdd: true,
  },
];
