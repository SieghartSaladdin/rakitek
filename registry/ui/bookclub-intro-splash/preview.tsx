"use client";

import { useState } from "react";
import { BookclubIntroSplash } from "./component";

export default function BookclubIntroSplashPreview() {
  const [run, setRun] = useState(0);
  return (
    <div
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", backgroundColor: "var(--rk-bc-yellow, var(--rk-accent))" }}
    >
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        style={{ font: "inherit", fontWeight: 700, padding: "0.75em 1.5em", borderRadius: "999px", border: "0", cursor: "pointer", backgroundColor: "var(--rk-bc-black, var(--rk-fg))", color: "var(--rk-bc-white, var(--rk-bg))" }}
      >
        Replay intro
      </button>
      <BookclubIntroSplash
        key={run}
        id="intro-splash"
        logo={null}
        label=""
        show
        delay={0}
        speed={1}
        respectReducedMotion
        holdAfterDone
        failSafeMs={6000}
        onComplete={() => undefined}
      />
    </div>
  );
}
