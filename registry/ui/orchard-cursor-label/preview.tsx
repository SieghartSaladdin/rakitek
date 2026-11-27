"use client";

import { useState } from "react";
import { OrchardCursorLabel } from "./component";

export default function OrchardCursorLabelPreview() {
  const [label, setLabel] = useState<string | null>(null);
  return (
    <div style={{ background: "var(--rk-bg)", minHeight: "100vh", padding: 40 }}>
      <div
        data-cursor-zone
        onMouseEnter={() => setLabel("Drag")}
        onMouseLeave={() => setLabel(null)}
        style={{ background: "var(--rk-surface)", borderRadius: "var(--rk-radius-md)", color: "var(--rk-fg)", fontFamily: "var(--rk-font-body)", height: 420, padding: 24 }}
      >
        Move the pointer over this area to show the cursor label.
      </div>
      <OrchardCursorLabel label={label} follow={0.12} jumpDistance={80} hideDelay={90} />
    </div>
  );
}
