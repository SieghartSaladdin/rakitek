"use client";

import { OrchardEditorialPageHero } from "./component";

export default function OrchardEditorialPageHeroPreview() {
  return (
    <OrchardEditorialPageHero
      id="page-hero"
      title="Pantry"
      coverImage="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop"
      coverAlt="Artisanal harvest table spread"
      coverTitle="Our land, one jar at a time."
      coverDark={true}
      ariaLabel="Page hero"
    />
  );
}
