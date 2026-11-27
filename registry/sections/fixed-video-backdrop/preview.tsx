"use client";

import { FixedVideoBackdrop } from "./component";

export default function FixedVideoBackdropPreview() {
  return (
    <FixedVideoBackdrop
      id="backdrop"
      videoSrc=""
      mobileVideoSrc=""
      videoTitle="Background video"
      fallbackTop="22-25 OCTOBER 2026"
      fallbackCenter="KIND 15"
      fallbackBottom="DELTA - HARBOUR"
      fallbackDelayMs={5000}
      position="fixed"
    />
  );
}
