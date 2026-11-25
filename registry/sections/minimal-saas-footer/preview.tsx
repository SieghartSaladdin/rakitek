"use client";

import { MinimalSaasFooter } from "./component";

export default function MinimalSaasFooterPreview() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "var(--rk-fg)",
      }}
    >
      <MinimalSaasFooter
        brand="Oriel"
        tagline="Built by makers who got tired of autopilot."
        links={[{ label: "Contact", href: "mailto:hello@example.com" }]}
      />
    </div>
  );
}
