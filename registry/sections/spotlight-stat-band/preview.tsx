"use client";

import { SpotlightStatBand } from "./component";

export default function SpotlightStatBandPreview() {
  return (
    <SpotlightStatBand
      value={96}
      suffix="%"
      countDuration={2}
      lead="96% of people admit running on autopilot"
      columns={[
        "That comes from a national survey of 3,000 respondents. It matches what we hear every week in interviews, forums, and chats.",
        "We are building a shared home for all of you. A space where you see how other members handled the same daily prompt, what surprised them, and what shifted. Real voices, moving at the very same pace.",
      ]}
    />
  );
}
