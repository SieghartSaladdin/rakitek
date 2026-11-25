"use client";

import { EditorialDarkFooter, type FooterVisualFrame } from "./component";

const PREVIEW_VISUALS: FooterVisualFrame[] = [
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop",
    alt: "Hands sharing freshly poured specialty coffee cups over a wooden cafe table.",
  },
  {
    src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80&auto=format&fit=crop",
    alt: "Roasted espresso crema pouring smoothly into a ceramic cup.",
  },
  {
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80&auto=format&fit=crop",
    alt: "Barista preparing filter coffee in a warm editorial coffee bar.",
  },
];

export default function EditorialDarkFooterPreview() {
  return (
    <EditorialDarkFooter
      visualFrames={PREVIEW_VISUALS}
      onLinkClick={(_href, event) => event.preventDefault()}
    />
  );
}
