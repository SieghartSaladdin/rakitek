"use client";

import { GiantWordmarkFooter } from "./component";

const GLYPHS = [
  {
    flex: "0 0 25.35%",
    viewBox: "0 0 360 388",
    d: "M180 44a150 150 0 1 0 0.01 0ZM180 106a88 88 0 1 1-0.01 0Z",
  },
  {
    flex: "0 0 20.99%",
    marginLeft: "2.11%",
    viewBox: "0 0 298 388",
    d: "M52 50H246V337H52ZM110 108V279H188V108Z",
  },
  {
    flex: "0 0 23.66%",
    marginLeft: "-1.9%",
    viewBox: "0 0 336 388",
    d: "M0 6.3H336L168 380.8Z",
  },
  {
    flex: "0 0 21.06%",
    marginLeft: "-0.42%",
    viewBox: "0 0 300 388",
    d: "M0 387.3V200a150 150 0 0 1 300 0V387.3Z",
  },
  {
    flex: "0 0 8.17%",
    marginLeft: "0.99%",
    viewBox: "0 0 116 123",
    d: "M58 6a58 58 0 1 0 0.01 0ZM58 16a48 48 0 1 1-0.01 0Z",
    raised: true,
    evenOdd: true,
  },
];

export default function GiantWordmarkFooterPreview() {
  return (
    <GiantWordmarkFooter
      id="signature"
      ariaLabel="Studio signature"
      glyphs={GLYPHS}
      startDelayMs={100}
      glyphStepMs={100}
    />
  );
}
