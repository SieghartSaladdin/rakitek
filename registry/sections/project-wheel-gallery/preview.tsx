"use client";

import { ProjectWheelGallery } from "./component";

const frame = (photo: string) =>
  `https://images.unsplash.com/${photo}?w=1200&h=750&q=80&auto=format&fit=crop`;

const ITEMS = [
  { src: frame("photo-1486406146926-c627a92ad1ab"), alt: "Glass facade of a building seen from below." },
  { src: frame("photo-1518005020951-eccb494ad742"), alt: "Concrete building with a repeating pattern." },
  { src: frame("photo-1497366216548-37526070297c"), alt: "Bright studio room with a long desk." },
  { src: frame("photo-1497366754035-f200968a6e72"), alt: "Open office with plants and windows." },
  { src: frame("photo-1494438639946-1ebd1d20bf85"), alt: "Portrait of a person by a window." },
];

export default function ProjectWheelGalleryPreview() {
  return (
    <ProjectWheelGallery
      id="project"
      title="Atlas House"
      details={["Architecture, Furniture", "Creative Direction, Web Design/Dev"]}
      externalLink={{ href: "#live", label: "Live Website" }}
      backLink={{ href: "#work", label: "Back" }}
      items={ITEMS}
      galleryLabel="Atlas House project gallery"
      frameRatio={1.6}
      wheelTravel={500}
      captureKeys
    />
  );
}
