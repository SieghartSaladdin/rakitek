"use client";

import { RightRailNavbar } from "./component";

export default function RightRailNavbarPreview() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "var(--rk-bg)",
        color: "var(--rk-fg)",
        boxSizing: "border-box",
      }}
    >
      <RightRailNavbar defaultOpen={false} />
      <main id="main" style={{ padding: "120px 142px 64px 52px", boxSizing: "border-box" }}>
        <h1
          style={{
            margin: 0,
            maxWidth: "12ch",
            fontFamily: "var(--rk-font-display)",
            fontSize: "clamp(3.2rem, 8.5vw, 7.5rem)",
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            textTransform: "var(--rk-display-transform)",
          }}
        >
          SMALL BATCH ROASTERY
        </h1>
      </main>
    </div>
  );
}
