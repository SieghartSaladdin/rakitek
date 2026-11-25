"use client";

import { KineticManifestoSteps } from "./component";

export default function KineticManifestoStepsPreview() {
  return (
    <KineticManifestoSteps
      words={["never", "run", "out"]}
      steps={[
        "Select your coffee and size",
        "Select your frequency",
        "Sit back and enjoy",
      ]}
      visualImage="https://images.unsplash.com/photo-1522726481795-a4ae463bcf81?w=800&q=80&auto=format&fit=crop"
      visualAlt="Pour-over coffee brewer set on a glass carafe over a digital scale."
      description="Subscribe to monthly deliveries and save up to 15% on every order. Pick the roast or series that fits your taste."
      ctaLabel="Subscribe"
      ctaHref="#subscribe"
    />
  );
}
