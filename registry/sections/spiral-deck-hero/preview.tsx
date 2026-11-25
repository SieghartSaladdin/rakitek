"use client";

import { DEFAULT_SPIRAL_CARDS, SpiralDeckHero } from "./component";

export default function SpiralDeckHeroPreview() {
  return (
    <SpiralDeckHero
      brandName="ORIEL"
      tagline="One real-world challenge a day. Four skills that grow when you act out in the world."
      ctaLabel="Join Waitlist"
      headline="Return to living"
      cards={DEFAULT_SPIRAL_CARDS}
      onBrandClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onCtaClick={() => {}}
    />
  );
}
