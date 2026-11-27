import type { OrchardLedgerColumn } from "@registry/sections/orchard-production-ledger/component";
import type { OrchardPhotoSlide } from "@registry/sections/orchard-photo-drag-slider/component";
import type { OrchardPillNavItem } from "@registry/ui/orchard-floating-pill-nav/component";
import type { OrchardFooterLink, OrchardFooterOffice } from "@registry/sections/orchard-editorial-footer/component";
import type { OrchardHeaderNavItem } from "@registry/sections/orchard-top-header/component";

export interface OrchardLedgerBlock {
  id: string;
  title: string;
  singleLineTitle?: boolean;
  description: string[];
  subtitle: string;
  columns: OrchardLedgerColumn[];
  rows: Array<Record<string, string>>;
}

export interface OrchardProductionDemoData {
  brandName: string;
  brandSubtitle: string;
  primaryNav: OrchardHeaderNavItem[];
  secondaryNav: OrchardHeaderNavItem[];
  hero: { title: string; coverImage: string; coverAlt: string; coverTitle: string };
  intro: string[];
  citrus: OrchardLedgerBlock;
  gallery1: OrchardPhotoSlide[];
  nuts: OrchardLedgerBlock;
  gallery2: OrchardPhotoSlide[];
  floatingNav: OrchardPillNavItem[];
  footer: {
    brandDisplay: string;
    copyrightTitle: string;
    companyName: string;
    vatLabel: string;
    primaryLinks: OrchardFooterLink[];
    secondaryLinks: OrchardFooterLink[];
    offices: OrchardFooterOffice[];
    socialLabel: string;
    socialLinks: OrchardFooterLink[];
    contactPrompt: string;
    emailLabel: string;
    emailHref: string;
    legalLinks: OrchardFooterLink[];
    creditLabel: string;
  };
}

// Neutral white-label sample copy (Step 2); lengths mirror the measured original.
export const ORCHARD_PRODUCTION_DATA: OrchardProductionDemoData = {
  brandName: "HOLLOW",
  brandSubtitle: "Orchard",
  primaryNav: [
    { label: "Home", href: "#top" },
    { label: "Pantry", href: "#pantry" },
    { label: "Production", href: "#production" },
    { label: "About", href: "#about" },
    { label: "Contacts", href: "#footer" },
  ],
  secondaryNav: [
    { label: "Experience", href: "#experience" },
    { label: "Instagram", href: "https://example.com", external: true },
  ],
  hero: {
    title: "Production",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "Citrus fruits and nuts from the orchard",
    coverTitle: "The bounty\nof our land",
  },
  intro: [
    "Our daily life is made of fragrant citrus fruits, freshly harvested almonds and emerald green pistachios, we respect our land and its rhythms. We cultivate, transform and preserve with the same care, generation after generation. This is Hollow Orchard.",
  ],
  citrus: {
    id: "citrus",
    title: "Citrus Fruits",
    singleLineTitle: true,
    description: [
      "Fragrant and juicy, our orchard citrus fruits are the heart of Hollow Orchard.\n\nWe cultivate: blonde oranges, red oranges of the Garnet Blush variety and lemons of the Meyer Sweet Lemon variety. Each fruit has its own season, its own character and its own story. We care for our plants with respect and harvest only when the fruit is ready, honouring the rhythms of nature and the traditions of those who came before us. Because a true orchard citrus fruit needs nothing else, only time and care.",
    ],
    subtitle: "Crates / Box of 10kg",
    columns: [
      { key: "product", label: "Product" },
      { key: "availability", label: "Availability" },
    ],
    rows: [
      { product: "Navel Oranges for Fresh Consumption", availability: "November 20 to January 15" },
      { product: "Navel Oranges for Juicing", availability: "November 20 to January 15" },
      { product: "Garnet Oranges for Fresh Consumption", availability: "January 15 to February 28" },
      { product: "Garnet Oranges for Juicing", availability: "January 15 to February 28" },
      { product: "Meyer Sweet Lemon for Fresh Consumption", availability: "November 15 to April 15" },
      { product: "Late Harvest Mandarin for Fresh Consumption", availability: "January 15 to February 28" },
      { product: "Pomegranate sweet and tart varieties", availability: "October 01 to November 31" },
    ],
  },
  gallery1: [
    { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80&auto=format&fit=crop", alt: "Orchard rows" },
    { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&auto=format&fit=crop", alt: "Harvest field" },
    { src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1600&q=80&auto=format&fit=crop", alt: "Fruit crates" },
  ],
  nuts: {
    id: "nuts",
    title: "Pistachios & Almonds",
    description: [
      "Our dried fruits consist of almonds and pistachios. Among our almonds, we offer the Valley variety: sweet, fragrant and versatile, telling the story of the authentic valley. Our valley pistachio, grown on volcanic soils rich in minerals, is harvested following the natural rhythms of the plant",
    ],
    subtitle: "VACUUM-PACKED / AVAILABLE ALL YEAR ROUND",
    columns: [
      { key: "product", label: "Product" },
      { key: "weight", label: "Weight" },
      { key: "pieces", label: "Pcs x Ctn" },
    ],
    rows: [
      { product: "Shelled Almonds", weight: "500g", pieces: "12" },
      { product: "Shelled Pistachios", weight: "500g", pieces: "12" },
      { product: "Shelled Almonds", weight: "1kg", pieces: "8" },
      { product: "Shelled Pistachios", weight: "1kg", pieces: "8" },
    ],
  },
  gallery2: [
    { src: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=1600&q=80&auto=format&fit=crop", alt: "Citrus branches" },
    { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80&auto=format&fit=crop", alt: "Almond blossoms" },
    { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&auto=format&fit=crop", alt: "Shelling table" },
    { src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1600&q=80&auto=format&fit=crop", alt: "Packed crates" },
  ],
  floatingNav: [
    { id: "citrus", label: "Citrus Fruits" },
    { id: "nuts", label: "Dried Fruits" },
  ],
  footer: {
    brandDisplay: "HOLLOW ORCHARD",
    copyrightTitle: "©2026 | Hollow Orchard",
    companyName: "Hollow Orchard Growers Ltd.",
    vatLabel: "VAT 000000000",
    primaryLinks: [
      { label: "Home", href: "#top" },
      { label: "Pantry", href: "#pantry" },
      { label: "Production", href: "#production" },
      { label: "Experience", href: "#experience" },
      { label: "About", href: "#about" },
    ],
    secondaryLinks: [
      { label: "Contacts", href: "#footer" },
      { label: "Shop", href: "#shop" },
    ],
    offices: [
      { label: "Registered office", lines: ["12 Example Street", "00100 - Sample City"] },
      { label: "Operational office", lines: ["Orchard Road, plot 4", "00200 - Sample Valley"] },
    ],
    socialLabel: "Follow us",
    socialLinks: [{ label: "@hollow.orchard", href: "https://example.com", external: true }],
    contactPrompt: "Do you have a question or would you like to find out more about us? Drop us a line, we would be delighted to tell you all about our orchard.",
    emailLabel: "hello@example.com",
    emailHref: "mailto:hello@example.com",
    legalLinks: [{ label: "Privacy & Cookies", href: "#privacy" }],
    creditLabel: "Designed by Studio Example",
  },
};
