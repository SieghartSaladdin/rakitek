"use client";

import { useState } from "react";
import { OrchardFruitLoader } from "./component";

export default function OrchardFruitLoaderPreview() {
  const [run, setRun] = useState(0);
  const [finished, setFinished] = useState(false);
  // ?hold keeps the loader on screen (used when measuring the layout)
  const [hold] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("hold"));
  return (
    <div style={{ background: "var(--rk-surface)", minHeight: "100vh", padding: 24 }}>
      <button
        type="button"
        onClick={() => {
          setFinished(false);
          setRun((r) => r + 1);
        }}
        style={{ background: "var(--rk-fg)", border: 0, borderRadius: "var(--rk-radius-pill)", color: "var(--rk-bg)", cursor: "pointer", font: "inherit", fontSize: 13, padding: "8px 16px" }}
      >
        {finished ? "Replay loader" : "Loading..."}
      </button>
      <OrchardFruitLoader
        key={run}
        id="loader"
        closeDelayMs={1800}
        gravity={3.35}
        progressDurationMs={1700}
        progressDelayMs={300}
        progressSuffix="%"
        paused={hold}
        fixed={true}
        onComplete={() => setFinished(true)}
      />
    </div>
  );
}
