"use client";

import { PhysicsStatsPit, type StatColumn } from "./component";

const PREVIEW_COLUMNS: StatColumn[] = [
  { key: "VIT", label: "Vitality", target: 88, subtitle: "Daily energy and endurance" },
  { key: "CLR", label: "Clarity", target: 56, subtitle: "Focused thought and calm judgment" },
  { key: "CRF", label: "Craft", target: 68, subtitle: "Deliberate practice and skill depth" },
  { key: "PRS", label: "Presence", target: 76, subtitle: "Steady attention in every room" },
];

const PREVIEW_HEADLINE = ["Every habit", "leaves a trace."];

const PREVIEW_BODY =
  "Choose the part of your craft you want to grow, and every step you take piles up there. Vitality, clarity, craft, presence. Some land right where you aimed. Some surprise you. Either way, it compounds into real progress.";

export default function PhysicsStatsPitPreview() {
  return (
    <PhysicsStatsPit
      label="About Metrics"
      chapter="Chapter 06"
      headlineLines={PREVIEW_HEADLINE}
      body={PREVIEW_BODY}
      columns={PREVIEW_COLUMNS}
    />
  );
}
