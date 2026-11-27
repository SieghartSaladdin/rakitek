import type { OrchardFooterLink, OrchardFooterOffice } from "@registry/sections/orchard-editorial-footer/component";
import type { OrchardHeaderNavItem } from "@registry/sections/orchard-top-header/component";
import type { OrchardProductSlideItem } from "@registry/sections/orchard-product-showcase/component";
import type { OrchardSpecColumn } from "@registry/sections/orchard-spec-ledger-section/component";
import type { OrchardPillNavItem } from "@registry/ui/orchard-floating-pill-nav/component";

export interface OrchardDemoData {
  brandName: string;
  brandSubtitle: string;
  primaryNav: OrchardHeaderNavItem[];
  secondaryNav: OrchardHeaderNavItem[];
  hero: {
    title: string;
    coverImage: string;
    coverAlt: string;
    coverTitle: string;
  };
  intro: string[];
  jams: {
    id: string;
    title: string;
    coverImage: string;
    coverAlt: string;
    description: string[];
    weightsLabel: string;
    weights: string[];
    slides: OrchardProductSlideItem[];
  };
  creams: {
    id: string;
    title: string;
    description: string[];
    weightsLabel: string;
    weights: string[];
    slides: OrchardProductSlideItem[];
  };
  savoury: {
    id: string;
    title: string;
    backgroundImage: string;
    backgroundAlt: string;
    description: string[];
    weightsLabel: string;
    weights: string[];
    slides: OrchardProductSlideItem[];
  };
  monopack: {
    id: string;
    title: string;
    description: string[];
    coverImage: string;
    coverAlt: string;
    columns: OrchardSpecColumn[];
    rows: Array<Record<string, string>>;
  };
  outro: {
    imageSrc: string;
    imageAlt: string;
  };
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

const JAR_ART = (title: string, hue: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='367' height='481' viewBox='0 0 367 481'><rect x='110' y='92' width='147' height='36' rx='8' fill='peru'/><path d='M92 142c0-16 14-26 32-26h119c18 0 32 10 32 26v236c0 24-18 42-42 42H134c-24 0-42-18-42-42V142Z' fill='${hue}'/><rect x='98' y='210' width='171' height='126' fill='seashell'/><text x='183' y='265' text-anchor='middle' font-family='Georgia,serif' font-size='18' fill='maroon'>PANTRY</text><text x='183' y='296' text-anchor='middle' font-family='Arial,sans-serif' font-size='11' letter-spacing='2' fill='orangered'>${title}</text></svg>`,
  );

// Neutral white-label sample copy (Step 2). Text lengths mirror the measured original so wraps stay comparable.
export const ORCHARD_DEMO_DATA: OrchardDemoData = {
  brandName: "HOLLOW",
  brandSubtitle: "Orchard",
  primaryNav: [
    { label: "Home", href: "#top" },
    { label: "Pantry", href: "#jams", active: true },
    { label: "Wholesale", href: "#sample-pack" },
    { label: "About", href: "#intro" },
    { label: "Contacts", href: "#footer" },
  ],
  secondaryNav: [
    { label: "Visits", href: "#savoury" },
    { label: "Social", href: "https://example.com", external: true },
  ],
  hero: {
    title: "Pantry",
    coverImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80&auto=format&fit=crop",
    coverAlt: "A long table set for lunch with orchard produce",
    coverTitle: "Our land, one jar at a time.",
  },
  intro: [
    "We have picked the best of each harvest to craft a line of ready-to-enjoy delicacies. The pantry is a showcase of our small-batch creations, a signature shelf where the purity of our fruit meets only the finest ingredients around.",
  ],
  jams: {
    id: "jams",
    title: "Jams & Preserves",
    coverImage:
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1400&q=80&auto=format&fit=crop",
    coverAlt: "Picnic blanket with jars of jam and marmalade",
    description: [
      "Small-batch marmalades and jams prepared the traditional way: pulp, peel and sugar slowly cook together to keep their original colours and aromas, with a touch of invention. Enjoy them at breakfast with warm bread, or pair them with aged cheeses and white meats.",
    ],
    weightsLabel: "Available weights",
    weights: ["240g", "1.2kg"],
    slides: [
      { id: "orange", title: "Orange Marmalade", imageSrc: JAR_ART("ORANGE", "darkorange"), hoverBg: "var(--rk-surface)", href: "#jams" },
      { id: "berry", title: "Strawberry and Berry", imageSrc: JAR_ART("BERRY", "crimson"), hoverBg: "var(--rk-surface)", href: "#jams" },
      { id: "mulberry", title: "Extra Black Mulberry Jam", imageSrc: JAR_ART("MULBERRY", "indigo"), hoverBg: "var(--rk-surface)", href: "#jams" },
      { id: "pear", title: "Pear and Cinnamon", imageSrc: JAR_ART("PEAR", "goldenrod"), hoverBg: "var(--rk-surface)", href: "#jams" },
    ],
  },
  creams: {
    id: "spreads",
    title: "Spreadable nut creams",
    description: [
      "The art of transformation reaches its most indulgent expression. Our small-batch spreads are made through a slow process that brings out the best of toasted nuts, blending them with creamy bases of the highest quality.",
    ],
    weightsLabel: "Available weights",
    weights: ["190g", "1kg", "3kg"],
    slides: [
      { id: "pistachio-cream", title: "Pistachio Cream", imageSrc: JAR_ART("PISTACHIO", "olivedrab"), hoverBg: "var(--rk-surface)", href: "#spreads" },
      { id: "almond-spread", title: "Almond Spread", imageSrc: JAR_ART("ALMOND", "peru"), hoverBg: "var(--rk-surface)", href: "#spreads" },
    ],
  },
  savoury: {
    id: "savoury",
    title: "Savoury",
    backgroundImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop",
    backgroundAlt: "Savoury orchard harvest",
    description: [
      "Here, the freshness of orchard fruit meets the richness of the kitchen garden: from chutneys made with our finest fruit to pestos and pates prepared with selected vegetables, sun-dried tomatoes and fleshy olives. Each jar holds a recipe designed to preserve the integrity of the raw ingredients, bringing to the table the scent and warmth of a day in the countryside. Ideal as pasta sauces, aperitif snacks and toppings for gourmet bruschetta or warm focaccia at dinner.",
    ],
    weightsLabel: "Available weights",
    weights: ["190g", "1kg", "3kg"],
    slides: [
      { id: "green-pesto", title: "Pistachio Pesto", imageSrc: JAR_ART("GREEN PESTO", "forestgreen"), hoverBg: "var(--rk-surface)", href: "#savoury" },
      { id: "caponata", title: "Aubergine Caponata", imageSrc: JAR_ART("CAPONATA", "rebeccapurple"), hoverBg: "var(--rk-surface)", href: "#savoury" },
      { id: "red-pesto", title: "Roasted Red Pesto", imageSrc: JAR_ART("RED PESTO", "firebrick"), hoverBg: "var(--rk-surface)", href: "#savoury" },
      { id: "onions", title: "Sweet and Sour Onions", imageSrc: JAR_ART("ONIONS", "sienna"), hoverBg: "var(--rk-surface)", href: "#savoury" },
    ],
  },
  monopack: {
    id: "sample-pack",
    title: "Sample Pack",
    description: [
      "We know that breakfast is one of the most memorable moments of a guest’s stay. That is why we have captured the freshness of our fruit in an elegant and refined single-serve format. A pantry line dedicated to high-end hospitality, where the small-batch quality of our jams and marmalades meets the practicality required by professional service. Bring the sunshine of the orchard directly to your guests’ table, ensuring hygiene, freshness and an unforgettable flavour from the very first taste.",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "Single-serve flavours for hotel breakfasts",
    columns: [
      { key: "product", label: "Product", align: "start" },
      { key: "shelfLife", label: "Shelf life", align: "start" },
      { key: "weight", label: "Weight", align: "end" },
    ],
    rows: [
      { product: "Orange Marmalade", shelfLife: "36 months", weight: "30g" },
      { product: "Mandarin Marmalade", shelfLife: "36 months", weight: "30g" },
      { product: "Extra Strawberry Jam", shelfLife: "36 months", weight: "30g" },
      { product: "Extra Cherry Jam", shelfLife: "36 months", weight: "30g" },
      { product: "Extra Apricot Jam", shelfLife: "36 months", weight: "30g" },
      { product: "Extra Fig Jam", shelfLife: "36 months", weight: "30g" },
      { product: "Blossom Honey", shelfLife: "36 months", weight: "30g" },
      { product: "Pistachio Spread", shelfLife: "18 months", weight: "30g" },
      { product: "Almond Spread", shelfLife: "18 months", weight: "30g" },
      { product: "Hazelnut Spread", shelfLife: "18 months", weight: "30g" },
    ],
  },
  outro: {
    imageSrc:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80&auto=format&fit=crop",
    imageAlt: "Jams, pates and sauces, all locally sourced",
  },
  floatingNav: [
    { id: "jams", label: "Jams" },
    { id: "spreads", label: "Spreads" },
    { id: "savoury", label: "Savoury" },
    { id: "sample-pack", label: "Sample Pack" },
  ],
  footer: {
    brandDisplay: "HOLLOW ORCHARD",
    copyrightTitle: "©2026 | Hollow Orchard",
    companyName: "Hollow Orchard Growers Ltd.",
    vatLabel: "VAT 000000000",
    primaryLinks: [
      { label: "Home", href: "#top" },
      { label: "Pantry", href: "#jams", active: true },
      { label: "Wholesale", href: "#sample-pack" },
      { label: "Visits", href: "#savoury" },
      { label: "About", href: "#intro" },
    ],
    secondaryLinks: [
      { label: "Contacts", href: "#footer" },
      { label: "Shop", href: "#jams" },
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
