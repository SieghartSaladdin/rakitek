import type { FixedVideoBackdropProps } from "@registry/sections/fixed-video-backdrop/component";
import type { FestivalHeaderProps } from "@registry/sections/festival-header/component";
import type { FestivalHeroManifestoProps } from "@registry/sections/festival-hero-manifesto/component";
import type { CinematicMediaBannerProps } from "@registry/sections/cinematic-media-banner/component";
import type { ProgramTileGridProps } from "@registry/sections/program-tile-grid/component";
import type { FestivalLineupSectionProps } from "@registry/sections/festival-lineup-section/component";
import type { NumbersPracticalInfoProps } from "@registry/sections/numbers-practical-info/component";
import type { TicketMarqueeBarProps } from "@registry/sections/ticket-marquee-bar/component";
import type { FestivalFooterProps } from "@registry/sections/festival-footer/component";
import type { FestivalSectionDividerProps } from "@registry/ui/festival-section-divider/component";
import { PARTY_CARDS, PLAYGROUND_CARDS, PROGRAM_TILES, TALK_CARDS, TRAIL_CARDS } from "./demo-cards";

export interface FestivalDemoData {
  skipLinkLabel: string;
  backdrop: FixedVideoBackdropProps;
  header: FestivalHeaderProps;
  hero: FestivalHeroManifestoProps;
  featureBanner: CinematicMediaBannerProps;
  program: ProgramTileGridProps;
  dividers: readonly [
    FestivalSectionDividerProps,
    FestivalSectionDividerProps,
    FestivalSectionDividerProps,
    FestivalSectionDividerProps,
  ];
  talks: FestivalLineupSectionProps;
  trail: FestivalLineupSectionProps;
  midBanner: CinematicMediaBannerProps;
  playground: FestivalLineupSectionProps;
  parties: FestivalLineupSectionProps;
  numbers: NumbersPracticalInfoProps;
  marquee: TicketMarqueeBarProps;
  closingBanner: CinematicMediaBannerProps;
  footer: FestivalFooterProps;
}

const LOGO_MARK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 367 356'><path d='M0 0h300l67 67v289H0z' fill='black'/></svg>",
  );

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
];

export const FESTIVAL_DEMO_DATA: FestivalDemoData = {
  skipLinkLabel: "Skip to main content",
  backdrop: {
    id: "backdrop",
    fallbackTop: "22-25 OCTOBER 2026",
    fallbackCenter: "SIGNAL 15",
    fallbackBottom: "HARBOUR CITY - NORTHLAND",
    fallbackDelayMs: 0,
    position: "fixed",
  },
  header: {
    id: "site-header",
    logoSrc: LOGO_MARK,
    logoAlt: "Signal Festival logo",
    logoHref: "#top",
    brandName: "Signal",
    languages: [
      { code: "fr", label: "FR" },
      { code: "en", label: "EN" },
    ],
    activeLanguage: "en",
    ctaLabel: "Tickets",
    ctaHref: "#tickets",
    menuLabel: "Menu",
    toggleMenuLabel: "Toggle menu",
    closeMenuLabel: "Close menu",
    drawerCtaLabel: "Tickets",
    drawerCtaHref: "#tickets",
    menuItems: [
      {
        label: "Professionals",
        href: "#pro",
        children: [
          { label: "Talks", href: "#talks" },
          { label: "Art Trail", href: "#art-trail" },
        ],
      },
      {
        label: "Public",
        href: "#public",
        children: [
          { label: "Playground", href: "#playground" },
          { label: "For Kids", href: "#kids" },
        ],
      },
      { label: "By Night", href: "#parties" },
      { label: "Practical", href: "#practical" },
    ],
    socials: SOCIALS,
  },
  hero: {
    id: "top",
    titleLines: ["SIGNAL", "FESTIVAL"],
    dateRange: "22–25",
    month: "OCT",
    year: "2026",
    tagline: "Art, Science & Technology",
    location: "Harbour City, Northland, Europe",
    stats: [
      { value: "40+", label: "Talks" },
      { value: "20+", label: "Artworks" },
      { value: "3", label: "Parties" },
    ],
    primaryAction: { label: "Tickets", href: "#tickets", arrow: true },
    secondaryAction: { label: "Timetable", href: "#practical", arrow: false },
  },
  featureBanner: {
    id: "aftermovie",
    imageSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=75&auto=format&fit=crop",
    imageAlt: "",
    imageOpacity: 0.8,
  },
  program: { id: "program", label: "Discover", title: "Program", ctaLabel: "Explore", tiles: PROGRAM_TILES },
  dividers: [
    { number: "001", label: "Talks", align: "left" },
    { number: "002", label: "Art Trail", align: "right" },
    { number: "003", label: "Parties", align: "left" },
    { number: "004", label: "Festival in numbers", align: "right" },
  ],
  talks: {
    id: "talks",
    label: "Get inspired",
    title: "Talks",
    ghostNumber: "40+",
    description:
      "More than 40 talks on creative coding, data visualization, machine learning, branding and strategy, mixed reality, bio art, design, research and more.",
    cards: TALK_CARDS,
    actions: [
      { label: "View all talks", href: "#talks", variant: "outline" },
      { label: "Tickets", href: "#tickets", variant: "filled" },
    ],
  },
  trail: {
    id: "art-trail",
    label: "Discover",
    title: "Art Trail",
    stats: [
      { value: "20+", label: "Artworks" },
      { value: "Free", label: "Trail access" },
    ],
    cards: TRAIL_CARDS,
    actions: [
      { label: "View all installations", href: "#art-trail", variant: "outline" },
      { label: "Tickets", href: "#tickets", variant: "filled" },
    ],
  },
  midBanner: {
    imageSrc: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=75&auto=format&fit=crop",
    imageAlt: "Visitors walking through a lit exhibition hall",
  },
  playground: {
    id: "playground",
    label: "Experiment",
    title: "Playground",
    description:
      "An immersive, playful exhibition where digital art is explored through interaction, experimentation and play at any age.",
    cards: PLAYGROUND_CARDS,
    eagerCards: 4,
    titleLetterSpacing: "-0.05em",
    titleLineHeight: 0.85,
    actions: [{ label: "View all playground", href: "#playground", variant: "outline" }],
  },
  parties: {
    id: "parties",
    label: "By Night",
    title: "Parties",
    ghostNumber: "3",
    description:
      "As night falls, the festival takes over landmark venues across the city with live music, audiovisual performances and DJ sets.",
    cards: PARTY_CARDS,
    eagerCards: 0,
    actions: [
      { label: "View all parties", href: "#parties", variant: "outline" },
      { label: "Tickets", href: "#tickets", variant: "filled" },
    ],
  },
  numbers: {
    id: "practical",
    numbersLabel: "Festival in numbers",
    numbers: [
      { value: "40+", label: "Talks" },
      { value: "20+", label: "Artworks" },
      { value: "3", label: "Parties" },
      { value: "230+", label: "Speakers" },
      { value: "4", label: "Days" },
      { value: "15", label: "Editions" },
    ],
    infoLabel: "Practical info",
    info: [
      { title: "Dates", text: "22–25 October 2026", icon: "calendar" },
      { title: "Location", text: "Harbour City, Northland, Europe", icon: "pin" },
      { title: "Getting there", text: "1h from the capital by train", icon: "train", actionLabel: "More info", actionHref: "#practical" },
    ],
  },
  marquee: { id: "tickets", label: "GET TICKETS", href: "#tickets", repeat: 32 },
  closingBanner: {
    imageSrc: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=75&auto=format&fit=crop",
    imageAlt: "Crowd in front of a lit stage",
  },
  footer: {
    id: "footer",
    newsletterLabel: "Newsletter",
    newsletterTitleLines: ["Stay", "Informed"],
    newsletterText: "Subscribe to our newsletter to stay updated on the latest news and announcements for the next edition.",
    newsletterButtonLabel: "Subscribe",
    newsletterHref: "#newsletter",
    logoSrc: LOGO_MARK,
    logoAlt: "Signal Festival logo",
    logoHref: "#top",
    editionLabel: "15th edition",
    dateLabel: "22–25 October 2026",
    placeLabel: "Harbour City, Northland",
    socials: SOCIALS,
    columns: [
      { title: "Festival", links: [{ label: "About", href: "#top" }, { label: "Partners", href: "#footer" }, { label: "Volunteers", href: "#footer" }] },
      { title: "Program", links: [{ label: "Talks", href: "#talks" }, { label: "Playground", href: "#playground" }, { label: "Art Trail", href: "#art-trail" }, { label: "By Night", href: "#parties" }] },
      { title: "Practical", links: [{ label: "Access", href: "#practical" }, { label: "Accommodation", href: "#practical" }, { label: "Tickets", href: "#tickets" }] },
      { title: "Legal", links: [{ label: "Legal notice", href: "#footer" }, { label: "Privacy", href: "#footer" }, { label: "Contact", href: "mailto:hello@example.com", newTab: false }] },
    ],
    copyright: "© 2026 Signal Festival. All rights reserved.",
    metaItems: [
      { label: "Created by the festival team" },
      { label: "1 Harbour Street, 1000 Harbour City" },
      { label: "Login", href: "#footer" },
    ],
  },
};
