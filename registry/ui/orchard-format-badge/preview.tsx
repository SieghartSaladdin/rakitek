"use client";

import { OrchardFormatBadge } from "./component";

export default function OrchardFormatBadgePreview() {
  return (
    <div style={{ padding: "32px", display: "flex", justifyContent: "center" }}>
      <OrchardFormatBadge
        label="Available weights"
        items={["240g", "1.2kg"]}
        align="start"
        responsiveCenter={false}
        variant="solid"
      />
    </div>
  );
}
