"use client";

import { VideoExpandHero } from "./component";

export default function VideoExpandHeroPreview() {
  return (
    <VideoExpandHero
      title="Curated journeys across every horizon"
      backgroundImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop"
      backgroundAlt="Sunlit coastal horizon"
      onSelectSearchStep={() => {}}
      onSearchSubmit={() => {}}
    />
  );
}
