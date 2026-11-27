"use client";

import { OrchardGravityContactStage } from "./component";
import { BOTANICAL_SHAPES } from "./fruit-svgs";

export default function OrchardGravityContactStagePreview() {
  return (
    <OrchardGravityContactStage
      id="contact"
      title="Contact"
      subtitle="Our grove springs from the earth and thrives with connection."
      offices={[
        { label: "Registered office", lines: ["Via degli Agrumi, 18", "95123 - Coastal Valley"] },
        { label: "Operational office", lines: ["Contrada Solare, Lot 4", "96014 - Grove District"] },
      ]}
      socialLabel="Follow us"
      socialLinks={[{ label: "@instagram", href: "https://instagram.com", external: true }]}
      emailPrompt="Do you have a question or would you like to find out more about us? Drop us a line, we would be delighted to share the story of our orchard groves."
      emailLabel="hello@solaraorchard.example"
      emailHref="mailto:hello@solaraorchard.example"
      shapes={BOTANICAL_SHAPES}
      gravity={3.35}
      clickBlastRadius={420}
      ariaLabel="Contact information"
    />
  );
}
