"use client";

import { StudioHoverReel } from "./component";

const frame = (photo: string, w: number, h: number) =>
  `https://images.unsplash.com/${photo}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

const ITEMS = [
  {
    image: frame("photo-1497366216548-37526070297c", 991, 1237),
    alt: "Bright studio room with a long desk.",
    width: 991,
    height: 1237,
    title: "Atelier",
    type: "Business Trips",
    about: "Paris, France",
    year: "2023",
  },
  {
    image: frame("photo-1497366754035-f200968a6e72", 1238, 1238),
    alt: "Open office with plants and windows.",
    width: 1238,
    height: 1238,
    title: "Meridian",
    type: "Conference, Trophy",
    about: "Studio of the Year",
    year: "2020",
  },
  {
    image: frame("photo-1486406146926-c627a92ad1ab", 828, 1238),
    alt: "Glass facade of a building seen from below.",
    width: 828,
    height: 1238,
    title: "Meridian",
    type: "Trophy",
    about: "Studio of the Year",
    year: "2023",
  },
  {
    image: frame("photo-1518005020951-eccb494ad742", 1847, 1237),
    alt: "Concrete building with a repeating pattern.",
    width: 1847,
    height: 1237,
    title: "Kora",
    type: "Studio Events",
    about: "Summit Hiking",
    year: "2022",
  },
];

const OVERVIEW = [
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
];

export default function StudioHoverReelPreview() {
  return (
    <div style={{ display: "flow-root", background: "var(--rk-bg)" }}>
      <StudioHoverReel
        id="reel"
        items={ITEMS}
        hoverLabel="Inspect studio archive moments"
        overview={OVERVIEW}
        showOverview
        cycleMs={1000}
        hoverDelayMs={80}
        markPaths={["M190 20a180 180 0 0 0 0 360Z", "M210 20a180 180 0 0 1 0 360Z"]}
        markViewBox="0 0 400 400"
        showMark
      />
    </div>
  );
}
