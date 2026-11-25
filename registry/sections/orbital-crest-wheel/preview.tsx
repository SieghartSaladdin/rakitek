"use client";

import { OrbitalCrestWheel, type OrbitalCrestItem } from "./component";

const PREVIEW_CRESTS: OrbitalCrestItem[] = [
  { name: "The Iron Foundry", motifIndex: 0 },
  { name: "The Field Chroniclers", motifIndex: 1 },
  { name: "The Solstice Wardens", motifIndex: 2 },
  { name: "The Keystone Keepers", motifIndex: 3 },
  { name: "The Meridian Sailors", motifIndex: 4 },
];

const PREVIEW_HEADLINE_LINES = ["Pick a house.", "They shape", "your craft"];

const PREVIEW_LEAD = "A circle is a quiet corner built around one craft.";

const PREVIEW_BLURB =
  "Building stamina. Stepping outside more. Slowing down. Making things. Join the circles that match the days you want, and let shared rituals guide your next move. Or open your own chapter for your city, your neighbors, and pull others in. Nobody is ranked. You simply see you are not alone.";

export default function OrbitalCrestWheelPreview() {
  return (
    <OrbitalCrestWheel
      label="About Houses"
      chapter="Chapter 07"
      kicker="Join a house. Or start one."
      headlineLines={PREVIEW_HEADLINE_LINES}
      lead={PREVIEW_LEAD}
      blurb={PREVIEW_BLURB}
      crests={PREVIEW_CRESTS}
    />
  );
}
