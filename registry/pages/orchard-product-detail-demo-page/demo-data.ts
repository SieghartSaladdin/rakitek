import type { OrchardMetaChipBlock, OrchardMetaTextBlock } from "@registry/sections/orchard-product-meta-band/component";
import type { OrchardPhotoSlide } from "@registry/sections/orchard-photo-drag-slider/component";
import type { OrchardRelatedProduct } from "@registry/sections/orchard-related-products-rail/component";
import type { OrchardFooterLink, OrchardFooterOffice } from "@registry/sections/orchard-editorial-footer/component";
import type { OrchardHeaderNavItem } from "@registry/sections/orchard-top-header/component";

export interface OrchardProductDetailDemoData {
  brandName: string;
  brandSubtitle: string;
  primaryNav: OrchardHeaderNavItem[];
  secondaryNav: OrchardHeaderNavItem[];
  product: {
    title: string;
    category: string;
    categoryHref: string;
    originLabel: string;
    jarImage?: string;
    labelImage?: string;
    jarAlt: string;
  };
  intro: string[];
  allergens: string[];
  tips: OrchardMetaTextBlock;
  weights: OrchardMetaChipBlock;
  conservation: OrchardMetaTextBlock;
  gallery: OrchardPhotoSlide[];
  relatedTitle: string;
  related: OrchardRelatedProduct[];
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

const JAR_ART = (title: string, hue: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='367' height='481' viewBox='0 0 367 481'><rect x='110' y='92' width='147' height='36' rx='8' fill='peru'/><path d='M92 142c0-16 14-26 32-26h119c18 0 32 10 32 26v236c0 24-18 42-42 42H134c-24 0-42-18-42-42V142Z' fill='${hue}'/><rect x='98' y='210' width='171' height='126' fill='seashell'/><text x='183' y='265' text-anchor='middle' font-family='Georgia,serif' font-size='18' fill='maroon'>PANTRY</text><text x='183' y='296' text-anchor='middle' font-family='Arial,sans-serif' font-size='11' letter-spacing='2' fill='orangered'>${title}</text></svg>`,
  );

const card = (id: string, title: string, label: string, hue: string): OrchardRelatedProduct => ({
  id, title, imageSrc: JAR_ART(label, hue), hoverBg: "var(--rk-surface)", href: `#${id}`,
});

// Neutral white-label sample copy (Step 2); lengths mirror the measured original.
export const ORCHARD_PRODUCT_DETAIL_DATA: OrchardProductDetailDemoData = {
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
  product: {
    title: "Pistachio \nCream",
    category: "Spreadable Creams",
    categoryHref: "#spreads",
    originLabel: "Made in\nHollow Valley",
    jarAlt: "Pistachio Cream jar",
  },
  intro: [
    "Sweetly flavored and enveloping. Bright green color, spreadable texture.",
    "Ingredients: sugar, vegetable oils and fats (sunflower, palm), pistachio 40%, whole milk, skimmed milk powder, whey powder, emulsifier: sunflower lecithin, flavoring.",
  ],
  allergens: ["May contain: Almonds, Walnuts, Hazelnuts, Cashews."],
  tips: {
    label: "Useful tips",
    value: "Delicious for filling croissants, tarts or crepes. Keep away from heat sources and direct sunlight. After opening, store in the refrigerator and consume within 3-4 days.",
  },
  weights: { label: "Available weights", items: ["30g", "190g", "1kg", "3kg"] },
  conservation: { label: "Shelf life", value: "18 months" },
  gallery: [
    { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80&auto=format&fit=crop", alt: "Orchard rows" },
    { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&auto=format&fit=crop", alt: "Harvest field" },
    { src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1600&q=80&auto=format&fit=crop", alt: "Fruit crates" },
  ],
  relatedTitle: "The other products",
  related: [
    card("almond", "Almond Spread", "ALMOND", "peru"),
    card("hazelnut", "Hazelnut Spread", "HAZELNUT", "sienna"),
    card("orange", "Orange Marmalade", "ORANGE", "darkorange"),
    card("berry", "Strawberry and Black Berry", "BERRY", "crimson"),
    card("mulberry", "Extra Black Mulberry Jam", "MULBERRY", "indigo"),
    card("pear", "Pear and Cinnamon", "PEAR", "goldenrod"),
    card("caponata", "Aubergine Caponata", "CAPONATA", "rebeccapurple"),
    card("red-pesto", "Roasted Red Pesto", "RED PESTO", "firebrick"),
    card("green-pesto", "Pistachio Pesto", "GREEN PESTO", "forestgreen"),
    card("onions", "Sweet and Sour Onions", "ONIONS", "sienna"),
    card("fig", "Wild Fig Jam", "FIG", "saddlebrown"),
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
