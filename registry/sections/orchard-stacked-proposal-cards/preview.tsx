"use client";

import { OrchardStackedProposalCards } from "./component";

export default function OrchardStackedProposalCardsPreview() {
  return (
    <OrchardStackedProposalCards
      id="experiences"
      title={"Discover \nour \nexperiences"}
      sideLeft={"Grove Visits\nAll Year"}
      sideRight={"Curated\nTastings"}
      durationLabel="Duration"
      experienceLabel="The Experience"
      includesLabel="What is included"
      cards={[
        {
          title: "Citrus Grove\nTasting",
          duration: "2 hours",
          experience: "Guided orchard walk followed by seasonal marmalade and honey pairings.",
          includes: "Grove walk, 5 tastings, herbal tea",
          imageSrc:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop",
          imageAlt: "Citrus grove harvest tasting table",
        },
        {
          title: "Harvest Kitchen\nWorkshop",
          duration: "3.5 hours",
          experience: "Small-batch copper kettle preserving class with warm sourdough service.",
          includes: "Apron, 2 custom jars, light lunch",
          imageSrc:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80&auto=format&fit=crop",
          imageAlt: "Artisanal preserves and fresh bread",
        },
        {
          title: "Terraced Table\nSunset Lunch",
          duration: "3 hours",
          experience: "Long-table seasonal tasting menu overlooking the coastal fruit rows.",
          includes: "4 courses, botanical infusions",
          imageSrc:
            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop",
          imageAlt: "Outdoor orchard lunch table",
        },
      ]}
      ariaLabel="Curated experiences"
    />
  );
}
