"use client";

import { useState } from "react";
import { OrchardJarFlight, type OrchardJarFlightData } from "./component";
import { jarArt, labelArt } from "@registry/ui/orchard-spinning-jar/component";

const flightFor = (w: number, h: number): OrchardJarFlightData => {
  const wide = w > 1024;
  const size = wide ? { width: 461, height: 741 } : { width: 280, height: 450 };
  return {
    baseSrc: jarArt("goldenrod"),
    labelUrl: labelArt("PISTACHIO", "Velvet Cream", "darkseagreen", "darkolivegreen"),
    spinElapsed: 0,
    from: wide
      ? { cx: 1069.8, cy: 546.8, ...size, rotation: -5.58845, scale: 0.849832 }
      : { cx: 619.2, cy: 370.8, ...size, rotation: 25.5884, scale: 1.44284 },
    to: { cx: w / 2, cy: h + size.height * 0.2, ...size, rotation: 0, scale: 1.25 },
  };
};

export default function OrchardJarFlightPreview() {
  const [flight, setFlight] = useState<OrchardJarFlightData | null>(null);
  return (
    <div style={{ background: "var(--rk-bg)", minHeight: "100vh", padding: 24 }}>
      <button
        type="button"
        data-start-flight
        onClick={() => setFlight(flightFor(window.innerWidth, window.innerHeight))}
        style={{ background: "var(--rk-fg)", border: 0, borderRadius: "var(--rk-radius-pill)", color: "var(--rk-bg)", cursor: "pointer", font: "inherit", fontSize: 13, padding: "8px 16px" }}
      >
        Fly jar
      </button>
      <OrchardJarFlight
        flight={flight}
        heroReady={true}
        canLand={true}
        flightMs={2000}
        maxFlightMs={6000}
        onFinish={() => setFlight(null)}
      />
    </div>
  );
}
