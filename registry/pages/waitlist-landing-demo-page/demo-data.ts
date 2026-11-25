export interface WaitlistLandingDemoData {
  brandName: string;
  contactEmail: string;
  navLinks: Array<{ label: string; targetId: string }>;
  spotlight: {
    value: number;
    suffix: string;
    lead: string;
    columns: readonly [string, string];
  };
  hero: {
    marqueeText: string;
    mobileOfferText: string;
    memberCount: number;
    memberCountLabel: string;
    headline: string;
    emailPlaceholder: string;
    consentLabel: string;
    ratingTitle: string;
    ratingSubtitle: string;
    submitLabel: string;
    successTitle: string;
    successSubtitle: string;
  };
  footer: {
    tagline: string;
    links: Array<{ label: string; href: string }>;
  };
}

export const WAITLIST_LANDING_DEMO_DATA: WaitlistLandingDemoData = {
  brandName: "Oriel",
  contactEmail: "hello@oriel.studio",
  navLinks: [
    { label: "Why", targetId: "spotlight" },
    { label: "Waitlist", targetId: "waitlist" },
  ],
  spotlight: {
    value: 96,
    suffix: "%",
    lead: "96% of adults admit running on autopilot",
    columns: [
      "That comes from a national survey of 3,000 respondents. It matches what we hear every week in interviews, forums, and chats.",
      "We are building a shared home for all of you. A space where you see how other members handled the same daily prompt, what surprised them, and what shifted together.",
    ],
  },
  hero: {
    marqueeText: "First 500 get early cohort access * ",
    mobileOfferText: "First 500 get early cohort access",
    memberCount: 2480,
    memberCountLabel: "people already on the list",
    headline: "Sign up to\nwaitlist",
    emailPlaceholder: "Enter your email",
    consentLabel: "Send me occasional product updates",
    ratingTitle: "How ready are you?",
    ratingSubtitle: "Tap a star to join our founding cohort",
    submitLabel: "Join Waitlist",
    successTitle: "You are on the list",
    successSubtitle: "We will reach out before the next cohort opens.",
  },
  footer: {
    tagline: "Built by makers who got tired of autopilot.",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Contact", href: "mailto:hello@oriel.studio" },
    ],
  },
};
