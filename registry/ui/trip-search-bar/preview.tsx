"use client";

import { useState } from "react";
import { TripSearchBar, type TripSearchStep } from "./component";

export default function TripSearchBarPreview() {
  const [step, setStep] = useState<TripSearchStep>(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 max(10px, calc(100vw * 25 / 1440))",
        background: "var(--rk-fg)",
        color: "var(--rk-surface)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "67.8823529412em",
          fontSize: "max(17px, 1700svw / 1440)",
          lineHeight: 1.15,
        }}
      >
        <TripSearchBar
          isClicky
          activeStep={step}
          queryTitle="Search"
          queryPlaceholder="A region, a city..."
          datesTitle="When"
          dateLabel="Preferred dates"
          destinationsTitle="Where"
          destinationLabel="All destinations"
          onSelectStep={setStep}
          onSubmitClick={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}
