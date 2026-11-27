"use client";

import { OrchardRhombusIntro } from "./component";

export default function OrchardRhombusIntroPreview() {
  return (
    <OrchardRhombusIntro
      id="intro"
      paragraphs={[
        "We have carefully selected the finest of our harvests to craft a line of ready-to-enjoy delicacies. The pantry is a showcase of our artisanal creations, a signature collection where the purity of orchard fruit meets honest ingredients.",
      ]}
      afterParagraphs={[]}
      showMarkers={true}
      ariaLabel="Editorial introduction"
    />
  );
}
