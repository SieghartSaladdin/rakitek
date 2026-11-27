"use client";

import { OrchardPhotoDragSlider } from "./component";

export default function OrchardPhotoDragSliderPreview() {
  return (
    <OrchardPhotoDragSlider
      id="gallery"
      images={[
        { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80&auto=format&fit=crop", alt: "Orchard rows at dawn" },
        { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&auto=format&fit=crop", alt: "Harvest field" },
        { src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1600&q=80&auto=format&fit=crop", alt: "Crates of fresh fruit" },
        { src: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=1600&q=80&auto=format&fit=crop", alt: "Citrus branches" },
      ]}
      galleryLabel="Photo gallery"
      hint="Drag or use the arrow keys to browse the photo gallery."
      dragLabel="Drag"
    />
  );
}
