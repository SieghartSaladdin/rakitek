import type { HeaderLink } from "@registry/sections/mono-clock-header/component";
import type { ManifestoPerson, ManifestoSegment } from "@registry/sections/founder-hover-manifesto/component";
import type { ReelItem, ReelParagraphSegment } from "@registry/sections/studio-hover-reel/component";
import type { CreditsBlock } from "@registry/sections/credits-index-columns/component";
import type { WordmarkGlyph } from "@registry/sections/giant-wordmark-footer/component";
import { CREDITS_PRIMARY, CREDITS_SECONDARY, FOOTER_GLYPHS } from "./demo-credits";

export interface MonoStudioAboutData {
  header: { links: HeaderLink[]; wordmarkPaths: string[]; wordmarkViewBox: string; homeLabel: string; email: string };
  note: { lines: string[]; contactLabel: string; linkLabel: string; linkHref: string };
  manifesto: { paragraphs: ManifestoSegment[][]; people: ManifestoPerson[] };
  reel: { items: ReelItem[]; overview: ReelParagraphSegment[][]; markPaths: string[]; markViewBox: string };
  credits: {
    primary: CreditsBlock[];
    secondary: CreditsBlock[];
    colophon: { heading: string; value: string };
    legal: string;
  };
  footer: { glyphs: WordmarkGlyph[] };
}

const unsplash = (photo: string, w: number, h: number) =>
  `https://images.unsplash.com/${photo}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

const FRAMES: Array<[string, number, number, string, string, string, string, string]> = [
  ["photo-1497366216548-37526070297c", 991, 1237, "Bright studio room with a long desk.", "Atelier", "Business Trips", "Paris, France", "2023"],
  ["photo-1497366754035-f200968a6e72", 1238, 1238, "Open office with plants and windows.", "Meridian", "Conference, Trophy", "Studio of the Year", "2020"],
  ["photo-1486406146926-c627a92ad1ab", 828, 1238, "Glass facade of a building seen from below.", "Meridian", "Trophy", "Studio of the Year", "2023"],
  ["photo-1518005020951-eccb494ad742", 1847, 1237, "Concrete building with a repeating pattern.", "Kora", "Studio Events", "Summit Hiking", "2022"],
  ["photo-1494438639946-1ebd1d20bf85", 991, 1236, "Person reading by a window.", "Kora", "Studio Life", "Studio Life", "2021"],
  ["photo-1500648767791-00dcc994a43e", 826, 1235, "Portrait of a man in soft light.", "Kora", "Office Details", "Poster Wall", "2022"],
];

export const MONO_STUDIO_ABOUT_DATA: MonoStudioAboutData = {
  header: {
    links: [
      { href: "#work", label: "Work" },
      { href: "#about", label: "About", active: true },
    ],
    wordmarkPaths: [
      "M24 12a22 22 0 1 0 0.01 0Z",
      "M64 12h44v44H64Z",
      "M120 56l23-44 23 44Z",
      "M180 56a22 22 0 0 1 44 0Z",
      "M232 12h18v44h-18Z",
    ],
    wordmarkViewBox: "0 0 251 68",
    homeLabel: "Kora home",
    email: "hello@kora.agency",
  },
  note: {
    lines: [
      "The studio is shaped by people who care",
      "deeply about design and the process behind.",
      "Each project becomes a case study and a",
      "meaningful part of our portfolio, developed",
      "with care and attention.",
    ],
    contactLabel: "Contact:",
    linkLabel: "hello@kora.agency",
    linkHref: "mailto:hello@kora.agency",
  },
  manifesto: {
    paragraphs: [
      [
        { text: "Kora is a concept-driven design studio founded by " },
        { text: "Sana Linderholm", personId: "partner" },
        { text: " and " },
        { text: "Alexander Montgomery", personId: "lead" },
        { text: " in 2018 and based in the EU (AMS, WAW, BER)." },
      ],
      [
        {
          text: "Rooted in modernist design principles and graphic design tradition, our work combines typography, grid systems and motion to create digital experiences that balance clarity, usability and bold visual expression.",
        },
      ],
      [
        {
          text: "Our team remains intentionally small, under 10 people, which allows creative direction to stay personal and decisions to stay sharp. Every project is led closely",
        },
      ],
      [{ text: "by the founders. No layers. No dilution." }],
    ],
    people: [
      {
        id: "lead",
        image: unsplash("photo-1507003211169-0a1dd7228f2d", 692, 898),
        alt: "Portrait of a man looking at the camera.",
        caption: "Alexander Montgomery (Design Director)",
        width: 692,
        height: 898,
      },
      {
        id: "partner",
        image: unsplash("photo-1438761681033-6461ffad8d80", 692, 898),
        alt: "Portrait of a woman smiling.",
        caption: "Sana Linderholm (Managing Director)",
        width: 692,
        height: 898,
      },
    ],
  },
  reel: {
    items: FRAMES.map(([photo, width, height, alt, title, type, about, year]) => ({
      image: unsplash(photo, width, height),
      alt,
      width,
      height,
      title,
      type,
      about,
      year,
    })),
    overview: [
      [
        {
          text: "Over the years, our work has grown from independent collaborations to partnerships with brands such as Atelier, Harbor, Meridian, Foundry, Northwind and Glyphic Systems. ",
        },
      ],
      [
        { text: "Along the way, Kora was named " },
        { text: "Studio of the Year by Design Weekly", href: "#awards" },
        { text: " in 2023, received " },
        { text: "4x Studio of the Year", href: "#awards" },
        { text: " titles from CSS Design Awards, and earned " },
        { text: "Red Dot ", href: "#awards" },
        { text: "recognition. Not as an objective, but as a reflection of consistent standards" },
      ],
      [
        {
          text: "We live design daily, not only through client work, but through research, experimentation, public talks and education. The studio's methodology has evolved into its own ",
        },
        { text: "educational platform", href: "#education" },
        { text: ", where we share the thinking behind our practice." },
      ],
      [
        {
          text: "Kora takes on a limited number of studio commissions each year, partnering with marketing leaders and founders who value authorship, clarity and long-term brand impact.",
        },
      ],
    ],
    markPaths: ["M190 20a180 180 0 0 0 0 360Z", "M210 20a180 180 0 0 1 0 360Z"],
    markViewBox: "0 0 400 400",
  },
  credits: {
    primary: CREDITS_PRIMARY,
    secondary: CREDITS_SECONDARY,
    colophon: { heading: "Typography:", value: "Inter Tight UI by Kora" },
    legal: "All rights reserved. ©2026 Kora",
  },
  footer: { glyphs: FOOTER_GLYPHS },
};
