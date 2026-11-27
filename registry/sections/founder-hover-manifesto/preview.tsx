"use client";

import { FounderHoverManifesto } from "./component";

const PEOPLE = [
  {
    id: "lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=692&q=80&auto=format&fit=crop",
    alt: "Portrait of a man looking at the camera.",
    caption: "Alexander Montgomery (Design Director)",
    width: 692,
    height: 898,
  },
  {
    id: "partner",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=692&q=80&auto=format&fit=crop",
    alt: "Portrait of a woman smiling.",
    caption: "Sana Linderholm (Managing Director)",
    width: 692,
    height: 898,
  },
];

const PARAGRAPHS = [
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
];

export default function FounderHoverManifestoPreview() {
  return (
    <FounderHoverManifesto
      id="manifesto"
      ariaLabel="Studio manifesto"
      paragraphs={PARAGRAPHS}
      people={PEOPLE}
      showPortraits
      hoverDelayMs={60}
    />
  );
}
