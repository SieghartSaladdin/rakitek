"use client";

import { FloatingPillNavbar } from "./component";

export default function FloatingPillNavbarPreview() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "var(--rk-fg)",
        color: "color-mix(in srgb, var(--rk-bg) 94%, var(--rk-fg))",
        fontFamily: "var(--rk-font-body)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <FloatingPillNavbar
        brandName="Oriel"
        links={[
          { label: "Home", targetId: "hero" },
          { label: "Catalog", targetId: "catalog" },
          { label: "Waitlist", targetId: "waitlist" },
        ]}
        contactLabel="Contact"
        copiedLabel="Copied"
        contactEmail="hello@oriel.studio"
      />
      <section id="hero" style={{ maxWidth: "760px" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--rk-font-display)",
            fontSize: "clamp(48px, 7.5vw, 96px)",
            fontWeight: 400,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
          }}
        >
          Quiet clarity for daily rituals.
        </h1>
        <p
          style={{
            margin: "24px auto 0",
            maxWidth: "460px",
            fontSize: "16px",
            lineHeight: 1.5,
            color: "color-mix(in srgb, var(--rk-fg-muted) 69%, var(--rk-bg))",
          }}
        >
          Click Contact in the floating pill above to copy the studio address and inspect the morphing confirmation state.
        </p>
      </section>
    </div>
  );
}
