"use client";

import { useState } from "react";
import { OrchardPageTransition, type OrchardTransitionPhase } from "./component";

const btn = {
  background: "var(--rk-fg)", border: 0, borderRadius: "var(--rk-radius-pill)", color: "var(--rk-bg)",
  cursor: "pointer", font: "inherit", fontSize: 13, padding: "8px 16px",
} as const;

export default function OrchardPageTransitionPreview() {
  const [phase, setPhase] = useState<OrchardTransitionPhase>("idle");
  return (
    <div style={{ background: "var(--rk-bg)", minHeight: "100vh", padding: 24 }}>
      <div style={{ display: "flex", gap: 8, position: "relative", zIndex: 10000 }}>
        <button type="button" style={btn} data-phase="covering" onClick={() => setPhase("covering")}>Cover</button>
        <button type="button" style={btn} data-phase="lifting" onClick={() => setPhase("lifting")}>Lift</button>
        <button type="button" style={btn} data-phase="idle" onClick={() => setPhase("idle")}>Reset</button>
      </div>
      <OrchardPageTransition phase={phase} onCoverFinished={() => undefined} onLiftFinished={() => setPhase("idle")} />
    </div>
  );
}
