"use client";

import { CollectionSplitShowcase, type CollectionSlideData } from "./component";

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function makeSeriesLogoSvg(topLine: string, bottomLine: string): string {
  const id = `mask-${topLine.toLowerCase().replace(/[^a-z]/g, "")}`;
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 230">` +
      `<defs><mask id="${id}"><rect width="380" height="230" rx="14" fill="white"/>` +
      `<text x="190" y="102" text-anchor="middle" font-family="Impact,Arial Narrow,sans-serif" font-size="90" font-weight="900" letter-spacing="2" fill="black">${topLine}</text>` +
      `<text x="190" y="192" text-anchor="middle" font-family="Impact,Arial Narrow,sans-serif" font-size="90" font-weight="900" letter-spacing="2" fill="black">${bottomLine}</text>` +
      `</mask></defs><rect width="380" height="230" rx="14" fill="white" mask="url(#${id})"/></svg>`,
  );
}

function makeBagSvg(title: string, subtitle: string, notes: string, band: string, body: string, ink: string): string {
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 530">` +
      `<ellipse cx="215" cy="454" rx="125" ry="16" fill="black" fill-opacity="0.1"/>` +
      `<path d="M84 118 L108 424 L318 400 L338 96 Z" fill="${body}" stroke="black" stroke-opacity="0.14" stroke-width="2"/>` +
      `<path d="M84 118 L338 96 L336 124 L86 146 Z" fill="black" fill-opacity="0.06"/>` +
      `<line x1="92" y1="146" x2="332" y2="125" stroke="black" stroke-opacity="0.15" stroke-width="2"/>` +
      `<path d="M98 296 L326 274 L321 344 L103 366 Z" fill="${band}"/>` +
      `<g transform="rotate(-5.2 210 265)">` +
      `<text x="210" y="176" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.6" fill="${ink}" fill-opacity="0.68">SMALL BATCH ROASTERY</text>` +
      `<text x="210" y="256" text-anchor="middle" font-family="Impact,Arial Narrow,sans-serif" font-size="60" font-weight="800" letter-spacing="2" fill="${ink}">${title}</text>` +
      `<text x="210" y="314" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="white">${subtitle}</text>` +
      `<text x="210" y="338" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="white" fill-opacity="0.9">${notes}</text>` +
      `<text x="210" y="394" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="1.8" fill="${ink}" fill-opacity="0.72">300G WHOLE BEAN</text>` +
      `</g></svg>`,
  );
}

const PREVIEW_COLLECTIONS: CollectionSlideData[] = [
  {
    id: "limited-series",
    title: "Limited Series",
    brandLogoSrc: makeSeriesLogoSvg("LIMITED", "SERIES"),
    visualImageSrc: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80&auto=format&fit=crop",
    visualAlt: "Foggy mountain ridge above evergreen trees at dawn",
    description:
      "These represent the highest echelon of quality we source with partner farms every harvest. Each lot is grown in tiny quantities, making every release truly rare. Expect uncommon varieties, careful drying, and a vibrant cup. You owe it to yourself to brew one of these; it may shift how you taste coffee. Too bold? Not at all.",
    bags: [
      {
        id: "pacamara-jaune",
        name: "Pacamara Jaune",
        price: 36,
        imageSrc: makeBagSvg("LIMITED", "PACAMARA JAUNE", "White Peach, Honey, Bergamot", "firebrick", "whitesmoke", "black"),
      },
      {
        id: "pink-bourbon",
        name: "Pink Bourbon #2",
        price: 34,
        imageSrc: makeBagSvg("LIMITED", "PINK BOURBON #2", "Blood Orange, Hibiscus, Cane", "crimson", "whitesmoke", "black"),
      },
      {
        id: "limited-decaf",
        name: "Limited Decaf",
        price: 32,
        imageSrc: makeBagSvg("LIMITED", "DECAF RESERVE", "Dark Pitted Fruit, Cocoa, Cherry", "darkred", "whitesmoke", "black"),
      },
      {
        id: "gold-reserve",
        name: "Gold",
        price: 40,
        imageSrc: makeBagSvg("GOLD", "THERMAL SHOCK", "Jasmine, Tropical Nectar, Silk", "darkgoldenrod", "ivory", "black"),
      },
    ],
  },
  {
    id: "bright-series",
    title: "Bright Series",
    brandLogoSrc: makeSeriesLogoSvg("BRIGHT", "SERIES"),
    visualImageSrc: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop",
    visualAlt: "Sunlit forest trail with warm light across tall pines",
    description:
      "They are developed with bright aromatic flavors in mind. We believe the Bright Series can be extracted as espressos or filters; however, these lighter roasts will require more attention to the extraction details to ensure you are able to appreciate all they have to offer.",
    bags: [
      {
        id: "solstice",
        name: "Solstice Washed",
        price: 27,
        imageSrc: makeBagSvg("BRIGHT", "SOLSTICE WASHED", "Meyer Lemon, Jasmine, Apricot", "darkorange", "floralwhite", "black"),
      },
      {
        id: "kirinyaga",
        name: "Kirinyaga AA",
        price: 26,
        imageSrc: makeBagSvg("BRIGHT", "KIRINYAGA AA", "Red Currant, Grapefruit, Crisp", "goldenrod", "floralwhite", "black"),
      },
      {
        id: "tarrazu",
        name: "Tarrazu Honey",
        price: 28,
        imageSrc: makeBagSvg("BRIGHT", "TARRAZU HONEY", "Orange Blossom, Pear, Brown Sugar", "coral", "floralwhite", "black"),
      },
      {
        id: "cantaloupe",
        name: "Cantaloupe",
        price: 28,
        imageSrc: makeBagSvg("BRIGHT", "CANTALOUPE", "Ripe Melon, Mandarin, Clean", "chocolate", "floralwhite", "black"),
      },
    ],
  },
  {
    id: "warm-series",
    title: "Warm Series",
    brandLogoSrc: makeSeriesLogoSvg("WARM", "SERIES"),
    visualImageSrc: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop",
    visualAlt: "Calm mountain lake illuminated by golden sunset light",
    description:
      "It showcases the personality of the coffee without adding a burnt taste to it. These coffees are developed with sweetness, warmth, round body, and easy extraction in mind. A comfortable cup that will inevitably feel like a warm hug.",
    bags: [
      {
        id: "warmup",
        name: "Morning Warmup",
        price: 25,
        imageSrc: makeBagSvg("WARM", "MORNING WARMUP", "Milk Chocolate, Hazelnut, Toffee", "sienna", "linen", "black"),
      },
      {
        id: "hearth",
        name: "Hearth Blend",
        price: 26,
        imageSrc: makeBagSvg("WARM", "HEARTH BLEND", "Maple Syrup, Roasted Almond", "saddlebrown", "linen", "black"),
      },
      {
        id: "cedar",
        name: "Cedar Natural",
        price: 24,
        imageSrc: makeBagSvg("WARM", "CEDAR NATURAL", "Baked Apple, Caramel, Smooth", "peru", "linen", "black"),
      },
      {
        id: "amber",
        name: "Amber Espresso",
        price: 25,
        imageSrc: makeBagSvg("WARM", "AMBER ESPRESSO", "Praline, Plum, Velvety Crema", "brown", "linen", "black"),
      },
    ],
  },
  {
    id: "dark-series",
    title: "Dark Series",
    brandLogoSrc: makeSeriesLogoSvg("DARK", "SERIES"),
    visualImageSrc: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop",
    visualAlt: "Dark alpine mountain ridge beneath a deep night sky",
    description:
      "It highlights the balance of caramelized sugars and roast notes of the coffee. These specialty coffees are developed combining nostalgia of traditional coffee, richness, deep body and simple extraction in mind. An evolved cup of joe that becomes your classic espresso or go-to with milk drinks.",
    bags: [
      {
        id: "nocturne",
        name: "Nocturne 300g",
        price: 24,
        imageSrc: makeBagSvg("DARK", "NOCTURNE 300G", "Bittersweet Cocoa, Molasses", "black", "gainsboro", "black"),
      },
      {
        id: "diner",
        name: "Diner Roast",
        price: 23,
        imageSrc: makeBagSvg("DARK", "DINER ROAST", "Toasted Pecan, Dark Sugar", "darkslategray", "gainsboro", "black"),
      },
      {
        id: "ridge",
        name: "Ridge Blend 300g",
        price: 24,
        imageSrc: makeBagSvg("DARK", "RIDGE BLEND", "Espresso Crema, Black Cherry", "dimgray", "gainsboro", "black"),
      },
    ],
  },
];

export default function CollectionSplitShowcasePreview() {
  return (
    <CollectionSplitShowcase
      heading="Collections"
      viewAllLabel="View all"
      collections={PREVIEW_COLLECTIONS}
      onViewAllClick={(event) => event.preventDefault()}
      onLearnMoreClick={(_series, event) => event.preventDefault()}
    />
  );
}
