"use client";

import { BookclubBenefitsStage } from "./component";

export default function BookclubBenefitsStagePreview() {
  return (
    <BookclubBenefitsStage
      id="benefits"
      heading="Why join?"
      headingImageAlt="Why join?"
      emblemAlt="Book Club Emblem"
      pills={[
        { position: "first", tone: "magenta", lines: ["Range of genres"] },
        { position: "second", tone: "orange", lines: ["Free shipping"] },
        { position: "third", tone: "periwinkle", lines: ["Affordable"] },
        { position: "fourth", tone: "cyan", lines: ["High quality ", "hardcovers"] },
        { position: "fifth", tone: "olive", lines: ["Curated books"] },
      ]}
    />
  );
}
