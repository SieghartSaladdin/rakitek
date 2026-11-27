"use client";

import { OrchardVisionParallaxBox } from "./component";

const PORTRAIT_CUTOUT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='900' viewBox='0 0 800 900' preserveAspectRatio='xMidYMax slice'><circle cx='400' cy='520' r='105' fill='sienna'/><path d='M130 900c0-120 100-230 270-230s270 110 270 230Z' fill='darkolivegreen'/></svg>",
  );

export default function OrchardVisionParallaxBoxPreview() {
  return (
    <OrchardVisionParallaxBox
      id="vision"
      title="Vision"
      subtitle={"Growing the future,\nstarting from the earth."}
      backgroundImage="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80&auto=format&fit=crop"
      foregroundImage={PORTRAIT_CUTOUT}
      foregroundAlt="Grower portrait"
      showForeground={true}
      ariaLabel="Vision"
    />
  );
}
