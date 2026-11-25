export interface StorefrontDemoData {
  brand: string;
  promoTitle: string;
  promoDetail: string;
  currencyCode: string;
  shippingLabel: string;
  fallbackBagImage: string;
  initialCart: Array<{ id: string; name: string; price: number; quantity: number; image?: string }>;
  quizSeriesIndex: Record<string, number>;
  hero: {
    taglineWords: string[];
    description: string;
    ctaLabel: string;
    moodHeading: string;
    marqueeText: string;
    backgroundImage?: string;
    products: Array<{
      id: string;
      title: string;
      price: string;
      type: string;
      origin: string;
      process: string;
    }>;
  };
  quiz: {
    questions: Array<{
      id: string;
      prompt: string;
      options: Array<{ id: string; label: string; matchKey: string }>;
    }>;
    results: Array<{
      key: string;
      title: string;
      summary: string;
      ctaLabel: string;
      secondaryCtaLabel?: string;
    }>;
  };
  mission: {
    tagline: string;
    statement: string;
    ctaLabel: string;
    topCaption: string;
    bottomCaption: string;
    coordinates: string;
  };
  manifesto: {
    words: [string, string, string];
    steps: string[];
    description: string;
    ctaLabel: string;
  };
  footer: {
    labHeading: string;
    labAddress: string;
    closingHeadline: string;
    copyright: string;
    creditLabel: string;
  };
}

const BAG_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 68'><path d='M8 6h40l4 58H4L8 6Z' fill='white' stroke='silver' stroke-width='1.5'/><rect x='14' y='26' width='28' height='18' fill='gainsboro'/></svg>",
  );

// Neutral sample data for storefront-demo-page (verified 0 FAIL under 4px cap in Step 1 assembly check).
export const STOREFRONT_DEMO_DATA: StorefrontDemoData = {
  brand: "MERIDIAN",
  promoTitle: "Free Shipping",
  promoDetail: "Local & metro orders 35$+ | Domestic orders 55$+ | Same-day courier",
  currencyCode: "USD",
  shippingLabel: "FREE domestic shipping",
  fallbackBagImage: BAG_SVG,
  initialCart: [],
  quizSeriesIndex: { limited: 0, bright: 1, warm: 1, dark: 0 },
  hero: {
    taglineWords: ["Craft", "Without", "the", "Noise"],
    description:
      "Small-batch seasonal goods roasted and packed to order, designed for slower mornings and deliberate daily rituals.",
    ctaLabel: "Shop Now",
    moodHeading: "An independent editorial storefront",
    marqueeText: "new * Fresh seasonal release * New",
    backgroundImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=70&auto=format&fit=crop",
    products: [
      {
        id: "solstice",
        title: "Solstice",
        price: "$28.00",
        type: "Single Origin",
        origin: "Highland Lot",
        process: "Washed",
      },
      {
        id: "nocturne",
        title: "Nocturne",
        price: "$26.00",
        type: "House Blend",
        origin: "Dual Harvest",
        process: "Natural & Washed",
      },
      {
        id: "altitude",
        title: "Altitude",
        price: "$40.00",
        type: "Micro Lot",
        origin: "Andes Ridge",
        process: "Extended Fermentation",
      },
    ],
  },
  quiz: {
    questions: [
      {
        id: "q1",
        prompt: "Which flavor direction fits your routine?",
        options: [
          { id: "q1-a", label: "Bright, crisp & floral", matchKey: "bright" },
          { id: "q1-b", label: "Sweet, balanced & smooth", matchKey: "warm" },
          { id: "q1-c", label: "Deep, caramelized & classic", matchKey: "dark" },
          { id: "q1-d", label: "Rare, experimental & expressive", matchKey: "limited" },
        ],
      },
      {
        id: "q2",
        prompt: "How do you prepare it at home?",
        options: [
          { id: "q2-a", label: "Pour-over / Filter", matchKey: "bright" },
          { id: "q2-b", label: "Espresso bar", matchKey: "warm" },
          { id: "q2-c", label: "French press / Immersion", matchKey: "dark" },
          { id: "q2-d", label: "Rotating daily methods", matchKey: "limited" },
        ],
      },
    ],
    results: [
      {
        key: "limited",
        title: "Limited Series",
        summary: "Rare micro-lots with vibrant fruit clarity and expressive harvest character.",
        ctaLabel: "Explore Limited Series",
        secondaryCtaLabel: "Add Altitude ($40)",
      },
      {
        key: "bright",
        title: "Bright Series",
        summary: "Crisp floral and citrus profiles crafted for modern filter and espresso.",
        ctaLabel: "Explore Bright Series",
        secondaryCtaLabel: "Add Solstice ($28)",
      },
      {
        key: "warm",
        title: "Warm Series",
        summary: "Velvety cocoa, caramel sweetness, and an approachable daily finish.",
        ctaLabel: "Explore Warm Series",
        secondaryCtaLabel: "Add Nocturne ($26)",
      },
      {
        key: "dark",
        title: "Dark Series",
        summary: "Deep dark chocolate, toasted nut warmth, and full syrupy body.",
        ctaLabel: "Explore Dark Series",
        secondaryCtaLabel: "Add Nocturne ($26)",
      },
    ],
  },
  mission: {
    tagline: "Our\nMission",
    statement:
      "We believe deliberate craft starts with narrowing focus. Rather than chasing endless seasonal trends, our team works closely with partner growers across every harvest, tasting each lot by hand from origin selection to final small-batch release.",
    ctaLabel: "Learn More",
    topCaption: "clarity\nstarts with craft.",
    bottomCaption: "Pick a seasonal lot\nand taste the difference.",
    coordinates: "45.5017° N - 73.5673° W",
  },
  manifesto: {
    words: ["never", "run", "out"],
    steps: [
      "Select your lot and bag size",
      "Select your delivery cadence",
      "Sit back and enjoy",
    ],
    description:
      "Keep your shelf stocked on your own schedule. Swap releases, pause a week, or skip any delivery anytime with zero lock-in.",
    ctaLabel: "Subscribe",
  },
  footer: {
    labHeading: "Tasting Room",
    labAddress: "240 Market Street,\nSuite 3B\nPortland, OR 97204",
    closingHeadline: "And you? How do you start your day?",
    copyright: "© 2026 Meridian Goods Co.",
    creditLabel: "Rakitek Demo Page",
  },
};
