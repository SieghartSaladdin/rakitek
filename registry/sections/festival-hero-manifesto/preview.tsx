"use client";

import { FestivalHeroManifesto } from "./component";

export default function FestivalHeroManifestoPreview() {
  return (
    <FestivalHeroManifesto
      id="festival-hero"
      titleLines={["ARTS", "FESTIVAL"]}
      dateRange="22 - 25"
      month="OCT"
      year="2026"
      tagline="Art, Science & Technology"
      location="Port City, Northland"
      stats={[
        { value: "40+", label: "Talks" },
        { value: "20+", label: "Artworks" },
        { value: "3", label: "Parties" },
      ]}
      primaryAction={{ label: "Tickets", href: "#tickets", arrow: true }}
      secondaryAction={{ label: "Timetable", href: "#schedule", arrow: false }}
      minTitleSize={36}
    />
  );
}
