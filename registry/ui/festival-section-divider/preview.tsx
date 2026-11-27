"use client";

import { FestivalSectionDivider } from "./component";

export default function FestivalSectionDividerPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, background: "var(--rk-bg)" }}>
      <FestivalSectionDivider id="talks-divider" number="001" label="Talks" align="left" />
      <FestivalSectionDivider id="trail-divider" number="002" label="Art Trail" align="right" />
    </div>
  );
}
