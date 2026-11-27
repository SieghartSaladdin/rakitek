import type { OrchardFooterLink, OrchardFooterOffice } from "@registry/sections/orchard-editorial-footer/component";
import type { OrchardHeaderNavItem } from "@registry/sections/orchard-top-header/component";

export interface OrchardAboutDemoData {
  brandName: string;
  brandSubtitle: string;
  primaryNav: OrchardHeaderNavItem[];
  secondaryNav: OrchardHeaderNavItem[];
  hero: { title: string; coverImage: string; coverAlt: string; coverTitle: string };
  intro: string[];
  pauseTitle: string;
  intro2: string[];
  vision: { title: string; subtitle: string; backgroundImage: string; foregroundImage?: string; foregroundAlt: string };
  intro3: string[];
  closing: { imageSrc: string; imageAlt: string };
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

const PORTRAIT_CUTOUT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='900' viewBox='0 0 800 900' preserveAspectRatio='xMidYMax slice'><circle cx='400' cy='520' r='105' fill='sienna'/><path d='M130 900c0-120 100-230 270-230s270 110 270 230Z' fill='darkolivegreen'/></svg>",
  );

// Neutral white-label sample copy (Step 2); lengths mirror the measured original.
export const ORCHARD_ABOUT_DATA: OrchardAboutDemoData = {
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
    title: "About",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80&auto=format&fit=crop",
    coverAlt: "A farm and food production business",
    coverTitle: "A heritage guarded since 1968",
  },
  intro: [
    "Our story is rooted in Marlow (Eastshire), just a few kilometers from the town center, where our grandfather purchased his first citrus grove 50 years ago, recognizing in those trees a priceless heritage of aromas and flavors. A story that spans generations, all the way to the",
    "present day. Today, this \"treasure\" is in our hands, and we protect it with the same love as always, tending to each individual plant to harvest the finest fruit, respecting nature's rhythms and caring for the land.",
  ],
  pauseTitle: "It’s not just a brand,\nbut a promise that has been kept\nover time.",
  intro2: [
    "Since 2018, with the arrival of a new, highly specialized generation, holding degrees in Agriculture and Food Technology, we made the decision to convert the entire farm to organic farming. We introduced innovations such as fully automated irrigation to minimize water waste, planted a pistachio and almond grove, installed photovoltaic panels for complete energy autonomy, and closed the supply chain by creating our own processing laboratory. Here we produce a full line of jams and preserves, savory pestos to accompany meals, pasta sauces, and sweet spreads perfect for breakfast. We process our own raw materials directly, to bring you the pure essence of quality, handcrafted, just like in the old days.",
  ],
  vision: {
    title: "Vision",
    subtitle: "Growing the future,\nstarting from the earth.",
    backgroundImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80&auto=format&fit=crop",
    foregroundImage: PORTRAIT_CUTOUT,
    foregroundAlt: "Owner portrait",
  },
  intro3: [
    "We preserve the authentic flavor of our fruit through careful, slow, and artisanal processing that honors nature's rhythms and reflects the true essence of our land. We are committed to delivering a genuine, high-quality product, from raw materials to the finished jar.",
  ],
  closing: {
    imageSrc: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Jars on a wooden shelf",
  },
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
