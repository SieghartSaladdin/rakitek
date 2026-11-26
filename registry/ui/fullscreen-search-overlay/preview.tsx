"use client";

import { useState } from "react";
import { FullscreenSearchOverlay } from "./component";

export default function FullscreenSearchOverlayPreview() {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [durationRange, setDurationRange] = useState("0-999");
  const [dest, setDest] = useState({ href: "#all", label: "All destinations" });

  const dateLabel =
    startDate && endDate
      ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      : "Preferred dates";

  return (
    <div style={{ minHeight: "100vh", background: "var(--rk-fg)" }}>
      <FullscreenSearchOverlay
        isOpen
        initialStep="results"
        query={query}
        onQueryChange={setQuery}
        startDate={startDate}
        endDate={endDate}
        onDatesChange={(s, e) => {
          setStartDate(s);
          setEndDate(e);
        }}
        durationRange={durationRange}
        onDurationChange={setDurationRange}
        selectedDestinationHref={dest.href}
        selectedDestinationLabel={dest.label}
        onDestinationChange={(href, label) => setDest({ href, label })}
        dateLabel={dateLabel}
        onClose={() => {}}
      />
    </div>
  );
}
