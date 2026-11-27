"use client";

import { useState } from "react";
import { OrchardFruitStage, orchardFruitItems } from "./component";

export default function OrchardFruitStagePreview() {
  const [round, setRound] = useState(0);
  return (
    <div
      data-fruit-stage-demo
      style={{ background: "var(--rk-bg)", height: "100vh", overflow: "hidden", position: "relative", ["--fruit-base" as string]: "clamp(110px, 13vw, 250px)" }}
    >
      <OrchardFruitStage
        key={round}
        items={orchardFruitItems(0.85, 1, "preview")}
        gravity={5.2}
        interactive={false}
        clickBlastRadius={420}
        style={{ inset: "0 0 -8vh" }}
      />
      <button
        type="button"
        onClick={() => setRound((r) => r + 1)}
        style={{ background: "var(--rk-fg)", border: 0, borderRadius: "var(--rk-radius-pill)", color: "var(--rk-bg)", cursor: "pointer", font: "inherit", fontSize: 13, left: 16, padding: "8px 16px", position: "absolute", top: 16, zIndex: 3 }}
      >
        Drop again
      </button>
    </div>
  );
}
