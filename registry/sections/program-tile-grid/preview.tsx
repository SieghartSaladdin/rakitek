"use client";

import { ProgramTileGrid } from "./component";

export default function ProgramTileGridPreview() {
  return (
    <ProgramTileGrid
      id="program"
      label="Discover"
      title="Program"
      ctaLabel="Explore"
      tiles={[
        {
          title: "TALKS",
          description: "40+ international speakers on creativity, technology and innovation.",
          imageSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=75&auto=format&fit=crop",
          imageAlt: "Speaker on a lit stage",
          href: "#talks",
        },
        {
          title: "ART TRAIL",
          description: "20+ installations across the city.",
          imageSrc: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=75&auto=format&fit=crop",
          imageAlt: "Glowing installation in a courtyard",
          href: "#trail",
        },
        {
          title: "PLAYGROUND",
          description: "Interactive experiences, workshops and hands-on discoveries.",
          imageSrc: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=75&auto=format&fit=crop",
          imageAlt: "People trying an interactive exhibit",
          href: "#playground",
        },
        {
          title: "PARTIES",
          description: "3 nights of music, performance and celebration.",
          imageSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=75&auto=format&fit=crop",
          imageAlt: "DJ booth under colored lights",
          href: "#parties",
        },
        {
          title: "WORKSHOPS KIDS",
          description: "Creative hands-on workshops for the youngest explorers.",
          imageSrc: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=75&auto=format&fit=crop",
          imageAlt: "Children building together at a table",
          href: "#kids",
        },
      ]}
    />
  );
}
